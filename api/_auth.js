import crypto from 'node:crypto';

const sessionCookie = 'grizzly_session';
const stateCookie = 'grizzly_oauth_state';

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

function getSecret() {
  return process.env.DISCORD_SESSION_SECRET || process.env.DISCORD_CLIENT_SECRET || 'dev-only-change-me';
}

export function getOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return process.env.APP_URL || `${proto}://${host}`;
}

export function getRedirectUri(req) {
  const configured = process.env.DISCORD_REDIRECT_URI;
  if (configured && configured.includes('/api/auth/discord/callback') && !configured.includes('discord.com/oauth2')) {
    return configured;
  }

  return `${getOrigin(req)}/api/auth/discord/callback`;
}

export function parseCookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || '')
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const index = item.indexOf('=');
        return [item.slice(0, index), decodeURIComponent(item.slice(index + 1))];
      }),
  );
}

export function createStateCookie(state, req) {
  return serializeCookie(stateCookie, state, {
    httpOnly: true,
    maxAge: 600,
    sameSite: 'Lax',
    secure: getOrigin(req).startsWith('https://'),
    path: '/api/auth',
  });
}

export function clearStateCookie() {
  return serializeCookie(stateCookie, '', {
    httpOnly: true,
    maxAge: 0,
    sameSite: 'Lax',
    path: '/api/auth',
  });
}

export function createSessionCookie(user, req) {
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14;
  const payload = base64url(
    JSON.stringify({
      exp: expiresAt,
      user,
    }),
  );
  const token = `${payload}.${sign(payload, getSecret())}`;

  return serializeCookie(sessionCookie, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 14,
    sameSite: 'Lax',
    secure: getOrigin(req).startsWith('https://'),
    path: '/',
  });
}

export function clearSessionCookie(req) {
  return serializeCookie(sessionCookie, '', {
    httpOnly: true,
    maxAge: 0,
    sameSite: 'Lax',
    secure: getOrigin(req).startsWith('https://'),
    path: '/',
  });
}

export function readSession(req) {
  const token = parseCookies(req)[sessionCookie];
  if (!token) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = sign(payload, getSecret());
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) return null;

  return session.user;
}

export function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);

  return parts.join('; ');
}

export function getOAuthState(req) {
  return parseCookies(req)[stateCookie];
}
