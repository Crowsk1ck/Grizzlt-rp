import { Client, GatewayIntentBits } from 'discord.js'
import admin from 'firebase-admin'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
})

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

const SERVER_ID = process.env.DISCORD_SERVER_ID

client.once('ready', async () => {

  console.log(`Logged as ${client.user.tag}`)

  const guild = await client.guilds.fetch(SERVER_ID)

  await guild.members.fetch()

  setInterval(async () => {

    const members = guild.members.cache

    const allMembers = []

    let online = 0

    members.forEach(member => {

      const status = member.presence?.status || 'offline'

      if (status !== 'offline') online++

      allMembers.push({
        id: member.id,
        username: member.user.username,
        avatar: member.user.displayAvatarURL(),
        roles: member.roles.cache.map(r => r.id),
        online: status !== 'offline'
      })

    })

    await db.collection('stats').doc('discord').set({
      members: members.size,
      online
    })

   for (const member of allMembers) {

  await db
    .collection('discord')
    .doc(member.id)
    .set(member)

}

    console.log('Discord synced')

  }, 15000)

})

client.login(process.env.DISCORD_BOT_TOKEN)
