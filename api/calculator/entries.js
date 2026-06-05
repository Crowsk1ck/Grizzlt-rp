import { isAdminUser, readSession } from '../_auth.js';
import { getAdminDb, serverTimestamp } from '../_firebaseAdmin.js';

const acceptedRoleId = process.env.ACCEPTED_ROLE_ID || process.env.VITE_ACCEPTED_ROLE_ID || '1390073033687044236';
const allowedKinds = new Set(['contracts', 'money', 'bonus']);

function toJsonDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  return value;
}

function cleanText(value, max) {
  return String(value || '').trim().slice(0, max);
}

function serializeEntry(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: toJsonDate(data.createdAt),
  };
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

async function canUseCalculator(db, user) {
  if (!user?.id) return false;
  if (isAdminUser(user)) return true;

  const member = await db.collection('discord_members').doc(user.id).get();
  const roles = member.exists ? member.data()?.roles : [];

  return Array.isArray(roles) && roles.includes(acceptedRoleId);
}

function getQueryId(req) {
  if (req.query?.id) return String(req.query.id);
  try {
    const url = new URL(req.url, 'https://grizzly.local');
    return url.searchParams.get('id');
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const user = readSession(req);
  if (!user) {
    res.status(401).json({ error: 'Discord login required' });
    return;
  }

  try {
    const db = getAdminDb();
    const hasAccess = await canUseCalculator(db, user);

    if (!hasAccess) {
      res.status(403).json({ error: 'Family role required' });
      return;
    }

    const collection = db.collection('calculator_entries');

    if (req.method === 'GET') {
      const snapshot = await collection.orderBy('createdAt', 'desc').limit(300).get();
      res.status(200).json({ entries: snapshot.docs.map(serializeEntry) });
      return;
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const playerName = cleanText(body.playerName, 80);
      const note = cleanText(body.note, 220);
      const kind = allowedKinds.has(body.kind) ? body.kind : 'money';
      const amount = Number(body.amount);

      if (playerName.length < 2 || !Number.isFinite(amount) || amount <= 0 || amount > 1000000000) {
        res.status(400).json({ error: 'Invalid calculator entry' });
        return;
      }

      const ref = await collection.add({
        playerName,
        note,
        kind,
        amount: Math.round(amount),
        createdAt: serverTimestamp(),
        createdBy: {
          id: user.id,
          username: user.username,
          globalName: user.globalName,
        },
      });

      const created = await ref.get();
      res.status(201).json({ entry: serializeEntry(created) });
      return;
    }

    if (req.method === 'DELETE') {
      const body = await readJsonBody(req).catch(() => ({}));
      const id = cleanText(body.id || getQueryId(req), 120);

      if (!id) {
        res.status(400).json({ error: 'Entry id required' });
        return;
      }

      const ref = collection.doc(id);
      const entry = await ref.get();
      if (!entry.exists) {
        res.status(404).json({ error: 'Entry not found' });
        return;
      }

      const data = entry.data();
      const ownsEntry = data.createdBy?.id === user.id;
      if (!isAdminUser(user) && !ownsEntry) {
        res.status(403).json({ error: 'Only admins or entry author can delete it' });
        return;
      }

      await ref.delete();
      res.status(200).json({ ok: true, id });
      return;
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
