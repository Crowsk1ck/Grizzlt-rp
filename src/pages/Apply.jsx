import {
useEffect(()=>{

const hash = window.location.hash

if(hash.includes('access_token')){

localStorage.setItem('discord_token',hash)

window.history.replaceState({},document.title,'/')

window.location.href='/'

}

},[])
 useState } from 'react'

export default function Apply(){

const [nick,setNick] = useState('')
const [discord,setDiscord] = useState('')
const [telegram,setTelegram] = useState('')
const [reason,setReason] = useState('')

const sendApplication = async()=>{

if(!nick || !discord || !telegram || !reason){
alert('Заповни всі поля')
return
}

await fetch(
'https://discord.com/api/webhooks/1505926641015328859/qqxDO6ncDEcjOu-2TfuA5VfRIq4V4VkBIaMGh5o51RM33RI0CUVDPZZ8pykQ_cnhNsj0',
{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({
content:
`🔥 НОВА ЗАЯВКА

👤 Nick:
${nick}

🎮 Discord:
${discord}

📱 Telegram:
${telegram}

📝 Причина:
${reason}`
})
}
)

localStorage.setItem('application_sent','true')

alert('Заявка відправлена')

window.location.href='/'

}

return(

<>

<div className="applyHero">

<h1 className="applyTitle">
JOIN GRIZZLY FAMILY
</h1>

<p className="applyText">
ELITE GTA 5 ROLEPLAY ORGANIZATION
</p>

</div>

<div className="applyCard">

<div className="sectionTitle">
ЗАЯВКА В СІМʼЮ
</div>

<input
className="input"
placeholder="👤 Nick Name"
value={nick}
onChange={e=>setNick(e.target.value)}
/>

<input
className="input"
placeholder="🎮 Discord"
value={discord}
onChange={e=>setDiscord(e.target.value)}
/>

<input
className="input"
placeholder="📱 Telegram"
value={telegram}
onChange={e=>setTelegram(e.target.value)}
/>

<textarea
className="input applyTextarea"
placeholder="📝 Чому хочеш вступити?"
value={reason}
onChange={e=>setReason(e.target.value)}
></textarea>

<button
className="applyBtn"
onClick={sendApplication}
>
ВІДПРАВИТИ ЗАЯВКУ
</button>

</div>

</>

)

}
