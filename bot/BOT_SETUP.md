# Grizzly Discord Bot setup

Required environment variables for Railway:

```env
DISCORD_BOT_TOKEN=...
DISCORD_SERVER_ID=...
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
DISCORD_APPLICATION_CHANNEL_ID=...
DISCORD_REPORT_CHANNEL_ID=...
```

Optional:

```env
DISCORD_ACCEPTED_ROLE_ID=1390073033687044236
DISCORD_INTERVIEW_CHANNEL_URL=https://discord.com/channels/...
DISCORD_DM_FALLBACK_CHANNEL_ID=...
DISCORD_NEWS_CHANNEL_ID=...
DISCORD_EMBED_LOGO_URL=https://www.grizzly-family.online/assets/grizzly-logo.png
DISCORD_EMBED_BANNER_URL=https://www.grizzly-family.online/assets/grizzly-banner.png
```

## What it does

- Syncs Discord members to Firestore:
  - `stats/discord_members`
  - `discord_members/{memberId}`
- Watches Firestore collection `applications`.
- Sends every new application to `DISCORD_APPLICATION_CHANNEL_ID`.
- Adds decision buttons:
  - `Прийняти`
  - `Співбесіда`
  - `Відхилити`
- Sends the applicant a styled DM when a decision button is pressed.
- Optionally gives `DISCORD_ACCEPTED_ROLE_ID` when accepted.
- Watches Firestore collection `calculator_reports`.
- Sends every admin calculator report to `DISCORD_REPORT_CHANNEL_ID`.
- Watches Firestore collection `discord_news_notifications`.
- Sends every admin website news post to `DISCORD_NEWS_CHANNEL_ID`.
- Uses premium Grizzly embeds with logo, banner, colors and clean Ukrainian text.

## Discord bot settings

In Discord Developer Portal enable privileged intents:

- Server Members Intent
- Presence Intent

The bot needs permissions:

- View Channel
- Send Messages
- Embed Links
- Manage Roles only if `DISCORD_ACCEPTED_ROLE_ID` is used

## DM note

DM works only when the applicant logged in through Discord on the website and Discord allows the bot to message them.

If user DMs are closed, the bot records:

- `dmSent: false`
- `dmError`
- `dmErrorCode`
- `dmErrorText`
- `dmUserId`

Use `DISCORD_DM_FALLBACK_CHANNEL_ID` if you want the bot to ping the user in a public or ticket channel when DM fails.

## Embed branding

Default branding:

- Logo: `https://www.grizzly-family.online/assets/grizzly-logo.png`
- Banner: `https://www.grizzly-family.online/assets/grizzly-banner.png`

To use another image, set:

```env
DISCORD_EMBED_LOGO_URL=https://...
DISCORD_EMBED_BANNER_URL=https://...
```
