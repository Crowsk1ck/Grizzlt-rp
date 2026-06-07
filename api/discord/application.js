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

function field(name, value, inline = true) {
  return {
    name,
    value: value ? String(value).slice(0, 1024) : '-',
    inline,
  };
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
    const isApplication = body.type === 'applications';
    const title = isApplication ? 'Нова заявка в Grizzly Family' : 'Нове повідомлення з сайту';
    const color = isApplication ? 0xff1678 : 0x168bff;

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Grizzly Family Site',
        avatar_url: `${process.env.APP_URL || 'https://www.grizzly-family.online'}/assets/grizzly-logo.png`,
        embeds: [
          {
            title,
            color,
            timestamp: new Date().toISOString(),
            fields: [
              field('Нікнейм', form.nickname),
              field('Discord', form.discord),
              field('Вік', form.age),
              field('Онлайн', form.online),
              field('Firestore ID', body.documentId),
              field('Discord ID', discordUser?.id),
              field('Повідомлення', form.message, false),
            ],
            footer: {
              text: 'grizzly-family.online',
            },
          },
        ],
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
