import { useEffect, useState } from 'react'
import {
db,
collection,
getDocs
} from '../services/firebase'

export default function Team(){

const [members,setMembers] = useState([])

const loadTeam = async()=>{

try{

const snapshot = await getDocs(
collection(db,'team')
)

const arr=[]

snapshot.forEach(doc=>{
arr.push({
id:doc.id,
...doc.data()
})
})

setMembers(arr)

}catch(err){

console.log(err)

}

}

useEffect(()=>{
loadTeam()
},[])

return(

<>

<h1 className="title">
GRIZZLY TEAM
</h1>

<div className="teamGrid">

{
members.map((m,index)=>(

<div
key={index}
className="teamCard"
>

<img
src={
m.avatar
? `https://cdn.discordapp.com/avatars/${m.discordId}/${m.avatar}.png`
: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=111111&color=ff0066&size=256`
}
className="teamAvatar"
alt={m.name}
/>

<div className="teamName">
{m.name}
</div>

<div className="teamRole">
{m.role}
</div>

<div className="teamButtons">

<a
href={`https://discord.com/users/${m.discordId}`}
target="_blank"
className="teamBtn"
>
Профіль
</a>

</div>

</div>

))
}

</div>

</>

)

}
