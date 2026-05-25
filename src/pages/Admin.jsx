import { useState } from 'react'

import {
db,
collection,
getDocs,
deleteDoc,
doc,
addDoc
} from '../services/firebase'

export default function Admin(){

const [access,setAccess] = useState(false)

const loginAdmin = ()=>{

const password = prompt('ADMIN PASSWORD')

if(password === 'grizzlyadmin'){
setAccess(true)
}else{
alert('ACCESS DENIED')
}

}

const resetContracts = ()=>{
localStorage.setItem('contracts_reset',Date.now())
window.location.reload()
}

const resetIncome = async()=>{

const password = prompt('RESET TOTAL INCOME ?')

if(password !== 'grizzlyadmin'){
alert('WRONG PASSWORD')
return
}

localStorage.setItem('total_income',0)
localStorage.setItem('total_expenses',0)
localStorage.setItem('clean_income',0)

const expensesSnapshot = await getDocs(collection(db,'expenses'))

for(const item of expensesSnapshot.docs){
await deleteDoc(doc(db,'expenses',item.id))
}

alert('TOTAL INCOME RESETED')
window.location.reload()

}

const clearDatabase = async()=>{

const password = prompt('DELETE DATABASE ?')

if(password !== 'grizzlyadmin'){
alert('WRONG PASSWORD')
return
}

const contracts = await getDocs(collection(db,'contracts'))

for(const item of contracts.docs){
await deleteDoc(doc(db,'contracts',item.id))
}

const expenses = await getDocs(collection(db,'expenses'))

for(const item of expenses.docs){
await deleteDoc(doc(db,'expenses',item.id))
}

localStorage.clear()

alert('DATABASE CLEARED')

window.location.reload()

}

const addTeamMember = async()=>{

try{

const name = prompt('NICKNAME')
if(!name) return

const role = prompt('ROLE')
if(!role) return

const discordId = prompt('DISCORD ID')
if(!discordId) return

await addDoc(collection(db,'team'),{
name,
role,
discordId,
avatar:'',
created:Date.now()
})

alert('TEAM MEMBER ADDED')

}catch(err){

console.log(err)
alert('ERROR TEAM MEMBER')

}

}

if(!access){

return(

<div className="adminLogin">

<h1 className="title">ADMIN PANEL</h1>

<button
className="adminBtn"
onClick={loginAdmin}
>
LOGIN
</button>

</div>

)

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
onClick={addTeamMember}
>
ADD TEAM MEMBER
</button>

</div>

</div>

</div>

</>

)

}