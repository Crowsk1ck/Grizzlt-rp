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

const resetIncome = ()=>{

const income = prompt(
'СКІЛЬКИ СКРИТИ ДОХОДУ?'
)

if(!income) return

localStorage.setItem(
'hidden_income',
income
)

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

const response = await fetch(
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
'Тижневий звіт успішно відправлений.',

color:0xff0055,

footer:{
text:'GRIZZLY FAMILY'
},

timestamp:new Date().toISOString()

}]

})
}
)

if(response.ok){

alert('WEEKLY REPORT SENT')

}else{

alert('DISCORD WEBHOOK ERROR')

}

}catch(err){

console.log(err)

alert('ERROR')

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
RESET CONTRACTS
</button>

<button
className="adminBtn"
onClick={resetIncome}
>
RESET TOTAL INCOME
</button>

<button
className="adminBtn"
onClick={clearDatabase}
>
CLEAR DATABASE
</button>

<button
className="adminBtn"
onClick={sendWeeklyReport}
>
SEND WEEKLY REPORT
</button>

</div>

</div>

</div>

</>

)

}
