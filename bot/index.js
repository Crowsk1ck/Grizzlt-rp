import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import admin from 'firebase-admin';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const SERVER_ID = process.env.DISCORD_SERVER_ID;
const APPLICATION_CHANNEL_ID = process.env.DISCORD_APPLICATION_CHANNEL_ID;
const DM_FALLBACK_CHANNEL_ID = process.env.DISCORD_DM_FALLBACK_CHANNEL_ID;
const CONTACT_CHANNEL_ID =
  process.env.DISCORD_CONTACT_CHANNEL_ID ||
  process.env.DISCORD_MESSAGES_CHANNEL_ID ||
  APPLICATION_CHANNEL_ID;
const REPORT_CHANNEL_ID =
  process.env.DISCORD_REPORT_CHANNEL_ID ||
  process.env.DISCORD_CALCULATOR_REPORT_CHANNEL_ID ||
  APPLICATION_CHANNEL_ID;
const NEWS_CHANNEL_ID = process.env.DISCORD_NEWS_CHANNEL_ID;
const ACCEPTED_ROLE_ID = process.env.DISCORD_ACCEPTED_ROLE_ID;
const NEWS_MENTION_ROLE_ID = process.env.DISCORD_NEWS_MENTION_ROLE_ID || ACCEPTED_ROLE_ID;
const CANDIDATE_ROLE_ID = process.env.DISCORD_CANDIDATE_ROLE_ID;
const LOG_CHANNEL_ID = process.env.DISCORD_LOG_CHANNEL_ID;
const WELCOME_CHANNEL_ID = process.env.DISCORD_WELCOME_CHANNEL_ID;
const ADMIN_MENTION_ROLE_ID = process.env.DISCORD_ADMIN_MENTION_ROLE_ID;
const APPLICATION_THREAD_ENABLED = process.env.DISCORD_APPLICATION_THREAD_ENABLED !== 'false';
const INTERVIEW_REMINDER_HOURS = Number(process.env.DISCORD_INTERVIEW_REMINDER_HOURS || 24);
const INTERVIEW_CHANNEL_URL = process.env.DISCORD_INTERVIEW_CHANNEL_URL;

const SITE_URL = (process.env.APP_URL || 'https://www.grizzly-family.online').replace(/\/$/, '');
const LOGO_URL = process.env.DISCORD_EMBED_LOGO_URL || `${SITE_URL}/assets/grizzly-logo.png`;
const BANNER_URL = process.env.DISCORD_EMBED_BANNER_URL || `${SITE_URL}/assets/grizzly-banner.png`;

const colors = {
  pink: 0xff005c,
  blue: 0x00c8ff,
  green: 0x22ffa6,
  red: 0xff2d55,
  amber: 0xffb020,
  violet: 0x8f2cff,
};

let syncMembersHandler = async () => {
  throw new Error('Sync is not ready yet');
};

function clean(value, fallback = '-') {
  const text = String(value || fallback).trim();
  return (text || fallback).slice(0, 1024);
}

function cleanLong(value, fallback = '-') {
  const text = String(value || fallback).trim();
  return (text || fallback).slice(0, 1800);
}

function isDiscordId(value) {
  return /^\d{17,22}$/.test(String(value || ''));
}

function applicationDiscordId(data, applicationId) {
  if (data.discordUser?.id) return data.discordUser.id;
  if (isDiscordId(applicationId)) return applicationId;
  return null;
}

function userLine(data, applicationId) {
  const userId = applicationDiscordId(data, applicationId);
  if (userId) return `<@${userId}>`;
  return clean(data.discord);
}

function formatMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return clean(value);
  return `$ ${amount.toLocaleString('en-US')}`;
}

function field(name, value, inline = true) {
  return {
    name,
    value: clean(value),
    inline,
  };
}

function isStaffInteraction(interaction) {
  if (interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) return true;
  if (!ADMIN_MENTION_ROLE_ID) return false;
  return Boolean(interaction.member?.roles?.cache?.has(ADMIN_MENTION_ROLE_ID));
}

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function botConfigSnapshot() {
  return {
    applicationChannel: Boolean(APPLICATION_CHANNEL_ID),
    contactChannel: Boolean(CONTACT_CHANNEL_ID),
    reportChannel: Boolean(REPORT_CHANNEL_ID),
    newsChannel: Boolean(NEWS_CHANNEL_ID),
    logChannel: Boolean(LOG_CHANNEL_ID),
    welcomeChannel: Boolean(WELCOME_CHANNEL_ID),
    dmFallbackChannel: Boolean(DM_FALLBACK_CHANNEL_ID),
    acceptedRole: Boolean(ACCEPTED_ROLE_ID),
    candidateRole: Boolean(CANDIDATE_ROLE_ID),
    adminMentionRole: Boolean(ADMIN_MENTION_ROLE_ID),
    newsMentionRole: Boolean(NEWS_MENTION_ROLE_ID),
    threads: APPLICATION_THREAD_ENABLED,
    interviewReminderHours: Number.isFinite(INTERVIEW_REMINDER_HOURS) ? INTERVIEW_REMINDER_HOURS : 24,
  };
}

