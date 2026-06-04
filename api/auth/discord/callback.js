import { clearStateCookie, createSessionCookie, getOAuthState, getOrigin, getRedirectUri } from '../../_auth.js';

function avatarUrl(user) {
  if (!user.avatar) return `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator || 0) % 5}.png`;
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=160`;
}

export default async function handler(req, res) {
  const { code, state } = req.query;
  const savedState = getOAuthState(req);

  if (!code || !state || state !== savedState) {
    res.redirect(`${getOrigin(req)}/profile?authError=discord_state`);
    return;
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    res.redirect(`${getOrigin(req)}/profile?authError=discord_config`);
    return;
  }

  const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: getRedirectUri(req),
    }),
  });

  if (!tokenResponse.ok) {
    res.redirect(`${getOrigin(req)}/profile?authError=discord_token`);
    return;
  }

  const token = await tokenResponse.json();
  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  if (!userResponse.ok) {
    res.redirect(`${getOrigin(req)}/profile?authError=discord_user`);
    return;
  }

  const discordUser = await userResponse.json();
  const user = {
    id: discordUser.id,
    username: discordUser.username,
    globalName: discordUser.global_name,
    avatar: avatarUrl(discordUser),
  };

  res.setHeader('Set-Cookie', [createSessionCookie(user, req), clearStateCookie()]);
  res.redirect(`${getOrigin(req)}/profile`);
}
