import { getAdminDb } from '../_firebaseAdmin.js';
import { readSession } from '../_auth.js';

export default async function handler(req, res) {
  const user = readSession(req);
  if (!user) {
    res.status(401).json({ error: 'Discord login required' });
    return;
  }

  try {
    const db = getAdminDb();
    const snapshot = await db.collection('discord_members').doc(user.id).get();
    res.status(200).json({
      member: snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
