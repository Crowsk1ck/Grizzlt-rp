# Firebase Firestore setup

## 1. Create Firebase project

Open https://console.firebase.google.com and create a project for Grizzly Family.

## 2. Add Web App

Project settings -> General -> Your apps -> Web app.

Copy the Firebase config values into Vercel Environment Variables:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 3. Create Firestore Database

Firestore Database -> Create database -> Production mode.

Use a region close to your players.

## 4. Publish security rules

In Firebase Console -> Firestore Database -> Rules, paste the contents of `firestore.rules`.

These rules allow the public site to create:

- `applications`
- `messages`

Reading, updating and deleting are blocked from the browser.

Applications use the Discord user ID as the Firestore document ID, so one Discord account can create only one application. The `/recruitment` form requires Discord Login.

## 5. Redeploy Vercel

After adding env variables in Vercel, redeploy the project.

Then test `/recruitment` and check Firestore collections.

## 6. Send applications to Discord

In Discord open your server settings:

1. Integrations -> Webhooks.
2. Create webhook.
3. Choose the channel for applications.
4. Copy webhook URL.
5. Add it to Vercel Environment Variables:

```env
DISCORD_APPLICATION_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

Redeploy Vercel after adding the webhook.

When a user submits `/recruitment`, the site writes the application to Firestore and sends an embed to Discord.

## 7. Admin panel

The website has a private `/admin` panel.

Add these Vercel environment variables:

```env
ADMIN_DISCORD_IDS=your_discord_id,another_admin_id
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

`FIREBASE_SERVICE_ACCOUNT` must be the full Firebase service account JSON, the same format used by the Railway bot.

The admin panel uses Discord Login session and Firebase Admin SDK. Browser Firestore rules still keep `applications` private.
