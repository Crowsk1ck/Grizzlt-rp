# Grizzly Discord Bot setup

Required Railway variables:

```env
DISCORD_BOT_TOKEN=...
DISCORD_SERVER_ID=...
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
DISCORD_APPLICATION_CHANNEL_ID=...
DISCORD_REPORT_CHANNEL_ID=...
```

Recommended optional variables:

```env
DISCORD_ACCEPTED_ROLE_ID=1390073033687044236
DISCORD_CANDIDATE_ROLE_ID=...
DISCORD_INTERVIEW_CHANNEL_URL=https://discord.com/channels/...
DISCORD_DM_FALLBACK_CHANNEL_ID=...
DISCORD_LOG_CHANNEL_ID=...
DISCORD_WELCOME_CHANNEL_ID=...
DISCORD_ADMIN_MENTION_ROLE_ID=...
DISCORD_NEWS_CHANNEL_ID=...
DISCORD_NEWS_MENTION_ROLE_ID=1390073033687044236
DISCORD_APPLICATION_THREAD_ENABLED=true
DISCORD_INTERVIEW_REMINDER_HOURS=24
DISCORD_EMBED_LOGO_URL=https://www.grizzly-family.online/assets/grizzly-logo.png
DISCORD_EMBED_BANNER_URL=https://www.grizzly-family.online/assets/grizzly-banner.png
```

## Features

- Syncs Discord members to Firestore:
  - `stats/discord_members`
  - `discord_members/{memberId}`
- Sends new applications to `DISCORD_APPLICATION_CHANNEL_ID`.
- Creates a thread under every application message.
- Gives `DISCORD_CANDIDATE_ROLE_ID` on new application if configured.
- Adds buttons:
  - `Прийняти`
  - `Співбесіда`
  - `Відхилити`
  - `Повторити DM` when DM fails
- Sends styled DMs to applicants.
- Gives `DISCORD_ACCEPTED_ROLE_ID` after accept.
- Removes candidate role after accept/reject.
- Sends welcome embeds to `DISCORD_WELCOME_CHANNEL_ID`.
- Sends action logs to `DISCORD_LOG_CHANNEL_ID`.
- Sends calculator reports to `DISCORD_REPORT_CHANNEL_ID`.
- Sends news embeds to `DISCORD_NEWS_CHANNEL_ID`.
- Mentions `DISCORD_NEWS_MENTION_ROLE_ID` on news posts.
- Reminds staff about interview applications after `DISCORD_INTERVIEW_REMINDER_HOURS`.
- Registers slash commands:
  - `/sync`
  - `/status`
  - `/warning`

## Discord permissions

Enable privileged intents in Discord Developer Portal:

- Server Members Intent
- Presence Intent

Bot permissions:

- View Channel
- Send Messages
- Embed Links
- Create Public Threads
- Send Messages in Threads
- Use Slash Commands
- Manage Roles if role automation is used

## DM note

Discord may block DMs if the user disabled messages from server members, left the server, or blocked the bot.

If DM fails, the bot stores:

- `dmSent: false`
- `dmError`
- `dmErrorCode`
- `dmErrorText`
- `dmUserId`

Set `DISCORD_DM_FALLBACK_CHANNEL_ID` to ping users in a public or ticket channel when DM fails.
