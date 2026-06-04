import { clearSessionCookie, getOrigin } from '../_auth.js';

export default function handler(req, res) {
  res.setHeader('Set-Cookie', clearSessionCookie(req));
  res.redirect(`${getOrigin(req)}/`);
}
