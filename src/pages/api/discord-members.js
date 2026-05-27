export default async function handler(req,res){

  try{

    const token = process.env.DISCORD_BOT_TOKEN

    if(!token){

      return res.status(500).json({
        error:'NO TOKEN'
      })

    }

    const response = await fetch(
      'https://discord.com/api/v10/guilds/1388989912996380713?with_counts=true',
      {
        headers:{
          Authorization:`Bot ${token}`
        }
      }
    )

    const data = await response.json()

    return res.status(200).json(data)

  }catch(error){

    return res.status(500).json({
      error:String(error)
    })

  }

}
