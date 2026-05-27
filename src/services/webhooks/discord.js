export async function sendWebhook(url,payload){

  try{

    await fetch(url,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(payload)
    })

  }catch(error){
    console.error(error)
  }
}

export const contractsWebhook =
'https://discord.com/api/webhooks/1506424883737788619/yATAISypU22ZWVvhRKMsSeSZT1l7bghWRvPSoLaERM8tdj1Wx70JXq4QU2DjYwiHC72F'
import.meta.env.VITE_DISCORD_CONTRACTS_WEBHOOK
export async function sendWebhook(
  webhook,
  data
){

  try{

    await fetch(
      webhook,
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
      }
    )

  }catch(error){

    console.error(
      'Webhook error:',
      error
    )

  }
}
