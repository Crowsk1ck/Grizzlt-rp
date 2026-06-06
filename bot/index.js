import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
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
const REPORT_CHANNEL_ID =
  process.env.DISCORD_REPORT_CHANNEL_ID ||
  process.env.DISCORD_CALCULATOR_REPORT_CHANNEL_ID ||
  APPLICATION_CHANNEL_ID;
const NEWS_CHANNEL_ID = process.env.DISCORD_NEWS_CHANNEL_ID;
const ACCEPTED_ROLE_ID = process.env.DISCORD_ACCEPTED_ROLE_ID;
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

      await doc.ref.set(
        {
          botNotified: true,
          discordMessageId: message.id,
          status: data.status || 'new',
        },
        { merge: true },
      );

      console.log(`Application sent to Discord | ${doc.id}`);
    });
  }, (error) => {
    console.error('Applications listener error', error);
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
  }).addFields(
    field('Тег', data.tag || 'Grizzly Bulletin'),
    field('Адмін', data.requestedBy?.globalName || data.requestedBy?.username),
    field('Firestore ID', id),
  );
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
          embeds: [newsEmbed(doc.id, data)],
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

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  const [namespace, status, applicationId] = interaction.customId.split(':');

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

  if (status === 'accepted' && ACCEPTED_ROLE_ID && data.discordUser?.id) {
    const guild = await client.guilds.fetch(SERVER_ID);
    const member = await guild.members.fetch(data.discordUser.id).catch(() => null);

    if (member) {
      await member.roles.add(ACCEPTED_ROLE_ID);
    }
  }

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
    components: [],
  });
});

client.once('ready', async () => {
  console.log(`Logged as ${client.user.tag}`);

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

    console.log(`Discord synced | Members: ${members.size} | Online: ${online}`);
  }

  await syncMembers();
  await startApplicationListener();
  await startCalculatorReportListener();
  await startNewsListener();

  setInterval(syncMembers, 300000);
});

client.login(process.env.DISCORD_BOT_TOKEN);
