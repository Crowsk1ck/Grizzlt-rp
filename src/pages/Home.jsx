
const syncDiscordUserToTeam = async()=>{

try{

const discordUser = JSON.parse(
localStorage.getItem('discord_user')
)

if(!discordUser) return

const snapshot = await getDocs(
collection(db,'team')
)

let exists = false

snapshot.forEach(doc=>{

const data = doc.data()

if(data.discordId === discordUser.id){
exists = true
}

})

if(!exists){

await addDoc(
collection(db,'team'),
{
name:discordUser.username,
role:'MEMBER',
discordId:discordUser.id,
avatar:discordUser.avatar,
created:Date.now()
}
)

}

}catch(err){

console.log(err)

}

}


import { useEffect, useState } from 'react'
import {
db,
collection,
getDocs,
addDoc
} from '../services/firebase'

export default function Home(){

const [contractsCount,setContractsCount] = useState(0)

const totalIncome =
Number(
localStorage.getItem('total_income') || 0
)

const totalExpenses =
Number(
localStorage.getItem('total_expenses') || 0
)

const cleanIncome =
totalIncome - totalExpenses

useEffect(()=>{

const loadStats = async()=>{

const snapshot = await getDocs,
addDoc(
collection(db,'contracts')
)

setContractsCount(snapshot.size)

}

loadStats()

syncDiscordUserToTeam()

},[])

return(

<>

<div className="hero">

<div className="heroContent">

<h1 className="heroTitle">
GRIZZLY FAMILY
</h1>

<p className="heroText">
ЕЛІТНА СІМ'Я GTA 5 ROLEPLAY
</p>

<div className="heroButtons">

<a
href="https://discord.gg/APPf3Rq3dF"
target="_blank"
className="heroBtn"
>
ПРИЄДНАТИСЯ
</a>

</div>

</div>

</div>

<div className="stats">

<div className="statCard">
<h2>20+</h2>
<p>ЧЛЕНИ СІМ'Ї</p>
</div>

<div className="statCard">
<h2>{contractsCount}</h2>
<p>КОНТРАКТИ</p>
</div>

<div className="statCard">
<h2>${totalIncome.toLocaleString()}</h2>
<p>ЗАГАЛЬНИЙ ДОХІД</p>
</div>

<div className="statCard">
<h2>${cleanIncome.toLocaleString()}</h2>
<p>ЧИСТИЙ ДОХІД</p>
</div>

</div>

<div className="about">

<div className="sectionTitle">
ПРО СІМ’Ю
</div>

<div className="aboutCard">

Grizzly Family — сильна та амбітна сім’я в світі GTA 5 RP. 
Відомі своїм характером, вірністю один одному та любов’ю до адреналіну, швидких авто й небезпечних пригод. 
Учасники сім’ї тримаються разом у будь-яких ситуаціях, поважають свої правила та завжди готові захищати своїх людей.

</div>

</div>

<div className="features">

<div className="sectionTitle">
НАШІ ОСОБЛИВОСТІ
</div>

<div className="featureGrid">

<div className="featureCard">
🔥 Скоро
</div>

<div className="featureCard">
💰 Скоро
</div>

<div className="featureCard">
⚔ Скоро
</div>

<div className="featureCard">
🎭 Скоро
</div>

<div className="featureCard">
🌐 Скоро
</div>

</div>

</div>

</>

)

}
