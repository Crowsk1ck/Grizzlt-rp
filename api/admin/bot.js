import { isAdminUser, readSession } from '../_auth.js';
import { getAdminDb } from '../_firebaseAdmin.js';

function toJsonDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  return value;
}

function serializeDoc(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: toJsonDate(data.createdAt),
    updatedAt: toJsonDate(data.updatedAt),
    reviewedAt: toJsonDate(data.reviewedAt),
    sentAt: toJsonDate(data.sentAt),
    dmRetryAt: toJsonDate(data.dmRetryAt),
    interviewReminderAt: toJsonDate(data.interviewReminderAt),
  };
}

function requireAdmin(req, res) {
  const user = readSession(req);
  if (!user) {
    res.status(401).json({ error: 'Discord login required' });
    return null;
  }

  if (!isAdminUser(user)) {
    res.status(403).json({ error: 'Admin access required' });
    return null;
  }

  return user;
}

function envState(name) {
  return Boolean(process.env[name]);
}

export default async function handler(req, res) {
  const user = requireAdmin(req, res);
  if (!user) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const db = getAdminDb();
    const [applicationsSnapshot, warningsSnapshot, logsSnapshot, discordStatsDoc, reportsSnapshot, newsSnapshot] = await Promise.all([
      db.collection('applications').orderBy('createdAt', 'desc').limit(250).get().catch(() => ({ docs: [] })),
      db.collection('member_warnings').orderBy('createdAt', 'desc').limit(100).get().catch(() => ({ docs: [] })),
      db.collection('admin_logs').orderBy('createdAt', 'desc').limit(120).get().catch(() => ({ docs: [] })),
      db.collection('stats').doc('discord_members').get().catch(() => null),
      db.collection('calculator_reports').orderBy('createdAt', 'desc').limit(50).get().catch(() => ({ docs: [] })),
      db.collection('discord_news_notifications').orderBy('createdAt', 'desc').limit(50).get().catch(() => ({ docs: [] })),
    ]);

    const applications = applicationsSnapshot.docs.map(serializeDoc);
    const warnings = warningsSnapshot.docs.map(serializeDoc);
    const logs = logsSnapshot.docs.map(serializeDoc);
    const reports = reportsSnapshot.docs.map(serializeDoc);
    const news = newsSnapshot.docs.map(serializeDoc);

    const byStatus = applications.reduce((acc, item) => {
      const status = item.status || 'new';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const stats = {
      totalApplications: applications.length,
      newApplications: byStatus.new || 0,
      interviewApplications: byStatus.interview || 0,
      acceptedApplications: byStatus.accepted || 0,
      rejectedApplications: byStatus.rejected || 0,
      dmFailed: applications.filter((item) => item.dmSent === false).length,
      dmSent: applications.filter((item) => item.dmSent === true).length,
      withThreads: applications.filter((item) => item.discordThreadId).length,
      reminders: applications.filter((item) => item.interviewReminderSent).length,
      warnings: warnings.length,
      reports: reports.length,
      news: news.length,
      discordMembers: discordStatsDoc?.exists ? discordStatsDoc.data()?.members || 0 : 0,
      discordOnline: discordStatsDoc?.exists ? discordStatsDoc.data()?.online || 0 : 0,
    };

    res.status(200).json({
      stats,
      applications,
      warnings,
      logs,
      reports,
      news,
      botConfig: {
        applicationChannel: envState('DISCORD_APPLICATION_CHANNEL_ID'),
        reportChannel: envState('DISCORD_REPORT_CHANNEL_ID') || envState('DISCORD_CALCULATOR_REPORT_CHANNEL_ID'),
        newsChannel: envState('DISCORD_NEWS_CHANNEL_ID'),
        logChannel: envState('DISCORD_LOG_CHANNEL_ID'),
        welcomeChannel: envState('DISCORD_WELCOME_CHANNEL_ID'),
        dmFallbackChannel: envState('DISCORD_DM_FALLBACK_CHANNEL_ID'),
        acceptedRole: envState('DISCORD_ACCEPTED_ROLE_ID'),
        candidateRole: envState('DISCORD_CANDIDATE_ROLE_ID'),
        adminMentionRole: envState('DISCORD_ADMIN_MENTION_ROLE_ID'),
        newsMentionRole: envState('DISCORD_NEWS_MENTION_ROLE_ID'),
        threads: process.env.DISCORD_APPLICATION_THREAD_ENABLED !== 'false',
        interviewReminderHours: Number(process.env.DISCORD_INTERVIEW_REMINDER_HOURS || 24),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
