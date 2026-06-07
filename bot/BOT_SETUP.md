# Grizzly Discord Bot setup

Required environment variables:

```env
DISCORD_BOT_TOKEN=...
DISCORD_SERVER_ID=...
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
DISCORD_APPLICATION_CHANNEL_ID=...
DISCORD_REPORT_CHANNEL_ID=...
```

Optional:

```env
DISCORD_ACCEPTED_ROLE_ID=...
DISCORD_INTERVIEW_CHANNEL_URL=https://discord.com/channels/...
DISCORD_DM_FALLBACK_CHANNEL_ID=...
DISCORD_NEWS_CHANNEL_ID=...
```

## What it does

- Syncs Discord members to Firestore:
  - `stats/discord_members`
  - `discord_members/{memberId}`
- Watches Firestore collection `applications`.
- Sends every new application to `DISCORD_APPLICATION_CHANNEL_ID`.
- Watches Firestore collection `calculator_reports`.
- Sends every admin calculator report to `DISCORD_REPORT_CHANNEL_ID`.
- Watches Firestore collection `discord_news_notifications`.
- Sends every admin website news post to `DISCORD_NEWS_CHANNEL_ID`.
- Adds buttons:
  - `Прийняти`
  - `Співбесіда`
  - `Відхилити`
- Updates application status in Firestore:
  - `accepted`
  - `interview`
  - `rejected`
- Sends the applicant a DM when a decision button is pressed.
- Saves `dmSent` and `dmError` in Firestore.
- Saves `dmErrorCode`, `dmErrorText` and `dmUserId` when Discord blocks DM.
- If `DISCORD_DM_FALLBACK_CHANNEL_ID` is set, sends a fallback message with mention to that channel when DM is blocked.
- Optionally gives `DISCORD_ACCEPTED_ROLE_ID` when accepted.

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

DM works only when the applicant logged in through Discord on the website and Discord allows the bot to message them. If user DMs are closed, the bot records `dmSent: false` and `dmError` in Firestore.

Common Discord DM block reasons:

- User has disabled direct messages from server members.
- User left the Discord server.
- User blocked the bot.
- Old Firestore application has no Discord ID.

The bot cannot bypass Discord privacy settings. Use `DISCORD_DM_FALLBACK_CHANNEL_ID` if you want the bot to ping the user in a public or ticket channel when DM fails.
