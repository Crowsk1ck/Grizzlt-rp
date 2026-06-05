import { getAdminDb } from '../_firebaseAdmin.js';
import { readSession } from '../_auth.js';

function toJsonDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  return value;
}

function serializeApplication(snapshot) {
  if (!snapshot.exists) return null;
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: toJsonDate(data.createdAt),
    reviewedAt: toJsonDate(data.reviewedAt),
  };
}

export default async function handler(req, res) {
  const user = readSession(req);
  if (!user) {
    res.status(401).json({ error: 'Discord login required' });
    return;
  }

  try {
    const db = getAdminDb();
    const snapshot = await db.collection('applications').doc(user.id).get();
    res.status(200).json({ application: serializeApplication(snapshot) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
