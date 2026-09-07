# Grizzly Family — Netlify deployment

This project was migrated from Vercel API routes to Netlify Functions while keeping the existing public `/api/...` URLs used by the frontend.

## 1. Netlify build settings

`netlify.toml` already configures:

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

## 2. Required Netlify environment variables

In **Netlify → Project configuration → Environment variables**, add the real values for:

```text
APP_URL=https://grizzly-family.online
DISCORD_REDIRECT_URI=https://grizzly-family.online/api/auth/discord/callback
DISCORD_CLIENT_ID=YOUR_DISCORD_CLIENT_ID
DISCORD_CLIENT_SECRET=YOUR_DISCORD_CLIENT_SECRET
DISCORD_SESSION_SECRET=GENERATE_A_LONG_RANDOM_SECRET
ADMIN_DISCORD_IDS=DISCORD_ID_1,DISCORD_ID_2
FIREBASE_SERVICE_ACCOUNT={...full Firebase service account JSON...}
DISCORD_APPLICATION_WEBHOOK_URL=YOUR_WEBHOOK_URL
```

Keep all existing `VITE_FIREBASE_*` frontend variables that the current site already uses.

Optional variables used by the project can remain as they are (`DISCORD_EMBED_LOGO_URL`, `DISCORD_EMBED_BANNER_URL`, bot variables, etc.).

**Never commit client secrets, session secrets, service-account JSON, or webhook URLs to GitHub.**

## 3. Discord Developer Portal

For the Discord application matching `DISCORD_CLIENT_ID`, add this exact OAuth2 redirect URI:

```text
https://grizzly-family.online/api/auth/discord/callback
```

The URI must exactly match `DISCORD_REDIRECT_URI` in Netlify.

## 4. Deploy

Push/import this repository to Netlify, or deploy it from the connected Git repository. After environment variables are saved, trigger a fresh production deploy.

Test in this order:

1. `https://grizzly-family.online/api/auth/me` → should return JSON, not Netlify 404.
2. `https://grizzly-family.online/api/auth/discord/login` → should redirect to Discord.
3. Complete Discord authorization → should return to `/profile` and create the session cookie.

## API routes migrated

- `/api/auth/discord/login`
- `/api/auth/discord/callback`
- `/api/auth/me`
- `/api/auth/logout`
- `/api/admin/applications`
- `/api/admin/bot`
- `/api/admin/members`
- `/api/admin/news`
- `/api/applications/me`
- `/api/calculator/entries`
- `/api/discord/application`
- `/api/members/me`
- `/api/members/profile`