async function writeBotStatus(extra = {}) {
  await db.collection('bot_status').doc('main').set(
    {
      online: true,
      botId: client.user?.id || null,
      botTag: client.user?.tag || null,
      config: botConfigSnapshot(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...extra,
    },
    { merge: true },
  ).catch((error) => {
    console.error('Bot status write failed', error);
  });
}

function baseEmbed({ title, description, color = colors.pink, image = false }) {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setAuthor({
      name: 'Grizzly Family | GTA 5 RP',
      iconURL: LOGO_URL,
      url: SITE_URL,
    })
    .setTitle(title)
    .setTimestamp(new Date())
    .setFooter({
      text: 'grizzly-family.online',
      iconURL: LOGO_URL,
    })
    .setThumbnail(LOGO_URL);

  if (description) {
    embed.setDescription(cleanLong(description));
  }

  if (image) {
    embed.setImage(typeof image === 'string' ? image : BANNER_URL);
  }

  return embed;
}

async function fetchSendableChannel(channelId) {
  if (!channelId) return null;
  const channel = await client.channels.fetch(channelId).catch(() => null);
  return channel?.send ? channel : null;
}

async function sendLogEmbed(title, description, fields = [], color = colors.violet) {
  const channel = await fetchSendableChannel(LOG_CHANNEL_ID);
  if (!channel) return null;

  return channel.send({
    embeds: [
      baseEmbed({
        title,
        description,
        color,
      }).addFields(fields.filter(Boolean)),
    ],
  }).catch((error) => {
    console.error('Log embed failed', error);
    return null;
  });
}

function retryDmButton(id) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`application:retrydm:${id}`)
      .setLabel('Повторити DM')
      .setStyle(ButtonStyle.Secondary),
  );
}

function welcomeEmbed(data, userId) {
  return baseEmbed({
    title: 'Новий учасник Grizzly Family',
    description: [
      `<@${userId}> тепер у родині.`,
      'Вітаємо в Grizzly Family. Тримай стиль, поважай правила і будь активним у Discord.',
    ].join('\n'),
    color: colors.green,
    image: true,
  }).addFields(
    field('Нік', data.nickname),
    field('Статус', 'Прийнято'),
  );
}

async function sendWelcomeMessage(data, applicationId) {
  const userId = applicationDiscordId(data, applicationId);
  const channel = await fetchSendableChannel(WELCOME_CHANNEL_ID);

  if (!channel || !userId) return null;

  return channel.send({
    content: `<@${userId}>`,
    embeds: [welcomeEmbed(data, userId)],
    allowedMentions: {
      users: [userId],
    },
  }).catch((error) => {
    console.error('Welcome message failed', error);
    return null;
  });
}

async function updateApplicantRoles(status, data, applicationId) {
  const userId = applicationDiscordId(data, applicationId);
  if (!userId || !SERVER_ID) {
    return {
      roleAdded: false,
      candidateRemoved: false,
      reason: 'missing_user_or_server',
    };
  }

  const guild = await client.guilds.fetch(SERVER_ID);
  const member = await guild.members.fetch(userId).catch(() => null);

  if (!member) {
    return {
      roleAdded: false,
      candidateRemoved: false,
      reason: 'member_not_found',
    };
  }

  let roleAdded = false;
  let candidateAdded = false;
  let candidateRemoved = false;

  if (status === 'new' && CANDIDATE_ROLE_ID) {
    try {
      await member.roles.add(CANDIDATE_ROLE_ID);
      candidateAdded = true;
    } catch (error) {
      console.error('Candidate role add failed', error);
    }
  }

  if (['accepted', 'rejected'].includes(status) && CANDIDATE_ROLE_ID) {
    try {
      await member.roles.remove(CANDIDATE_ROLE_ID);
      candidateRemoved = true;
    } catch (error) {
      console.error('Candidate role remove failed', error);
    }
  }

  if (status === 'accepted' && ACCEPTED_ROLE_ID) {
    try {
      await member.roles.add(ACCEPTED_ROLE_ID);
      roleAdded = true;
    } catch (error) {
      console.error('Accepted role add failed', error);
    }
  }

  return {
    roleAdded,
    candidateAdded,
    candidateRemoved,
    reason: null,
  };
}

