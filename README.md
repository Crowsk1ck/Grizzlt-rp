# Grizzly Family GTA 5 RP

Premium React + Vite website for Grizzly Family with Discord Login, Firebase Firestore, Vercel API routes, application admin panel, live Discord roster, and news publishing.

## Stack

- React
- Vite
- Firebase Firestore
- Firebase Admin SDK for private Vercel API routes
- Discord OAuth2
- Vercel

## Local scripts

```bash
npm install
npm run dev
npm run build
```

## Vercel build settings

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

## Required Vercel environment variables

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
DISCORD_SESSION_SECRET=...
APP_URL=https://www.grizzly-family.online
DISCORD_REDIRECT_URI=https://www.grizzly-family.online/api/auth/discord/callback

ADMIN_DISCORD_IDS=...
FIREBASE_SERVICE_ACCOUNT=...
VITE_ACCEPTED_ROLE_ID=1390073033687044236
```

Optional if not using the Railway bot:

```env
DISCORD_APPLICATION_WEBHOOK_URL=...
```

## Firebase

Publish `firestore.rules` in Firebase Console. See `FIREBASE_SETUP.md` for details.

## Important

Do not commit real `.env` files or Firebase service account secrets.
