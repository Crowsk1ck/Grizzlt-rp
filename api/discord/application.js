function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  if (typeof req.body === 'string') return Promise.resolve(JSON.parse(req.body || '{}'));

  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function clean(value, fallback = '-') {
  const text = String(value || fallback).trim();
  return (text || fallback).slice(0, 1024);
}

function cleanLong(value, fallback = '-') {
  const text = String(value || fallback).trim();
  return (text || fallback).slice(0, 1800);
}

function field(name, value, inline = true) {
  return {
    name,
    value: clean(value),
    inline,
  };
}

function appUrl() {
  return (process.env.APP_URL || 'https://www.grizzly-family.online').replace(/\/$/, '');
}

function assetUrl(path) {
  return `${appUrl()}${path}`;
}

function baseEmbed({ title, description, color }) {
  return {
    author: {
      name: 'Grizzly Family | GTA 5 RP',
      icon_url: process.env.DISCORD_EMBED_LOGO_URL || assetUrl('/assets/grizzly-logo.png'),
      url: appUrl(),
    },
    title,
    description,
    color,
    timestamp: new Date().toISOString(),
    thumbnail: {
      url: process.env.DISCORD_EMBED_LOGO_URL || assetUrl('/assets/grizzly-logo.png'),
    },
    image: {
      url: process.env.DISCORD_EMBED_BANNER_URL || assetUrl('/assets/grizzly-banner.png'),
    },
    footer: {
      text: 'grizzly-family.online',
      icon_url: process.env.DISCORD_EMBED_LOGO_URL || assetUrl('/assets/grizzly-logo.png'),
    },
  };
}

function buildApplicationEmbed({ form, documentId, discordUser }) {
  const userMention = discordUser?.id ? `<@${discordUser.id}>` : form.discord;

  return {
    ...baseEmbed({
      title: 'Нова заявка в Grizzly Family',
      description: `Кандидат **${clean(form.nickname, 'Без ніку')}** подав заявку на вступ до родини.`,
      color: 0xff005c,
    }),
    fields: [
      field('Кандидат', form.nickname),
      field('Discord', userMention),
      field('Вік', form.age),
      field('Онлайн', form.online),
      field('Firestore ID', documentId),
      field('Discord ID', discordUser?.id),
      {
        name: 'Про себе / досвід',
        value: cleanLong(form.message),
        inline: false,
      },
    ],
  };
}

function buildMessageEmbed({ form, documentId, discordUser }) {
  const userMention = discordUser?.id ? `<@${discordUser.id}>` : form.discord;

  return {
    ...baseEmbed({
      title: 'Нове повідомлення зі сайту',
      description: cleanLong(form.message),
      color: 0x00c8ff,
    }),
    fields: [
      field('Ім’я / організація', form.nickname),
      field('Контакт', userMention),
      field('Тема', form.age),
      field('Зручний час', form.online || '-'),
      field('Firestore ID', documentId),
      field('Discord ID', discordUser?.id),
    ],
  };
}

function buildEmbed({ type, form, documentId, discordUser }) {
  if (type === 'applications') {
    return buildApplicationEmbed({ form, documentId, discordUser });
  }

  return buildMessageEmbed({ form, documentId, discordUser });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const webhookUrl = process.env.DISCORD_APPLICATION_WEBHOOK_URL;
  if (!webhookUrl) {
    res.status(200).json({ ok: false, skipped: true, error: 'DISCORD_APPLICATION_WEBHOOK_URL is missing' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const form = body.form || {};
    const discordUser = body.discordUser || null;

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Grizzly Family',
        avatar_url: process.env.DISCORD_EMBED_LOGO_URL || assetUrl('/assets/grizzly-logo.png'),
        embeds: [
          buildEmbed({
            type: body.type,
            form,
            documentId: body.documentId,
            discordUser,
          }),
        ],
        allowed_mentions: {
          users: discordUser?.id ? [discordUser.id] : [],
        },
      }),
    });

    if (!response.ok) {
      res.status(502).json({ ok: false, error: 'Discord webhook request failed' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
}
