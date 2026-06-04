import crypto from 'node:crypto';
import { createStateCookie, getOrigin, getRedirectUri } from '../../_auth.js';

export default function handler(req, res) {
  const clientId = process.env.DISCORD_CLIENT_ID;

  if (!clientId) {
    res.redirect(`${getOrigin(req)}/profile?authError=discord_config`);
    return;
  }

  const state = crypto.randomBytes(24).toString('base64url');
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(req),
    response_type: 'code',
    scope: 'identify',
    state,
  });

  res.setHeader('Set-Cookie', createStateCookie(state, req));
  res.redirect(`https://discord.com/oauth2/authorize?${params.toString()}`);
}
