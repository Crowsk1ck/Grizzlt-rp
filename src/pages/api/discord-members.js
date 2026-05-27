export default async function handler(req,res){

  try{

    const response = await fetch(
      'https://discord.com/api/v10/guilds/1388989912996380713?with_counts=true',
      {
        headers:{
          Authorization:`Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
      }
    )

    const data = await response.json()

    res.status(200).json({
      members:data.approximate_member_count || 0
    })

  }catch(error){

    res.status(500).json({
      members:0
    })

  }

}
