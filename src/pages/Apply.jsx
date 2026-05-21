import { useState } from 'react'

export default function Apply(){

const [nick,setNick] = useState('')
const [discord,setDiscord] = useState('')
const [telegram,setTelegram] = useState('')
const [reason,setReason] = useState('')

const sendApplication = async()=>{

await fetch(import.meta.env.VITE_DISCORD_WEBHOOK,{
method:'POST',
headers:{'Content-Type':'application/json'},
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

}

return(
<>
<h1 className="title">Заявка</h1>

<div className="card">

<input placeholder="Nick" value={nick} onChange={e=>setNick(e.target.value)} />
<input placeholder="Discord" value={discord} onChange={e=>setDiscord(e.target.value)} />
<input placeholder="Telegram" value={telegram} onChange={e=>setTelegram(e.target.value)} />

<textarea placeholder="Причина" value={reason} onChange={e=>setReason(e.target.value)}></textarea>

<button className="btn" style={{marginTop:'16px'}} onClick={sendApplication}>
ОТПРАВИТЬ ЗАЯВКУ
</button>

</div>
</>
)
}