async function createApplicationThread(message, id, data) {
  if (!APPLICATION_THREAD_ENABLED || !message?.startThread) return null;

  return message.startThread({
    name: `Заявка ${clean(data.nickname, id).slice(0, 70)}`,
    autoArchiveDuration: 1440,
    reason: `Application ${id}`,
  }).catch((error) => {
    console.error('Application thread failed', error);
    return null;
  });
}

function statusConfig(status) {
  const config = {
    new: {
      label: 'Нова заявка',
      color: colors.pink,
    },
    accepted: {
      label: 'Прийнято',
      color: colors.green,
    },
    interview: {
      label: 'Співбесіда',
      color: colors.blue,
    },
    rejected: {
      label: 'Відхилено',
      color: colors.red,
    },
  };

  return config[status] || {
    label: clean(status, 'Оновлено'),
    color: colors.violet,
  };
}

function dmFailureText(result) {
  if (result.code === 50007 || String(result.reason).includes('Cannot send messages to this user')) {
    return 'У користувача закриті особисті повідомлення від учасників сервера або він заблокував DM.';
  }

  if (result.code === 10013) {
    return 'Discord не знайшов цього користувача. Можливо, ID неправильний або акаунт недоступний.';
  }

  if (result.reason === 'missing_discord_user') {
    return 'У заявці немає Discord ID. Таку заявку треба обробити вручну.';
  }

  if (result.reason === 'user_not_found') {
    return 'Бот не зміг знайти користувача Discord за ID.';
  }

  return result.reason || 'Discord не дозволив відправити DM.';
}

function decisionLabel(status) {
  return statusConfig(status).label.toLowerCase();
}

function splitReport(text) {
  const source = String(text || '');
  const chunks = [];

  for (let index = 0; index < source.length; index += 1800) {
    chunks.push(source.slice(index, index + 1800));
  }

  return chunks.length ? chunks : ['-'];
}

function applicationEmbed(id, data) {
  const status = statusConfig(data.status || 'new');
  const discordId = applicationDiscordId(data, id);

  return baseEmbed({
    title: data.status ? `Заявка оновлена: ${status.label}` : 'Нова заявка в Grizzly Family',
    description: [
      `Кандидат **${clean(data.nickname, 'Без ніку')}** подав заявку на вступ до родини.`,
      'Перевір анкету, Discord і прийми рішення кнопками нижче.',
    ].join('\n'),
    color: status.color,
  })
    .addFields(
      field('Кандидат', data.nickname),
      field('Discord', userLine(data, id)),
      field('Вік', data.age),
      field('Онлайн', data.online),
      field('Статус', status.label),
      field('Discord ID', discordId || '-'),
      field('Firestore ID', id),
      {
        name: 'Про себе / досвід',
        value: cleanLong(data.message),
        inline: false,
      },
    );
}

function applicationButtons(id) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`application:accepted:${id}`)
      .setLabel('Прийняти')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`application:interview:${id}`)
      .setLabel('Співбесіда')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`application:rejected:${id}`)
      .setLabel('Відхилити')
      .setStyle(ButtonStyle.Danger),
  );
}

function decisionDmEmbed(status, data) {
  const config = {
    accepted: {
      title: 'Заявку прийнято',
      color: colors.green,
      text: [
        'Вітаємо, тебе прийнято до Grizzly Family.',
        'Очікуй подальші інструкції від старшого складу та не забудь перевірити Discord-канали родини.',
      ].join('\n'),
      next: 'Тобі видали роль родини. Якщо роль не зʼявилась одразу, зачекай кілька хвилин або напиши старшому складу.',
    },
    interview: {
      title: 'Запрошення на співбесіду',
      color: colors.blue,
      text: 'Твою заявку розглянули. Потрібна коротка співбесіда перед вступом.',
      next: INTERVIEW_CHANNEL_URL
        ? `Перейди в канал співбесіди: ${INTERVIEW_CHANNEL_URL}`
        : 'З тобою звʼяжеться старший склад і підкаже час співбесіди.',
    },
    rejected: {
      title: 'Заявку відхилено',
      color: colors.red,
      text: 'Дякуємо за інтерес до Grizzly Family. Цього разу заявку відхилено.',
      next: 'Можеш спробувати ще раз пізніше, коли будеш готовий до вимог родини.',
    },
  };

  const item = config[status] || {
    title: 'Статус заявки оновлено',
    color: colors.violet,
    text: `Новий статус заявки: ${clean(status)}`,
    next: 'Слідкуй за повідомленнями від старшого складу.',
  };

  return baseEmbed({
    title: item.title,
    description: item.text,
    color: item.color,
    image: false,
  }).addFields(
    field('Твій нік', data.nickname),
    field('Родина', 'Grizzly Family'),
    {
      name: 'Наступний крок',
      value: cleanLong(item.next),
      inline: false,
    },
  );
}

