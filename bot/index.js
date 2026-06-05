import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits
} from 'discord.js'
import admin from 'firebase-admin'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
})

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
)

admin.initializeApp({
  credential: admin.credential.cert(
    serviceAccount
  )
})

const db = admin.firestore()

const SERVER_ID =
  process.env.DISCORD_SERVER_ID

const APPLICATION_CHANNEL_ID =
  process.env.DISCORD_APPLICATION_CHANNEL_ID

const DM_FALLBACK_CHANNEL_ID =
  process.env.DISCORD_DM_FALLBACK_CHANNEL_ID

const REPORT_CHANNEL_ID =
  process.env.DISCORD_REPORT_CHANNEL_ID ||
  process.env.DISCORD_CALCULATOR_REPORT_CHANNEL_ID ||
  APPLICATION_CHANNEL_ID

const NEWS_CHANNEL_ID =
  process.env.DISCORD_NEWS_CHANNEL_ID

const ACCEPTED_ROLE_ID =
  process.env.DISCORD_ACCEPTED_ROLE_ID

const INTERVIEW_CHANNEL_URL =
  process.env.DISCORD_INTERVIEW_CHANNEL_URL

function clean(value, fallback = '-'){
  return String(value || fallback).slice(0, 1024)
}

function cleanLong(value, fallback = '-'){
  return String(value || fallback).slice(0, 1800)
}

function isDiscordId(value){
  return /^\d{17,22}$/.test(String(value || ''))
}

function applicationDiscordId(data, applicationId){
  if(data.discordUser?.id){
    return data.discordUser.id
  }

  if(isDiscordId(applicationId)){
    return applicationId
  }

  return null
}

function dmFailureText(result){
  if(result.code === 50007 || String(result.reason).includes('Cannot send messages to this user')){
    return 'У користувача закриті особисті повідомлення від учасників сервера або він заблокував DM.'
  }

  if(result.code === 10013){
    return 'Discord не знайшов цього користувача. Можливо, ID неправильний або акаунт недоступний.'
  }

  if(result.reason === 'missing_discord_user'){
    return 'У заявці немає Discord ID. Старі заявки без входу через Discord треба обробити вручну.'
  }

  if(result.reason === 'user_not_found'){
    return 'Бот не зміг знайти користувача Discord за ID.'
  }

  return result.reason || 'Discord не дозволив відправити DM.'
}

function decisionLabel(status){
  const labels = {
    accepted: 'прийнято',
    rejected: 'відхилено',
    interview: 'відправлено на співбесіду'
  }

  return labels[status] || status
}

function splitReport(text){
  const source = String(text || '')
  const chunks = []

  for(let index = 0; index < source.length; index += 1800){
    chunks.push(source.slice(index, index + 1800))
  }

  return chunks.length ? chunks : ['-']
}

function applicationEmbed(id, data){
  return new EmbedBuilder()
    .setTitle('Нова заявка в Grizzly Family')
    .setColor(0xff1678)
    .setTimestamp(new Date())
    .addFields(
      {
        name: 'Нікнейм',
        value: clean(data.nickname),
        inline: true
      },
      {
        name: 'Discord',
        value: clean(data.discord),
        inline: true
      },
      {
        name: 'Вік',
        value: clean(data.age),
        inline: true
      },
      {
        name: 'Онлайн',
        value: clean(data.online),
        inline: true
      },
      {
        name: 'Firestore ID',
        value: id,
        inline: true
      },
      {
        name: 'Discord ID',
        value: clean(data.discordUser?.id),
        inline: true
      },
      {
        name: 'Про себе',
        value: clean(data.message),
        inline: false
      }
    )
    .setFooter({
      text: 'grizzly-family.online'
    })
}

function applicationButtons(id){
  return new ActionRowBuilder()
    .addComponents(
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
        .setStyle(ButtonStyle.Danger)
    )
}

