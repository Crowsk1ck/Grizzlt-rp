export default async function handler(req,res){

  res.status(200).json({
    tokenExists: !!process.env.DISCORD_BOT_TOKEN
    hello:true
  })

}
