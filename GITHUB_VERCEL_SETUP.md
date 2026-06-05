# GitHub + Vercel setup

## 1. Create GitHub repository

Open https://github.com/new and create a repository, for example:

```text
grizzly-family-site
```

Keep it private if you do not want the source public.

## 2. Upload project files

Upload the project files from the GitHub-ready ZIP.

Do not upload:

- `node_modules`
- `dist`
- `outputs`
- `work`
- `.env`
- `.env.local`

## 3. Import repo into Vercel

In Vercel:

```text
Add New -> Project -> Import Git Repository
```

Choose the GitHub repo.

Use:

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

## 4. Add Environment Variables

Copy all existing env variables from the current Vercel upload project to the new GitHub-connected project.

Required:

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

## 5. Domain

After deploy, move or attach:

```text
www.grizzly-family.online
grizzly-family.online
```

to the GitHub-connected Vercel project.

## 6. Future updates

After this, every GitHub update can trigger a Vercel deploy automatically.