function decisionDmEmbed(status, data){
  const config = {
    accepted: {
      title: 'Заявку прийнято',
      color: 0x2ecc71,
      text: 'Вітаємо! Твою заявку до Grizzly Family прийнято. Очікуй подальші інструкції від старшого складу.'
    },
    interview: {
      title: 'Запрошення на співбесіду',
      color: 0x168bff,
      text: `Твою заявку розглянули. Потрібна коротка співбесіда.${INTERVIEW_CHANNEL_URL ? ` Перейди сюди: ${INTERVIEW_CHANNEL_URL}` : ' З тобою зв’яжеться старший склад.'}`
    },
    rejected: {
      title: 'Заявку відхилено',
      color: 0xff1678,
      text: 'Дякуємо за інтерес до Grizzly Family. Цього разу заявку відхилено, але ти можеш спробувати ще раз пізніше.'
    }
  }

  const item = config[status] || {
    title: 'Статус заявки оновлено',
    color: 0x8b3cff,
    text: `Новий статус: ${status}`
  }

  return new EmbedBuilder()
    .setTitle(item.title)
    .setDescription(item.text)
    .setColor(item.color)
    .setTimestamp(new Date())
    .addFields(
      {
        name: 'Нікнейм',
        value: clean(data.nickname),
        inline: true
      },
      {
        name: 'Родина',
        value: 'Grizzly Family',
        inline: true
      }
    )
    .setFooter({
      text: 'grizzly-family.online'
    })
}

async function sendDecisionDm(status, data, applicationId){
  const userId =
    applicationDiscordId(
      data,
      applicationId
    )

  if(!userId){
    return {
      ok: false,
      reason: 'missing_discord_user',
      userId: null
    }
  }

  const user =
    await client.users
      .fetch(
        userId,
        {
          force: true
        }
      )
      .catch(() => null)

  if(!user){
    return {
      ok: false,
      reason: 'user_not_found',
      userId
    }
  }

  try {
    await user.send({
      embeds: [
        decisionDmEmbed(
          status,
          data
        )
      ]
    })
  } catch(error) {
    return {
      ok: false,
      reason: error.message,
      code: error.code,
      userId
    }
  }

  return {
    ok: true,
    userId
  }
}

async function sendDmFallbackNotice(status, data, applicationId, dmResult){
  if(dmResult.ok || !DM_FALLBACK_CHANNEL_ID){
    return null
  }

  const channel =
    await client.channels
      .fetch(DM_FALLBACK_CHANNEL_ID)
      .catch(() => null)

  if(!channel?.send){
    return null
  }

  const userId =
    dmResult.userId ||
    applicationDiscordId(
      data,
      applicationId
    )

  const mention =
    userId ? `<@${userId}>` : clean(data.discord)

  return channel.send({
    content: [
      `${mention}, статус твоєї заявки: **${decisionLabel(status)}**.`,
      'Бот не зміг написати тобі в особисті.',
      dmFailureText(dmResult)
    ].join('\n'),
    embeds: [
      decisionDmEmbed(
        status,
        data
      )
    ],
    allowedMentions: {
      users: userId ? [userId] : []
    }
  })
}

async function startApplicationListener(){
  if(!APPLICATION_CHANNEL_ID){
    console.log(
      'Applications listener skipped | DISCORD_APPLICATION_CHANNEL_ID is missing'
    )
    return
  }

  const channel =
    await client.channels.fetch(
      APPLICATION_CHANNEL_ID
    )

  db.collection('applications')
    .onSnapshot(snapshot => {

      snapshot.docChanges()
        .forEach(async change => {

          if(change.type !== 'added'){
            return
          }

          const doc = change.doc
          const data = doc.data()

          if(data.botNotified){
            return
          }

          const message =
            await channel.send({
              embeds: [
                applicationEmbed(
                  doc.id,
                  data
                )
              ],
              components: [
                applicationButtons(
                  doc.id
                )
              ]
            })

          await doc.ref.set(
            {
              botNotified: true,
              discordMessageId: message.id,
              status: data.status || 'new'
            },
            { merge: true }
          )

          console.log(
            `Application sent to Discord | ${doc.id}`
          )

        })

    }, error => {
      console.error(
        'Applications listener error',
        error
      )
    })
}