async function sendDecisionDm(status, data, applicationId) {
  const userId = applicationDiscordId(data, applicationId);

  if (!userId) {
    return {
      ok: false,
      reason: 'missing_discord_user',
      userId: null,
    };
  }

  const user = await client.users.fetch(userId, { force: true }).catch(() => null);

  if (!user) {
    return {
      ok: false,
      reason: 'user_not_found',
      userId,
    };
  }

  try {
    await user.send({
      embeds: [decisionDmEmbed(status, data)],
    });
  } catch (error) {
    return {
      ok: false,
      reason: error.message,
      code: error.code,
      userId,
    };
  }

  return {
    ok: true,
    userId,
  };
}

async function sendDmFallbackNotice(status, data, applicationId, dmResult) {
  if (dmResult.ok || !DM_FALLBACK_CHANNEL_ID) {
    return null;
  }

  const channel = await client.channels.fetch(DM_FALLBACK_CHANNEL_ID).catch(() => null);

  if (!channel?.send) {
    return null;
  }

  const userId = dmResult.userId || applicationDiscordId(data, applicationId);
  const mention = userId ? `<@${userId}>` : clean(data.discord);

  return channel.send({
    content: [
      `${mention}, статус твоєї заявки: **${decisionLabel(status)}**.`,
      'Бот не зміг написати тобі в особисті повідомлення.',
      dmFailureText(dmResult),
    ].join('\n'),
    embeds: [decisionDmEmbed(status, data)],
    allowedMentions: {
      users: userId ? [userId] : [],
    },
  });
}

async function sendDmFallbackNoticeSafe(status, data, applicationId, dmResult) {
  if (dmResult.ok) {
    return {
      ok: false,
      skipped: true,
      reason: 'dm_sent',
    };
  }

  if (!DM_FALLBACK_CHANNEL_ID) {
    console.warn('DM fallback skipped | DISCORD_DM_FALLBACK_CHANNEL_ID is missing');
    return {
      ok: false,
      skipped: true,
      reason: 'missing_fallback_channel',
    };
  }

  const channel = await fetchSendableChannel(DM_FALLBACK_CHANNEL_ID);

  if (!channel) {
    console.warn(`DM fallback skipped | Channel ${DM_FALLBACK_CHANNEL_ID} not found or not sendable`);
    return {
      ok: false,
      skipped: true,
      reason: 'fallback_channel_not_sendable',
    };
  }

  const userId = dmResult.userId || applicationDiscordId(data, applicationId);
  const mention = userId ? `<@${userId}>` : clean(data.discord);
  const message = await channel.send({
    content: [
      `${mention}, статус твоєї заявки: **${decisionLabel(status)}**.`,
      'Бот не зміг написати тобі в особисті повідомлення, тому дублюю рішення тут.',
      dmFailureText(dmResult),
    ].join('\n'),
    embeds: [decisionDmEmbed(status, data)],
    allowedMentions: {
      users: userId ? [userId] : [],
    },
  });

  console.log(`DM fallback sent | Channel: ${DM_FALLBACK_CHANNEL_ID} | Application: ${applicationId}`);

  return {
    ok: true,
    channelId: channel.id,
    messageId: message.id,
  };
}

