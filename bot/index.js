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

llMembers.push({
  id: member.id,

  username: member.user.username,

  nickname:
    member.nickname ||
    member.displayName ||
    member.user.globalName ||
    member.user.username,

  avatar: member.user.displayAvatarURL(),

  roles: member.roles.cache.map(
    r => r.id
  ),

  online:
    status !== 'offline'
})

    })

    await db.collection('stats').doc('discord_members').set({
      members: members.size,
      online
    })

const batch = db.batch()

for (const member of allMembers) {

  const ref = db
    .collection('discord_members')
    .doc(member.id)

  batch.set(ref, member)

}

await batch.commit()

    console.log('Discord synced')

  }, 300000)

})

client.login(process.env.DISCORD_BOT_TOKEN)
