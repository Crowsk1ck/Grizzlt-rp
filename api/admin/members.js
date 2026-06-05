import { getAdminDb, serverTimestamp } from '../_firebaseAdmin.js';
import { isAdminUser, readSession } from '../_auth.js';

function toJsonDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  return value;
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');

  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function cleanText(value, max = 200) {
  return String(value || '').trim().slice(0, max);
}

function cleanNumber(value, max = 1000000000) {
  const number = Math.round(Number(value || 0));
  if (!Number.isFinite(number)) return 0;
  return Math.min(max, Math.max(0, number));
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

function serializeDoc(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: toJsonDate(data.createdAt),
    updatedAt: toJsonDate(data.updatedAt),
    reviewedAt: toJsonDate(data.reviewedAt),
  };
}

function serializeWarning(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: toJsonDate(data.createdAt),
  };
}

function serializeLog(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: toJsonDate(data.createdAt),
  };
}

async function writeAdminLog(db, user, action, targetId, details = {}) {
  await db.collection('admin_logs').add({
    action,
    targetId,
    details,
    admin: {
      id: user.id,
      username: user.username,
      globalName: user.globalName,
    },
    createdAt: serverTimestamp(),
  });
}

function sanitizeProfile(profile = {}) {
  return {
    rpNickname: cleanText(profile.rpNickname, 80),
    rank: cleanText(profile.rank, 80),
    position: cleanText(profile.position, 100),
    salary: cleanNumber(profile.salary),
    vehicle: cleanText(profile.vehicle, 120),
    business: cleanText(profile.business, 120),
    status: cleanText(profile.status || 'active', 40),
    note: cleanText(profile.note, 1000),
  };
}

async function readDashboard(db) {
  const [membersSnapshot, profilesSnapshot, warningsSnapshot, applicationsSnapshot, logsSnapshot] = await Promise.all([
    db.collection('discord_members').limit(500).get(),
    db.collection('member_profiles').limit(500).get(),
    db.collection('member_warnings').limit(500).get(),
    db.collection('applications').orderBy('createdAt', 'desc').limit(500).get().catch(() => ({ docs: [] })),
    db.collection('admin_logs').orderBy('createdAt', 'desc').limit(100).get().catch(() => ({ docs: [] })),
  ]);

  const profiles = new Map(profilesSnapshot.docs.map((doc) => [doc.id, serializeDoc(doc)]));
  const applications = new Map(applicationsSnapshot.docs.map((doc) => [doc.id, serializeDoc(doc)]));
  const warnings = warningsSnapshot.docs
    .map(serializeWarning)
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

  const memberMap = new Map();

  membersSnapshot.docs.forEach((doc) => {
    const data = serializeDoc(doc);
    if (data.bot) return;
    memberMap.set(doc.id, data);
  });

  applications.forEach((application, id) => {
    if (memberMap.has(id)) return;
    memberMap.set(id, {
      id,
      username: application.discordUser?.username || application.discord || application.nickname || id,
      nickname: application.nickname || application.discordUser?.globalName || application.discord || id,
      avatar: application.discordUser?.avatar || null,
      online: false,
      roles: [],
      bot: false,
      fromApplication: true,
      applicationStatus: application.status || 'new',
    });
  });

  profiles.forEach((profile, id) => {
    if (memberMap.has(id)) return;
    memberMap.set(id, {
      id,
      username: profile.rpNickname || id,
      nickname: profile.rpNickname || id,
      avatar: null,
      online: false,
      roles: [],
      bot: false,
      fromProfile: true,
    });
  });

  const members = [...memberMap.values()]
    .map((member) => ({
      ...member,
      profile: profiles.get(member.id) || null,
      application: applications.get(member.id) || null,
      warnings: warnings.filter((warning) => warning.memberId === member.id),
    }))
    .sort((a, b) => String(a.nickname || a.username).localeCompare(String(b.nickname || b.username), 'uk'));

  return {
    members,
    profiles: [...profiles.values()],
    warnings,
    logs: logsSnapshot.docs.map(serializeLog),
  };
}

export default async function handler(req, res) {
  const user = requireAdmin(req, res);
  if (!user) return;

  try {
    const db = getAdminDb();

    if (req.method === 'GET') {
      res.status(200).json(await readDashboard(db));
      return;
    }

    const body = await readJsonBody(req);

    if (req.method === 'PATCH') {
      const memberId = cleanText(body.memberId, 80);
      if (!memberId) {
        res.status(400).json({ error: 'memberId is required' });
        return;
      }

      const profile = sanitizeProfile(body.profile);
      await db.collection('member_profiles').doc(memberId).set(
        {
          ...profile,
          updatedBy: {
            id: user.id,
            username: user.username,
            globalName: user.globalName,
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      await writeAdminLog(db, user, 'member_profile_updated', memberId, profile);
      res.status(200).json(await readDashboard(db));
      return;
    }

    if (req.method === 'POST') {
      const memberId = cleanText(body.memberId, 80);
      const reason = cleanText(body.reason, 1000);
      const level = cleanText(body.level || 'warning', 40);

      if (!memberId || reason.length < 3) {
        res.status(400).json({ error: 'memberId and reason are required' });
        return;
      }

      const warningRef = await db.collection('member_warnings').add({
        memberId,
        reason,
        level,
        createdBy: {
          id: user.id,
          username: user.username,
          globalName: user.globalName,
        },
        createdAt: serverTimestamp(),
      });

      await writeAdminLog(db, user, 'member_warning_added', memberId, { warningId: warningRef.id, level, reason });
      res.status(200).json(await readDashboard(db));
      return;
    }

    if (req.method === 'DELETE') {
      const warningId = cleanText(body.warningId, 120);
      if (!warningId) {
        res.status(400).json({ error: 'warningId is required' });
        return;
      }

      const warningDoc = await db.collection('member_warnings').doc(warningId).get();
      await db.collection('member_warnings').doc(warningId).delete();
      await writeAdminLog(db, user, 'member_warning_deleted', warningDoc.data()?.memberId || warningId, { warningId });
      res.status(200).json(await readDashboard(db));
      return;
    }

    res.setHeader('Allow', 'GET, PATCH, POST, DELETE');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
