import { useState } from 'react'

export default function Apply(){

const [nick,setNick] = useState('')
const [discord,setDiscord] = useState('')
const [telegram,setTelegram] = useState('')
const [reason,setReason] = useState('')
const [loading,setLoading] = useState(false)

const sendApplication = async () => {

try{

setLoading(true)

await fetch(import.meta.env.VITE_DISCORD_WEBHOOK,{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({
content:
`Nick: ${nick}
Discord: ${discord}
Telegram: ${telegram}

Причина:
${reason}`
})
})

localStorage.setItem('application_sent','true')

alert('Заявка отправлена')

window.location.href='/'

}catch(e){

alert('Webhook error')

}finally{

setLoading(false)

}

}

return(
<>
<h1 className="title">Заявка</h1>

<div className="card">

<input
placeholder="Nick"
value={nick}
onChange={e=>setNick(e.target.value)}
/>

<input
placeholder="Discord"
value={discord}
onChange={e=>setDiscord(e.target.value)}
/>

<input
placeholder="Telegram"
value={telegram}
onChange={e=>setTelegram(e.target.value)}
/>

<textarea
placeholder="Причина"
value={reason}
onChange={e=>setReason(e.target.value)}
></textarea>

<button
className="btn"
onClick={sendApplication}
disabled={loading}
style={{marginTop:'16px'}}
>
{loading ? 'Отправка...' : 'ОТПРАВИТЬ ЗАЯВКУ'}
</button>

</div>
</>
)
}