async function startApplicationListener() {
  if (!APPLICATION_CHANNEL_ID) {
    console.log('Applications listener skipped | DISCORD_APPLICATION_CHANNEL_ID is missing');
    return;
  }

  const channel = await client.channels.fetch(APPLICATION_CHANNEL_ID);

  db.collection('applications').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type !== 'added') return;

      const doc = change.doc;
      const data = doc.data();

      if (data.botNotified) return;

      const message = await channel.send({
        embeds: [applicationEmbed(doc.id, data)],
        components: [applicationButtons(doc.id)],
      });

      const roleResult = await updateApplicantRoles('new', data, doc.id).catch((error) => {
        console.error('Candidate role update failed', error);
        return null;
      });

      const thread = await createApplicationThread(message, doc.id, data);

      await doc.ref.set(
        {
          botNotified: true,
          discordMessageId: message.id,
          discordThreadId: thread?.id || null,
          status: data.status || 'new',
          candidateRoleGiven: Boolean(roleResult?.candidateAdded),
        },
        { merge: true },
      );

      await sendLogEmbed(
        'Нова заявка',
        `${userLine(data, doc.id)} подав заявку в Grizzly Family.`,
        [
          field('Кандидат', data.nickname),
          field('Discord ID', applicationDiscordId(data, doc.id) || '-'),
          field('Thread', thread ? `<#${thread.id}>` : '-'),
          field('Роль кандидата', roleResult?.candidateAdded ? 'Видано' : 'Не видано'),
        ],
        colors.pink,
      );

      console.log(`Application sent to Discord | ${doc.id}`);
    });
  }, (error) => {
    console.error('Applications listener error', error);
  });
}

function contactMessageEmbed(id, data) {
  return baseEmbed({
    title: 'Нове повідомлення зі сайту',
    description: cleanLong(data.message),
    color: colors.blue,
    image: true,
  }).addFields(
    field('Імʼя / організація', data.nickname),
    field('Контакт', data.discord),
    field('Тема', data.age),
    field('Зручний час', data.online || '-'),
    field('Firestore ID', id),
    field('Discord ID', data.discordUser?.id || '-'),
  );
}

async function startContactMessageListener() {
  if (!CONTACT_CHANNEL_ID) {
    console.log('Contact messages listener skipped | DISCORD_CONTACT_CHANNEL_ID and DISCORD_APPLICATION_CHANNEL_ID are missing');
    return;
  }

  const channel = await fetchSendableChannel(CONTACT_CHANNEL_ID);

  if (!channel) {
    console.log(`Contact messages listener skipped | Channel ${CONTACT_CHANNEL_ID} not found or not sendable`);
    return;
  }

  db.collection('messages').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type !== 'added') return;

      const doc = change.doc;
      const data = doc.data();

      if (data.botNotified) return;

      try {
        const message = await channel.send({
          content: ADMIN_MENTION_ROLE_ID ? `<@&${ADMIN_MENTION_ROLE_ID}>` : undefined,
          embeds: [contactMessageEmbed(doc.id, data)],
          allowedMentions: {
            roles: ADMIN_MENTION_ROLE_ID ? [ADMIN_MENTION_ROLE_ID] : [],
          },
        });

        await doc.ref.set(
          {
            botNotified: true,
            discordMessageId: message.id,
            discordChannelId: channel.id,
            status: 'sent',
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

        console.log(`Contact message sent to Discord | ${doc.id}`);
      } catch (error) {
        await doc.ref.set(
          {
            status: 'error',
            botError: error.message,
            botErrorAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

        console.error(`Contact message failed | ${doc.id}`, error);
      }
    });
  }, (error) => {
    console.error('Contact messages listener error', error);
  });
}

function reportEmbed(id, data) {
  const range = data.range || {};
  const period = [
    range.from ? `від ${range.from}` : '',
    range.to ? `до ${range.to}` : '',
    range.query ? `пошук: ${range.query}` : '',
  ].filter(Boolean).join(' | ') || 'без фільтра';

  return baseEmbed({
    title: 'Фінансовий звіт Grizzly Family',
    description: [
      'Адмін сформував звіт з калькулятора контрактів.',
      '',
      `\`\`\`\n${cleanLong(data.reportTextSnippet || data.reportText)}\n\`\`\``,
    ].join('\n'),
    color: colors.blue,
  }).addFields(
    field('Період', period),
    field('Адмін', data.requestedBy?.globalName || data.requestedBy?.username),
    field('Firestore ID', id),
  );
}

