export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*")

  try {

    const response = await fetch(
      `https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}?with_counts=true`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
      }
    )
 
    const data = await response.json()

    res.status(200).json({
      members: data.approximate_member_count || 0,
      online: data.approximate_presence_count || 0
    })

  } catch (error) {

    res.status(500).json({
      error: String(error)
    })

  }

}
