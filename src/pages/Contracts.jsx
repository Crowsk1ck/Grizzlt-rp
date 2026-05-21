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
.split('.')
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
content:
`🔥 НОВИЙ КОНТРАКТ

📄 ${title}

💰 ${amount}

👑 ${startedBy}

👥 ${members}`
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
contracts.reduce((a,b)=>a+b.amount,0)

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
<h2>${totalIncome.toLocaleString()}</h2>
<p>ЗАГАЛЬНИЙ ДОХІД</p>
</div>

<div className="stat">
<h2>
${Math.floor(totalIncome*0.84).toLocaleString()}
</h2>
<p>ЧИСТИЙ ДОХІД</p>
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

</div>

</>

)
}