async function startCalculatorReportListener() {
  if (!REPORT_CHANNEL_ID) {
    console.log('Calculator reports listener skipped | DISCORD_REPORT_CHANNEL_ID is missing');
    return;
  }

  const channel = await client.channels.fetch(REPORT_CHANNEL_ID);

  db.collection('calculator_reports').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type !== 'added') return;

      const doc = change.doc;
      const data = doc.data();

      if (data.botNotified) return;

      try {
        const chunks = splitReport(data.reportText);
        const message = await channel.send({
          embeds: [
            reportEmbed(doc.id, {
              ...data,
              reportTextSnippet: chunks[0],
            }),
          ],
        });

        for (const chunk of chunks.slice(1)) {
          await channel.send({
            content: `\`\`\`\n${chunk}\n\`\`\``,
          });
        }

        await doc.ref.set(
          {
            botNotified: true,
            discordMessageId: message.id,
            status: 'sent',
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

        console.log(`Calculator report sent to Discord | ${doc.id}`);
      } catch (error) {
        await doc.ref.set(
          {
            status: 'error',
            botError: error.message,
            botErrorAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

        console.error(`Calculator report failed | ${doc.id}`, error);
      }
    });
  }, (error) => {
    console.error('Calculator reports listener error', error);
  });
}

function newsEmbed(id, data) {
  return baseEmbed({
    title: clean(data.title, 'Новина Grizzly Family'),
    description: cleanLong(data.text),
    color: colors.pink,
    image: data.imageUrl || true,
  });
}

async function startNewsListener() {
  if (!NEWS_CHANNEL_ID) {
    console.log('News listener skipped | DISCORD_NEWS_CHANNEL_ID is missing');
    return;
  }

  const channel = await client.channels.fetch(NEWS_CHANNEL_ID);

  db.collection('discord_news_notifications').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type !== 'added') return;

      const doc = change.doc;
      const data = doc.data();

      if (data.botNotified) return;

      try {
        const message = await channel.send({
          content: NEWS_MENTION_ROLE_ID ? `<@&${NEWS_MENTION_ROLE_ID}>` : undefined,
          embeds: [newsEmbed(doc.id, data)],
          allowedMentions: {
            roles: NEWS_MENTION_ROLE_ID ? [NEWS_MENTION_ROLE_ID] : [],
          },
        });

        await doc.ref.set(
          {
            botNotified: true,
            discordMessageId: message.id,
            status: 'sent',
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

        console.log(`News sent to Discord | ${doc.id}`);
      } catch (error) {
        await doc.ref.set(
          {
            status: 'error',
            botError: error.message,
            botErrorAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

        console.error(`News notification failed | ${doc.id}`, error);
      }
    });
  }, (error) => {
    console.error('News listener error', error);
  });
}