function reportEmbed(id, data){
  const range = data.range || {}
  const period = [
    range.from ? `від ${range.from}` : '',
    range.to ? `до ${range.to}` : '',
    range.query ? `пошук: ${range.query}` : ''
  ].filter(Boolean).join(' | ') || 'без фільтра'

  return new EmbedBuilder()
    .setTitle('Звіт калькулятора Grizzly Family')
    .setColor(0x168bff)
    .setDescription(`\`\`\`\n${cleanLong(data.reportTextSnippet || data.reportText)}\n\`\`\``)
    .setTimestamp(new Date())
    .addFields(
      {
        name: 'Період',
        value: clean(period),
        inline: true
      },
      {
        name: 'Адмін',
        value: clean(data.requestedBy?.username || data.requestedBy?.globalName),
        inline: true
      },
      {
        name: 'Firestore ID',
        value: id,
        inline: true
      }
    )
    .setFooter({
      text: 'grizzly-family.online'
    })
}

async function startCalculatorReportListener(){
  if(!REPORT_CHANNEL_ID){
    console.log(
      'Calculator reports listener skipped | DISCORD_REPORT_CHANNEL_ID is missing'
    )
    return
  }

  const channel =
    await client.channels.fetch(
      REPORT_CHANNEL_ID
    )

  db.collection('calculator_reports')
    .onSnapshot(snapshot => {

      snapshot.docChanges()
        .forEach(async change => {

          if(change.type !== 'added'){
            return
          }

          const doc = change.doc
          const data = doc.data()

          if(data.botNotified){
            return
          }

          try {
            const chunks =
              splitReport(data.reportText)

            const message =
              await channel.send({
                embeds: [
                  reportEmbed(
                    doc.id,
                    {
                      ...data,
                      reportTextSnippet: chunks[0]
                    }
                  )
                ]
              })

            for(const chunk of chunks.slice(1)){
              await channel.send({
                content: `\`\`\`\n${chunk}\n\`\`\``
              })
            }

            await doc.ref.set(
              {
                botNotified: true,
                discordMessageId: message.id,
                status: 'sent',
                sentAt: admin.firestore.FieldValue.serverTimestamp()
              },
              { merge: true }
            )

            console.log(
              `Calculator report sent to Discord | ${doc.id}`
            )
          } catch(error) {
            await doc.ref.set(
              {
                status: 'error',
                botError: error.message,
                botErrorAt: admin.firestore.FieldValue.serverTimestamp()
              },
              { merge: true }
            )

            console.error(
              `Calculator report failed | ${doc.id}`,
              error
            )
          }

        })

    }, error => {
      console.error(
        'Calculator reports listener error',
        error
      )
    })
}

function newsEmbed(id, data){
  return new EmbedBuilder()
    .setTitle(clean(data.title, 'Новина Grizzly Family'))
    .setDescription(cleanLong(data.text))
    .setColor(0xff1678)
    .setTimestamp(new Date())
    .addFields(
      {
        name: 'Тег',
        value: clean(data.tag || 'Grizzly Bulletin'),
        inline: true
      },
      {
        name: 'Адмін',
        value: clean(data.requestedBy?.username || data.requestedBy?.globalName),
        inline: true
      },
      {
        name: 'Firestore ID',
        value: id,
        inline: true
      }
    )
    .setFooter({
      text: 'grizzly-family.online'
    })
}

async function startNewsListener(){
  if(!NEWS_CHANNEL_ID){
    console.log(
      'News listener skipped | DISCORD_NEWS_CHANNEL_ID is missing'
    )
    return
  }

  const channel =
    await client.channels.fetch(
      NEWS_CHANNEL_ID
    )

  db.collection('discord_news_notifications')
    .onSnapshot(snapshot => {

      snapshot.docChanges()
        .forEach(async change => {

          if(change.type !== 'added'){
            return
          }

          const doc = change.doc
          const data = doc.data()

          if(data.botNotified){
            return
          }

          try {
            const message =
              await channel.send({
                embeds: [
                  newsEmbed(
                    doc.id,
                    data
                  )
                ]
              })

            await doc.ref.set(
              {
                botNotified: true,
                discordMessageId: message.id,
                status: 'sent',
                sentAt: admin.firestore.FieldValue.serverTimestamp()
              },
              { merge: true }
            )

            console.log(
              `News sent to Discord | ${doc.id}`
            )
          } catch(error) {
            await doc.ref.set(
              {
                status: 'error',
                botError: error.message,
                botErrorAt: admin.firestore.FieldValue.serverTimestamp()
              },
              { merge: true }
            )

            console.error(
              `News notification failed | ${doc.id}`,
              error
            )
          }

        })

    }, error => {
      console.error(
        'News listener error',
        error
      )
    })
}

