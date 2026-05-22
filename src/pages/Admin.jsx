import {
db,
collection,
getDocs,
deleteDoc,
doc
} from '../services/firebase'

export default function Admin(){

const resetContracts = ()=>{

localStorage.setItem(
'contracts_reset',
Date.now()
)

window.location.reload()

}

const resetIncome = async()=>{

const password = prompt(
'RESET TOTAL INCOME ?'
)

if(password !== 'grizzlyadmin'){
alert('WRONG PASSWORD')
return
}

localStorage.setItem(
'total_income',
0
)

localStorage.setItem(
'total_expenses',
0
)

localStorage.setItem(
'clean_income',
0
)

const expensesSnapshot = await getDocs(
collection(db,'expenses')
)

for(const item of expensesSnapshot.docs){

await deleteDoc(
doc(db,'expenses',item.id)
)

}

alert('TOTAL INCOME RESETED')

window.location.reload()

}
const clearDatabase = async()=>{

const password = prompt(
'DELETE DATABASE ?'
)

if(password !== 'grizzlyadmin'){
alert('WRONG PASSWORD')
return
}

const snapshot = await getDocs(
collection(db,'contracts')
)

for(const item of snapshot.docs){

await deleteDoc(
doc(db,'contracts',item.id)
)

}

alert('DATABASE CLEARED')

window.location.reload()

}
const sendWeeklyReport = async()=>{

try{

const contractsSnapshot = await getDocs(
collection(db,'contracts')
)

const contracts = []

contractsSnapshot.forEach(docu=>{
contracts.push(docu.data())
})

const stats = {}

let totalIncome = 0

contracts.forEach(c=>{

const amount =
Number(c.amount || 0)

totalIncome += amount

const membersArray =
(c.members || '')
.split(',')
.filter(x=>x.trim()!=='')

const familyCut =
Math.floor(amount * 0.20)

const memberMoney =
Math.floor(
(amount - familyCut)
/ Math.max(membersArray.length,1)
)

membersArray.forEach(member=>{

const cleanName = member.trim()

if(!stats[cleanName]){

stats[cleanName]={
money:0,
contracts:0
}

}

stats[cleanName].money += memberMoney
stats[cleanName].contracts += 1

})

})

const topText = Object.entries(stats)

.sort((a,b)=>b[1].money-a[1].money)

.map((item,index)=>

`${index+1}. ${item[0]}

📦 Контрактів: ${item[1].contracts}

💰 $${item[1].money.toLocaleString()}`
)

.join('\n\n━━━━━━━━━━━━\n\n')

await fetch(
'https://discord.com/api/webhooks/1507275442657296386/utT-89112eXBwIL7ijrwlYz-ob4H9-bQh79PEbGR0XhWxuZpE7IShP8YSJCwkPyNVsnZ',
{
method:'POST',

headers:{
'Content-Type':'application/json'
},

body:JSON.stringify({

embeds:[{

title:'📊 СУМА ЗА ТИЖДЕНЬ',

description:
`💵 ЗАГАЛЬНИЙ ДОХІД:
$${totalIncome.toLocaleString()}

👥 УЧАСНИКИ:

${topText}`,

color:0xff0055,

footer:{
text:'GRIZZLY FAMILY'
},

timestamp:new Date().toISOString()

}]

})
}
)

alert('WEEKLY REPORT SENT')

}catch(err){

console.log(err)

alert('ERROR WEEKLY REPORT')

}

}
const password = prompt('ADMIN PASSWORD')

if(password !== 'grizzlyadmin'){
return <h1 className="title">ACCESS DENIED</h1>
}

return(

<>

<h1 className="title">
GRIZZLY ADMIN
</h1>

<div className="adminLayout">

<div className="adminCard">

<div className="adminCardTitle">
SYSTEM
</div>

<div className="adminButtons">

<button
className="adminBtn"
onClick={resetContracts}
>
Перезапустити Конт.
</button>

<button
className="adminBtn"
onClick={resetIncome}
>
Очистити Розходи
</button>

<button
className="adminBtn"
onClick={clearDatabase}
>
Очистити базу
</button>

<button
className="adminBtn"
onClick={sendWeeklyReport}
>
Тижневий звіт
</button>

</div>

</div>

</div>

</>

)

}
