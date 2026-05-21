import { useEffect, useState } from 'react'
import {
db,
collection,
addDoc,
getDocs,
deleteDoc,
doc
} from '../services/firebase'

export default function Contracts(){

const [contracts,setContracts] = useState([])
const [title,setTitle] = useState('')
const [amount,setAmount] = useState('')
const [startedBy,setStartedBy] = useState('')
const [members,setMembers] = useState('')

const loadContracts = async()=>{

const snapshot = await getDocs(collection(db,'contracts'))

let arr=[]

snapshot.forEach(item=>{
arr.push({
id:item.id,
...item.data()
})
})

arr = arr
.filter(c=>
c.month===new Date().getMonth() &&
c.year===new Date().getFullYear()
)
.sort((a,b)=>b.created-a.created)

setContracts(arr)

}

useEffect(()=>{
loadContracts()
},[])

const addContract = async()=>{

const membersCount =
members.split('.').filter(x=>x.trim()!=='').length

await addDoc(collection(db,'contracts'),{
title,
amount:Number(amount.replace(/\D/g,'')),
startedBy,
members,
membersCount,
created:Date.now(),
month:new Date().getMonth(),
year:new Date().getFullYear()
})

setTitle('')
setAmount('')
setStartedBy('')
setMembers('')

loadContracts()

}

const clearAll = async()=>{

const pass = prompt('Пароль')

if(pass !== 'grizzlyadmin'){
alert('Невірний пароль')
return
}

for(const c of contracts){
await deleteDoc(doc(db,'contracts',c.id))
}

loadContracts()

}

const total = contracts.reduce((a,b)=>a+b.amount,0)

return(
<>
<h1 className="title">GRIZZLY CONTRACTS</h1>

<div className="dashboard">

<div className="panel">

<input
className="input"
placeholder="Назва контракту"
value={title}
onChange={e=>setTitle(e.target.value)}
/>

<div className="double">

<input
className="input"
placeholder="Сума"
value={amount}
onChange={e=>setAmount(e.target.value)}
/>

<input
className="input"
placeholder="Хто почав"
value={startedBy}
onChange={e=>setStartedBy(e.target.value)}
/>

</div>

<input
className="input"
placeholder="Учасники через крапку"
value={members}
onChange={e=>setMembers(e.target.value)}
/>

<button className="btn" onClick={addContract}>
ДОДАТИ КОНТРАКТ
</button>

<button className="btn" style={{background:'#222'}} onClick={clearAll}>
ОЧИСТИТИ
</button>

</div>

<div className="panel">

<div className="statGrid">

<div className="stat">
<h2>{contracts.length}</h2>
<p>КОНТРАКТІВ</p>
</div>

<div className="stat">
<h2>${total.toLocaleString()}</h2>
<p>ДОХІД</p>
</div>

<div className="stat">
<h2>${Math.floor(total*0.84).toLocaleString()}</h2>
<p>ЧИСТИЙ ДОХІД</p>
</div>

<div className="stat">
<h2>{
contracts.length
? Math.floor(contracts.reduce((a,b)=>a+b.membersCount,0)/contracts.length)
:0
}</h2>
<p>СЕРЕДНЯ КІЛЬКІСТЬ</p>
</div>

</div>

<div className="row rowHeader">
<div>КОНТРАКТ</div>
<div>УЧАСНИКИ</div>
<div>ДОХІД</div>
</div>

{contracts.map(c=>(
<div className="row" key={c.id}>

<div>
{c.title}
<br/><br/>
<span style={{color:'#999'}}>
👑 {c.startedBy}
<br/>
👥 {c.members}
</span>
</div>

<div>{c.membersCount}</div>

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