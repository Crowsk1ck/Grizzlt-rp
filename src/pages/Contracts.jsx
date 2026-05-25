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
const [expenseTitle,setExpenseTitle] = useState('')
const [expenseAmount,setExpenseAmount] = useState('')
const [expenses,setExpenses] = useState([])

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

const loadExpenses = async()=>{

try{

const q = query(
collection(db,'expenses')
)

const snapshot = await getDocs(q)

const arr=[]

snapshot.forEach(d=>{
arr.push({
id:d.id,
...d.data()
})
})

setExpenses(
arr.sort((a,b)=>b.created-a.created)
)

}catch(err){

console.log(err)

}

}

useEffect(()=>{
loadExpenses()
},[])

const sendExpense = async()=>{

try{

if(!expenseTitle || !expenseAmount){
alert('Заповни всі поля')
return
}

await addDoc(collection(db,'expenses'),{

title:expenseTitle,
amount:Number(
String(expenseAmount).replace(/\D/g,'')
),
created:Date.now()

})

setExpenseTitle('')
setExpenseAmount('')

setTimeout(()=>{
loadExpenses()
},500)

}catch(err){

console.log(err)

}

}

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

for(const e of expenses){
await deleteDoc(doc(db,'expenses',e.id))
}

localStorage.clear()

setContracts([])
setExpenses([])

alert('ПАНЕЛЬ ОЧИЩЕНО')

}catch(err){

console.log(err)

}

}

const totalIncome =
contracts.reduce(
(a,b)=>a + Number(b.amount || 0),
0
)

const totalExpenses =
expenses.reduce(
(a,b)=>a + Number(b.amount || 0),
0
)

const finalIncome =
Math.max(
0,
totalIncome - totalExpenses
)

return(
<div>

<h1 className="title">
GRIZZLY PANEL
</h1>

<div className="panel">

<input
className="input"
placeholder="Назва контракту"
value={title}
onChange={e=>setTitle(e.target.value)}
/>

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

<input
className="input"
placeholder="Учасники через кому"
value={members}
onChange={e=>setMembers(e.target.value)}
/>

<div style={{marginTop:'10px'}}>

Кількість учасників:
{
members
.split(',')
.filter(x=>x.trim()!=='')
.length
}

</div>

<button
className="btn"
onClick={sendContract}
>
ДОДАТИ КОНТРАКТ
</button>

<button
className="btn"
onClick={clearPanel}
>
ОЧИСТИТИ ПАНЕЛЬ
</button>

</div>

<div className="panel">

<h2>
Контрактів: {contracts.length}
</h2>

<h2>
Дохід: ${finalIncome}
</h2>

</div>

</div>
)

}
