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

const ACCEPTED_ROLE_ID =
  process.env.DISCORD_ACCEPTED_ROLE_ID

const INTERVIEW_CHANNEL_URL =
  process.env.DISCORD_INTERVIEW_CHANNEL_URL

function clean(value, fallback = '-'){
  return String(value || fallback).slice(0, 1024)
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

async function sendDecisionDm(status, data){
  if(!data.discordUser?.id){
    return {
      ok: false,
      reason: 'missing_discord_user'
    }
  }

  const user =
    await client.users
      .fetch(data.discordUser.id)
      .catch(() => null)

  if(!user){
    return {
      ok: false,
      reason: 'user_not_found'
    }
  }

  await user.send({
    embeds: [
      decisionDmEmbed(
        status,
        data
      )
    ]
  })

  return {
    ok: true
  }
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

    const ref = db
      .collection('applications')
      .doc(applicationId)

    const snapshot =
      await ref.get()

    if(!snapshot.exists){
      await interaction.reply({
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
        data
      ).catch(error => ({
        ok: false,
        reason: error.message
      }))

    await ref.set(
      {
        status,
        dmSent: dmResult.ok,
        dmError: dmResult.ok ? null : dmResult.reason,
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

    const labels = {
      accepted: 'прийнято',
      rejected: 'відхилено',
      interview: 'відправлено на співбесіду'
    }

    await interaction.update({
      content: `Заявку **${clean(data.nickname)}** ${labels[status] || status}. Рішення: ${interaction.user}.${dmResult.ok ? ' DM відправлено.' : ' DM не вдалося відправити.'}`,
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

  setInterval(
    syncMembers,
    300000
  )

})

client.login(
  process.env.DISCORD_BOT_TOKEN
)
