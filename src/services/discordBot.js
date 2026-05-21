export const sendDiscordLog = async(message)=>{
  await fetch('YOUR_WEBHOOK',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      content:message
    })
  })
}