import { useEffect, useState } from 'react'

import {
db,
collection,
addDoc,
getDocs,
query,
where,
orderBy,
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

const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear()

const q = query(
collection(db,'contracts'),
where('month','==',currentMonth),
where('year','==',currentYear),
orderBy('created','desc')
)

const snapshot = await getDocs(q)

const arr = []

snapshot.forEach(docu=>{
arr.push({
id:docu.id,
...docu.data()
})
})

setContracts(arr)

}

useEffect(()=>{
loadContracts()
},[])

const sendContract = async()=>{

if(!title || !amount || !members || !startedBy){
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

created:Date.now(),

month:new Date().getMonth(),
year:new Date().getFullYear()

})

alert('Контракт додано')

setTitle('')
setAmount('')
setStartedBy('')
setMembers('')

loadContracts()

}

const clearPanel = async()=>{

const password = prompt('Введи пароль')

if(password !== 'grizzlyadmin'){
alert('Невірний пароль')
return
}

for(const c of contracts){
await deleteDoc(doc(db,'contracts',c.id))
}

loadContracts()

}

const contractsCount = contracts.length

const membersAverage =
contractsCount > 0
? Math.floor(
contracts.reduce((a,b)=>a+b.membersCount,0)
/ contractsCount
)
: 0

const totalIncome =
contracts.reduce((a,b)=>a+b.amount,0)

const netIncome =
Math.floor(totalIncome * 0.84)

return(
<div className="wrapper">

<div className="title">
GRIZZLY PANEL
</div>

<div className="dashboard">

<div className="panel">

<div className="panelTitle">
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
placeholder="👥 Учасники через крапку"
value={members}
onChange={e=>setMembers(e.target.value)}
/>

<div className="infoBlock">
Учасників розділяй крапкою.
</div>

<button
className="btn"
onClick={sendContract}
>
ДОДАТИ КОНТРАКТ
</button>

<button
className="btn btnDark"
onClick={clearPanel}
>
ОЧИСТИТИ ПАНЕЛЬ
</button>

</div>

<div className="panel">

<div className="panelTitle">
СТАТИСТИКА
</div>

<div className="statGrid">

<div className="stat">
<h2>{contractsCount}</h2>
<p>КОНТРАКТІВ</p>
</div>

<div className="stat">
<h2>{membersAverage}</h2>
<p>СЕРЕДНЯ КІЛЬКІСТЬ УЧАСНИКІВ</p>
</div>

<div className="stat">
<h2>${totalIncome.toLocaleString()}</h2>
<p>ЗАГАЛЬНИЙ ДОХІД</p>
</div>

<div className="stat">
<h2>${netIncome.toLocaleString()}</h2>
<p>ЧИСТИЙ ДОХІД</p>
</div>

</div>

<div className="table">

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

</div>

</div>
)

}