client.on(
  Events.InteractionCreate,
  async interaction => {

    if(!interaction.isButton()){
      return
    }

    const [
      namespace,
      status,
      applicationId
    ] = interaction.customId.split(':')

    if(namespace !== 'application'){
      return
    }

    await interaction
      .deferUpdate()
      .catch(() => null)

    const ref = db
      .collection('applications')
      .doc(applicationId)

    const snapshot =
      await ref.get()

    if(!snapshot.exists){
      await interaction.followUp({
        content: 'Заявку не знайдено у Firestore.',
        ephemeral: true
      })
      return
    }

    const data =
      snapshot.data()

    const dmResult =
      await sendDecisionDm(
        status,
        data,
        applicationId
      ).catch(error => ({
        ok: false,
        reason: error.message,
        code: error.code,
        userId: applicationDiscordId(
          data,
          applicationId
        )
      }))

    await sendDmFallbackNotice(
      status,
      data,
      applicationId,
      dmResult
    ).catch(error => {
      console.error(
        'DM fallback notice failed',
        error
      )
    })

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
          username: interaction.user.username
        },
        reviewedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    )

    if(
      status === 'accepted' &&
      ACCEPTED_ROLE_ID &&
      data.discordUser?.id
    ){
      const guild =
        await client.guilds.fetch(
          SERVER_ID
        )

      const member =
        await guild.members
          .fetch(data.discordUser.id)
          .catch(() => null)

      if(member){
        await member.roles.add(
          ACCEPTED_ROLE_ID
        )
      }
    }

    const dmStatusText =
      dmResult.ok
        ? 'DM відправлено.'
        : `DM не вдалося відправити. Причина: ${dmFailureText(dmResult)}`

    await interaction.editReply({
      content: `Заявку **${clean(data.nickname)}** ${decisionLabel(status)}. Рішення: ${interaction.user}. ${dmStatusText}`,
      embeds: [
        applicationEmbed(
          applicationId,
          {
            ...data,
            status
          }
        )
      ],
      components: []
    })

  }
)

client.once('ready', async () => {

  console.log(
    `Logged as ${client.user.tag}`
  )

  const guild =
    await client.guilds.fetch(
      SERVER_ID
    )

  await guild.members.fetch()

  async function syncMembers(){

    const members =
      guild.members.cache

    const allMembers = []

    let online = 0

    members.forEach(member => {

      const status =
        member.presence?.status ||
        'offline'

      if(status !== 'offline'){
        online++
      }

      allMembers.push({

        id: member.id,

        username:
          member.user.username,

        nickname:
          member.nickname ||
          member.displayName ||
          member.user.globalName ||
          member.user.username,

        avatar:
          member.user.displayAvatarURL({
            extension:'png',
            size:512
          }),

        roles:
          member.roles.cache.map(
            role => role.id
          ),

        online:
          status !== 'offline',

        bot:
          member.user.bot

      })

    })

    await db
      .collection('stats')
      .doc('discord_members')
      .set({
        members: members.size,
        online
      })

    const batch = db.batch()

    for(const member of allMembers){

      const ref = db
        .collection('discord_members')
        .doc(member.id)

      batch.set(
        ref,
        member,
        { merge: true }
      )

    }

    await batch.commit()

    console.log(
      `Discord synced | Members: ${members.size} | Online: ${online}`
    )

  }

  await syncMembers()

  await startApplicationListener()

  await startCalculatorReportListener()

  await startNewsListener()

  setInterval(
    syncMembers,
    300000
  )

})

client.login(
  process.env.DISCORD_BOT_TOKEN
)