async function registerSlashCommands(guild) {
  const commands = [
    new SlashCommandBuilder()
      .setName('sync')
      .setDescription('Синхронізувати Discord склад з Firestore')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    new SlashCommandBuilder()
      .setName('status')
      .setDescription('Показати статус учасника')
      .addUserOption((option) => option
        .setName('user')
        .setDescription('Discord користувач')
        .setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    new SlashCommandBuilder()
      .setName('warning')
      .setDescription('Видати попередження учаснику')
      .addUserOption((option) => option
        .setName('user')
        .setDescription('Discord користувач')
        .setRequired(true))
      .addStringOption((option) => option
        .setName('reason')
        .setDescription('Причина попередження')
        .setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  ];

  await guild.commands.set(commands.map((command) => command.toJSON()));
  console.log('Slash commands registered');
}

async function handleChatInput(interaction, syncMembers) {
  if (!interaction.isChatInputCommand()) return false;

  if (!isStaffInteraction(interaction)) {
    await interaction.reply({
      content: 'Ця команда доступна тільки старшому складу.',
      ephemeral: true,
    });
    return true;
  }

  if (interaction.commandName === 'sync') {
    await interaction.deferReply({ ephemeral: true });
    await syncMembers();
    await interaction.editReply('Discord склад синхронізовано з Firestore.');
    await sendLogEmbed('Slash command', `${interaction.user} виконав /sync.`, [], colors.blue);
    return true;
  }

  if (interaction.commandName === 'status') {
    const user = interaction.options.getUser('user', true);
    const [memberDoc, profileDoc, applicationDoc] = await Promise.all([
      db.collection('discord_members').doc(user.id).get(),
      db.collection('member_profiles').doc(user.id).get(),
      db.collection('applications').doc(user.id).get(),
    ]);

    const member = memberDoc.exists ? memberDoc.data() : {};
    const profile = profileDoc.exists ? profileDoc.data() : {};
    const application = applicationDoc.exists ? applicationDoc.data() : {};

    await interaction.reply({
      embeds: [
        baseEmbed({
          title: 'Статус учасника',
          description: `<@${user.id}>`,
          color: colors.blue,
        }).addFields(
          field('Discord', member.nickname || user.username),
          field('Онлайн', member.online ? 'Online' : 'Offline'),
          field('Ранг', profile.rank || '-'),
          field('Статус заявки', application.status || '-'),
        ),
      ],
      ephemeral: true,
    });
    return true;
  }

  if (interaction.commandName === 'warning') {
    const user = interaction.options.getUser('user', true);
    const reason = cleanLong(interaction.options.getString('reason', true), 'Без причини');

    const ref = await db.collection('member_warnings').add({
      userId: user.id,
      reason,
      createdBy: {
        id: interaction.user.id,
        username: interaction.user.username,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await interaction.reply({
      content: `Попередження для <@${user.id}> збережено. ID: ${ref.id}`,
      ephemeral: true,
    });

    await sendLogEmbed(
      'Попередження учаснику',
      `${interaction.user} видав попередження для <@${user.id}>.`,
      [
        field('Причина', reason, false),
        field('Firestore ID', ref.id),
      ],
      colors.amber,
    );

    return true;
  }

  return false;
}

async function sendInterviewReminders() {
  if (!APPLICATION_CHANNEL_ID || !Number.isFinite(INTERVIEW_REMINDER_HOURS) || INTERVIEW_REMINDER_HOURS <= 0) {
    return;
  }

  const channel = await fetchSendableChannel(APPLICATION_CHANNEL_ID);
  if (!channel) return;

  const snapshot = await db
    .collection('applications')
    .where('status', '==', 'interview')
    .limit(50)
    .get()
    .catch((error) => {
      console.error('Interview reminder query failed', error);
      return null;
    });

  if (!snapshot) return;

  const now = Date.now();
  const thresholdMs = INTERVIEW_REMINDER_HOURS * 60 * 60 * 1000;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.interviewReminderSent) continue;

    const startDate = toDate(data.reviewedAt) || toDate(data.createdAt);
    if (!startDate || now - startDate.getTime() < thresholdMs) continue;

    const content = [
      ADMIN_MENTION_ROLE_ID ? `<@&${ADMIN_MENTION_ROLE_ID}>` : '',
      `Заявка ${userLine(data, doc.id)} очікує співбесіду вже ${INTERVIEW_REMINDER_HOURS}+ год.`,
    ].filter(Boolean).join('\n');

    await channel.send({
      content,
      embeds: [
        applicationEmbed(doc.id, data).setTitle('Нагадування про співбесіду'),
      ],
      allowedMentions: {
        roles: ADMIN_MENTION_ROLE_ID ? [ADMIN_MENTION_ROLE_ID] : [],
      },
    });

    await doc.ref.set(
      {
        interviewReminderSent: true,
        interviewReminderAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    await handleChatInput(interaction, syncMembersHandler).catch(async (error) => {
      console.error('Slash command failed', error);
      const payload = {
        content: `Помилка команди: ${error.message}`,
        ephemeral: true,
      };
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp(payload).catch(() => null);
      } else {
        await interaction.reply(payload).catch(() => null);
      }
    });
    return;
  }

  if (!interaction.isButton()) return;

  const [namespace, action, applicationId] = interaction.customId.split(':');

  if (namespace !== 'application') return;

  await interaction.deferUpdate().catch(() => null);

  const ref = db.collection('applications').doc(applicationId);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    await interaction.followUp({
      content: 'Заявку не знайдено у Firestore.',
      ephemeral: true,
    });
    return;
  }

  const data = snapshot.data();

  if (action === 'retrydm') {
    const status = data.status || 'interview';
    const dmResult = await sendDecisionDm(status, data, applicationId).catch((error) => ({
      ok: false,
      reason: error.message,
      code: error.code,
      userId: applicationDiscordId(data, applicationId),
    }));

    await ref.set(
      {
        dmSent: dmResult.ok,
        dmRetryAt: admin.firestore.FieldValue.serverTimestamp(),
        dmRetryBy: {
          id: interaction.user.id,
          username: interaction.user.username,
        },
        dmError: dmResult.ok ? null : dmResult.reason,
        dmErrorCode: dmResult.ok ? null : dmResult.code || null,
        dmErrorText: dmResult.ok ? null : dmFailureText(dmResult),
        dmUserId: dmResult.userId || null,
      },
      { merge: true },
    );

    await sendLogEmbed(
      'Повтор DM',
      `${interaction.user} повторно відправив DM для ${userLine(data, applicationId)}.`,
      [
        field('Кандидат', data.nickname),
        field('Статус заявки', decisionLabel(status)),
        field('DM', dmResult.ok ? 'Відправлено' : dmFailureText(dmResult), false),
      ],
      dmResult.ok ? colors.green : colors.red,
    );

    await interaction.followUp({
      content: dmResult.ok
        ? `DM для **${clean(data.nickname)}** повторно відправлено.`
        : `DM не вдалося відправити: ${dmFailureText(dmResult)}`,
      ephemeral: true,
    });

    return;
  }

  const status = action;
  const dmResult = await sendDecisionDm(status, data, applicationId).catch((error) => ({
    ok: false,
    reason: error.message,
    code: error.code,
    userId: applicationDiscordId(data, applicationId),
  }));

  await sendDmFallbackNotice(status, data, applicationId, dmResult).catch((error) => {
    console.error('DM fallback notice failed', error);
  });

  await ref.set(
    {
      status,
      dmSent: dmResult.ok,
      dmError: dmResult.ok ? null : dmResult.reason,
      dmErrorCode: dmResult.ok ? null : dmResult.code || null,
      dmErrorText: dmResult.ok ? null : dmFailureText(dmResult),
      dmUserId: dmResult.userId || null,
      reviewedBy: {
        id: interaction.user.id,
        username: interaction.user.username,
      },
      reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  const roleResult = await updateApplicantRoles(status, data, applicationId).catch((error) => {
    console.error('Decision role update failed', error);
    return {
      roleAdded: false,
      candidateRemoved: false,
      reason: error.message,
    };
  });

  if (status === 'accepted') {
    await sendWelcomeMessage(data, applicationId);
  }

  await sendLogEmbed(
    'Рішення по заявці',
    `${interaction.user} встановив статус **${decisionLabel(status)}** для ${userLine(data, applicationId)}.`,
    [
      field('Кандидат', data.nickname),
      field('DM', dmResult.ok ? 'Відправлено' : dmFailureText(dmResult), false),
      field('Основна роль', roleResult.roleAdded ? 'Видано' : 'Не видано'),
      field('Роль кандидата', roleResult.candidateRemoved ? 'Знято' : '-'),
    ],
    statusConfig(status).color,
  );

  const dmStatusText = dmResult.ok
    ? 'DM відправлено.'
    : `DM не вдалося відправити. Причина: ${dmFailureText(dmResult)}`;

  await interaction.editReply({
    content: `Заявку **${clean(data.nickname)}**: **${decisionLabel(status)}**. Рішення прийняв ${interaction.user}. ${dmStatusText}`,
    embeds: [
      applicationEmbed(applicationId, {
        ...data,
        status,
      }),
    ],
    components: dmResult.ok ? [] : [retryDmButton(applicationId)],
  });
});

client.once('ready', async () => {
  console.log(`Logged as ${client.user.tag}`);
  await writeBotStatus({
    startedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const guild = await client.guilds.fetch(SERVER_ID);
  await guild.members.fetch();

  async function syncMembers() {
    const members = guild.members.cache;
    const allMembers = [];
    let online = 0;

    members.forEach((member) => {
      const status = member.presence?.status || 'offline';

      if (status !== 'offline') {
        online++;
      }

      allMembers.push({
        id: member.id,
        username: member.user.username,
        nickname: member.nickname || member.displayName || member.user.globalName || member.user.username,
        avatar: member.user.displayAvatarURL({
          extension: 'png',
          size: 512,
        }),
        roles: member.roles.cache.map((role) => role.id),
        online: status !== 'offline',
        bot: member.user.bot,
      });
    });

    await db.collection('stats').doc('discord_members').set({
      members: members.size,
      online,
    });

    const batch = db.batch();

    for (const member of allMembers) {
      const ref = db.collection('discord_members').doc(member.id);
      batch.set(ref, member, { merge: true });
    }

    await batch.commit();
    await writeBotStatus({
      lastSyncAt: admin.firestore.FieldValue.serverTimestamp(),
      discordMembers: members.size,
      discordOnline: online,
    });

    console.log(`Discord synced | Members: ${members.size} | Online: ${online}`);
  }

  syncMembersHandler = syncMembers;

  await registerSlashCommands(guild).catch((error) => {
    console.error('Slash command registration failed', error);
  });

  await syncMembers();
  await startApplicationListener();
  await startContactMessageListener();
  await startCalculatorReportListener();
  await startNewsListener();
  await sendInterviewReminders();

  setInterval(syncMembers, 300000);
  setInterval(writeBotStatus, 300000);
  setInterval(sendInterviewReminders, 60 * 60 * 1000);
});

client.login(process.env.DISCORD_BOT_TOKEN);
