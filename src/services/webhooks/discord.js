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
  import.meta.env.VITE_DISCORD_CONTRACTS_WEBHOOK