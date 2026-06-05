import { getAdminDb, serverTimestamp } from '../_firebaseAdmin.js';
import { isAdminUser, readSession } from '../_auth.js';

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

export default async function handler(req, res) {
  const user = requireAdmin(req, res);
  if (!user) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const title = String(body.title || '').trim();
    const text = String(body.text || '').trim();
    const tag = String(body.tag || 'Grizzly Bulletin').trim();

    if (title.length < 3 || title.length > 120) {
      res.status(400).json({ error: 'Title must be 3-120 characters' });
      return;
    }

    if (text.length < 10 || text.length > 2000) {
      res.status(400).json({ error: 'Text must be 10-2000 characters' });
      return;
    }

    const db = getAdminDb();
    const ref = await db.collection('news').add({
      title,
      text,
      tag: tag || 'Grizzly Bulletin',
      author: {
        id: user.id,
        username: user.username,
        globalName: user.globalName,
      },
      createdAt: serverTimestamp(),
    });

    await db.collection('discord_news_notifications').doc(ref.id).set({
      newsId: ref.id,
      title,
      text,
      tag: tag || 'Grizzly Bulletin',
      requestedBy: {
        id: user.id,
        username: user.username,
        globalName: user.globalName,
      },
      createdAt: serverTimestamp(),
    });

    await writeAdminLog(db, user, 'news_published', ref.id, { title, tag: tag || 'Grizzly Bulletin' });

    res.status(200).json({ id: ref.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
