
export default function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.status(200).json({
    tokenExists: !!process.env.DISCORD_BOT_TOKEN,
    hello: true
  })

}
