import { getAdminDb, serverTimestamp } from '../_firebaseAdmin.js';
import { isAdminUser, readSession } from '../_auth.js';

const allowedStatuses = new Set(['new', 'interview', 'accepted', 'rejected']);

function toJsonDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  return value;
}

function serializeApplication(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: toJsonDate(data.createdAt),
    reviewedAt: toJsonDate(data.reviewedAt),
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

export default async function handler(req, res) {
  const user = requireAdmin(req, res);
  if (!user) return;

  try {
    const db = getAdminDb();

    if (req.method === 'GET') {
      const snapshot = await db.collection('applications').orderBy('createdAt', 'desc').limit(200).get();
      res.status(200).json({
        applications: snapshot.docs.map(serializeApplication),
      });
      return;
    }

    if (req.method === 'PATCH') {
      const body = await readJsonBody(req);
      const { id, status } = body;

      if (!id || !allowedStatuses.has(status)) {
        res.status(400).json({ error: 'Invalid application id or status' });
        return;
      }

      const ref = db.collection('applications').doc(id);
      await ref.set(
        {
          status,
          reviewedBy: {
            id: user.id,
            username: user.username,
            globalName: user.globalName,
          },
          reviewedAt: serverTimestamp(),
        },
        { merge: true },
      );

      const updated = await ref.get();
      res.status(200).json({ application: serializeApplication(updated) });
      return;
    }

    res.setHeader('Allow', 'GET, PATCH');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
