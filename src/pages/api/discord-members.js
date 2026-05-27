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
      status:response.status,
      data:data
    })

  }catch(error){

    res.status(500).json({
      error:String(error)
    })

  }

}
