import { useEffect, useState } from 'react'
 
import {
db,
collection,
addDoc,
getDocs,
query,
deleteDoc,
doc
} from '../services/firebase'

export default function Contracts(){

const [title,setTitle] = useState('')
const [amount,setAmount] = useState('')
const [startedBy,setStartedBy] = useState('')
const [members,setMembers] = useState('')
const [contracts,setContracts] = useState([])

const user = JSON.parse(
localStorage.getItem('user')
)

const loadContracts = async()=>{

try{

const q = query(
collection(db,'contracts')
)

const snapshot = await getDocs(q)

const arr=[]

snapshot.forEach(d=>{
arr.push({
id:d.id,
...d.data()
})
})

setContracts(
arr.sort((a,b)=>b.created-a.created)
)

}catch(err){

console.log(err)

}

}

useEffect(()=>{
loadContracts()
},[])

const sendContract = async()=>{

try{

if(!title || !amount || !startedBy || !members){
alert('Заповни всі поля')
return
}

const membersCount =
members
.split(',')
.filter(x=>x.trim()!=='')
.length

await addDoc(collection(db,'contracts'),{

title,
amount:Number(amount.replace(/\D/g,'')),
members,
startedBy,
membersCount,
created:Date.now()

})

await fetch(
'https://discord.com/api/webhooks/1506424883737788619/yATAISypU22ZWVvhRKMsSeSZT1l7bghWRvPSoLaERM8tdj1Wx70JXq4QU2DjYwiHC72F',
{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({

embeds:[

{

title:'💰 NEW CONTRACT',

description:'GRIZZLY FAMILY CONTRACT SYSTEM',

color:0xff0055,

author:{
name:user?.username || startedBy,
icon_url:
user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png'
},

fields:[

{
name:'📄 Контракт',
value:`${title}`,
inline:false
},

{
name:'👑 Почав',
value:`${startedBy}`,
inline:true
},

{
name:'💵 Сума',
value:`$${amount}`,
inline:true
},

{
name:'👥 Учасники',
value:`${members}`,
inline:false
}

],

footer:{
text:'GRIZZLY FAMILY • CONTRACT LOGS'
},

timestamp:new Date().toISOString()

}

]

})
}
)

setTitle('')
setAmount('')
setStartedBy('')
setMembers('')

setTimeout(()=>{
loadContracts()
},500)

alert('КОНТРАКТ ДОДАНО')

}catch(err){

console.log(err)

alert('ПОМИЛКА CONTRACTS')

}

}

const clearPanel = async()=>{

try{

const password = prompt('Введи пароль')

if(password !== 'grizzlyadmin'){
alert('Невірний пароль')
return
}

for(const c of contracts){
await deleteDoc(doc(db,'contracts',c.id))
}

loadContracts()

}catch(err){

console.log(err)

}

}

const totalIncome =
contracts.reduce(
(a,b)=>a + Number(b.amount || 0),
0
)

const hiddenIncome =
Number(
localStorage.getItem('hidden_income') || 0
)

const visibleIncome =
Math.max(
0,
Number(totalIncome || 0) -
Number(hiddenIncome || 0)
)

const cleanIncome =
Math.floor(
Number(visibleIncome || 0) * 0.84
)

localStorage.setItem(
'clean_income',
cleanIncome
)

const weekIncome =
contracts
.filter(c=>{

const weekAgo =
Date.now() - 7*24*60*60*1000

return c.created > weekAgo

})
.reduce(
(a,b)=>a + Number(b.amount || 0),
0
)

const cleanWeekIncome =
Math.floor(weekIncome * 0.84)


return(
<>
<h1 className="title">
GRIZZLY PANEL
</h1>

<div
className="dashboard"
style={{
display:'grid',
gridTemplateColumns:'1fr 1.2fr',
gap:'25px',
alignItems:'start'
}}
>

<div className="panel">

<div
className="title"
style={{fontSize:'30px'}}
>
ДОДАТИ КОНТРАКТ
</div>

<input
className="input"
placeholder="📄 Назва контракту"
value={title}
onChange={e=>setTitle(e.target.value)}
/>

<div className="double">

<input
className="input"
placeholder="💰 Сума"
value={amount}
onChange={e=>setAmount(e.target.value)}
/>

<input
className="input"
placeholder="👑 Хто почав контракт"
value={startedBy}
onChange={e=>setStartedBy(e.target.value)}
/>

</div>

<input
className="input"
placeholder="👥 Учасники"
value={members}
onChange={e=>setMembers(e.target.value)}
/>

<div
style={{
marginTop:'14px',
padding:'14px 16px',
background:'rgba(255,255,255,.03)',
border:'1px solid rgba(255,0,85,.12)',
borderRadius:'14px',
fontSize:'14px',
color:'#aaa',
lineHeight:'1.7'
}}
>

<span style={{
color:'#ff0055',
fontWeight:'700'
}}>
ℹ Учасників пишемо через кому
</span>

<br/>

<span style={{
color:'#666'
}}>
Приклад:
</span>

<br/>

<span style={{
color:'#fff'
}}>
Andrii Grizzly, Maryana, Ghost
</span>

<br/><br/>

<span style={{
color:'#00ff99',
fontWeight:'700'
}}>
Кількість учасників:
{
members
.split(',')
.filter(x=>x.trim()!=='')
.length
}
</span>

</div>

<div
style={{
display:'flex',
gap:'10px',
marginTop:'15px',
flexWrap:'wrap'
}}
>

<button
className="btn"
style={{
flex:1,
minWidth:'180px'
}}
onClick={sendContract}
>
ДОДАТИ КОНТРАКТ
</button>

<button
className="btn"
style={{
background:'#222',
flex:1,
minWidth:'180px'
}}
onClick={clearPanel}
>
ОЧИСТИТИ ПАНЕЛЬ
</button>

</div>

</div>

<div
className="panel"
style={{
background:'rgba(255,255,255,.05)',
backdropFilter:'blur(20px)',
border:'1px solid rgba(255,255,255,.08)',
borderRadius:'24px',
padding:'30px',
boxShadow:'0 0 40px rgba(0,0,0,.3)'
}}
>

<div
className="title"
style={{fontSize:'30px'}}
>
СТАТИСТИКА
</div>

<div className="statGrid">

<div className="stat">
<h2>{contracts.length}</h2>
<p>КОНТРАКТІВ</p>
</div>

<div className="stat">
<h2>${visibleIncome.toLocaleString()}</h2>
<p>ЗАГАЛЬНИЙ ДОХІД</p>
</div>

<div className="stat">
<h2>
${cleanIncome.toLocaleString()}
</h2>
<p>ЧИСТИЙ ДОХІД</p>
</div>

<div className="stat">
<h2>
${cleanWeekIncome.toLocaleString()}
</h2>
<p>ДОХІД ЗА 7 ДНІВ</p>
</div>

<div className="stat">
<h2>
{
contracts.length>0
? Math.floor(
contracts.reduce((a,b)=>a+b.membersCount,0)
/ contracts.length
)
:0
}
</h2>

<p>
СЕРЕДНЯ КІЛЬКІСТЬ УЧАСНИКІВ
</p>

</div>

</div>

<div className="row rowHeader">

<div>
КОНТРАКТ
</div>

<div>
УЧАСНИКИ
</div>

<div>
ДОХІД
</div>

</div>

{contracts.map(c=>(
<div
className="row"
key={c.id}
>

<div>

{c.title}

<br/><br/>

<span style={{
color:'#999',
fontSize:'14px',
lineHeight:'1.7'
}}>

👑 {c.startedBy}

<br/>

👥 {c.members}

</span>

</div>

<div>
{c.membersCount}
</div>

<div className="green">
${c.amount}
</div>



</div>
))}

</div>

<div
className="panel"
style={{
marginTop:'25px'
}}
>

<div
className="title"
style={{fontSize:'28px'}}
>
CONTRACT PAYOUT
</div>

{
contracts.slice(0,5).map((c,index)=>{

const membersArray =
c.members
.split(',')
.filter(x=>x.trim()!=='')

const familyCut =
Math.floor(Number(c.amount || 0) * 0.20)

const membersMoney =
Math.floor(
(Number(c.amount || 0) - familyCut)
/ Math.max(membersArray.length,1)
)

return(

<div
key={index}
style={{
marginTop:'16px',
padding:'18px',
background:'rgba(255,255,255,.03)',
borderRadius:'18px',
border:'1px solid rgba(255,0,85,.1)'
}}
>

<div style={{
color:'#ff0055',
fontWeight:'700',
marginBottom:'14px'
}}>
💸 {c.title}
</div>

{
membersArray.map((member,i)=>(

<div
key={i}
style={{
display:'flex',
justifyContent:'space-between',
marginBottom:'8px',
color:'#ccc'
}}
>

<span>{member}</span>

<span style={{
color:'#00ff99',
fontWeight:'700'
}}>
${membersMoney.toLocaleString()}
</span>

</div>

))
}

<div
style={{
marginTop:'12px',
paddingTop:'12px',
borderTop:'1px solid rgba(255,255,255,.08)',
display:'flex',
justifyContent:'space-between'
}}
>

<span style={{
color:'#ff0055',
fontWeight:'700'
}}>
GRIZZLY FAMILY
</span>

<span style={{
color:'#ff0055',
fontWeight:'700'
}}>
${familyCut.toLocaleString()}
</span>

</div>

</div>

)

})
}

</div>
</div>
</>

)
}
