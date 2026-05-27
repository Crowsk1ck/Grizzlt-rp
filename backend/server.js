import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const SERVER_ID = process.env.DISCORD_SERVER_ID
const ROLE_ID = process.env.DISCORD_ALLOWED_ROLE
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

app.post('/api/check-role', async (req,res)=>{

  try{

    const { discordId } = req.body

    if(!discordId){
      return res.status(400).json({
        success:false
      })
    }

    const response = await fetch(
      `https://discord.com/api/guilds/${SERVER_ID}/members/${discordId}`,
      {
        headers:{
          Authorization:`Bot ${BOT_TOKEN}`
        }
      }
    )

    const member = await response.json()

    const hasRole = member.roles?.includes(ROLE_ID)

    return res.json({
      success:true,
      hasRole
    })

  }catch(error){

    console.error(error)

    return res.status(500).json({
      success:false
    })
  }
})

app.listen(3001,()=>{
  console.log('Grizzly auth backend running')
})
app.get('/discord-members', async(req,res)=>{

  try{

    const response = await fetch(

      `https://discord.com/api/v10/guilds/1388989912996380713?with_counts=true`,

      {
        headers:{
          Authorization:`Bot ${process.env.DISCORD_BOT_TOKEN}`
        }
      }
    )

    const data = await response.json()

    res.json({
      members:data.approximate_member_count || 0
    })

  }catch(error){

    console.log(error)

    res.status(500).json({
      error:'discord error'
    })
  }
})
