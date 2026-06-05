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
```

## What it does

- Syncs Discord members to Firestore:
  - `stats/discord_members`
  - `discord_members/{memberId}`
- Watches Firestore collection `applications`.
- Sends every new application to `DISCORD_APPLICATION_CHANNEL_ID`.
- Watches Firestore collection `calculator_reports`.
- Sends every admin calculator report to `DISCORD_REPORT_CHANNEL_ID`.
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
