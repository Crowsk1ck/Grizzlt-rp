import { readSession } from '../_auth.js';

export default function handler(req, res) {
  const user = readSession(req);
  res.status(200).json({ user });
}
