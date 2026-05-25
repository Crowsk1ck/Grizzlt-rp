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

const data = doc.data()

arr.push({
id:doc.id,
online:Math.random() > 0.5,
rank:data.role || 'Member',
...data
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

<div className="teamPage">

<div className="teamHero">

<div>

<div className="teamMini">
GRIZZLY ORGANIZATION
</div>

<h1 className="teamBigTitle">
TEAM SYSTEM
</h1>

<p className="teamDesc">
Live Discord profiles, online status, ranks and premium GTA RP organization panel.
</p>

</div>

<div className="teamHeroStats">

<div className="heroStat">
<h2>{members.length}</h2>
<span>MEMBERS</span>
</div>

<div className="heroStat">
<h2>{members.filter(m=>m.online).length}</h2>
<span>ONLINE</span>
</div>

<div className="heroStat">
<h2>LIVE</h2>
<span>DISCORD</span>
</div>

</div>

</div>

<div className="teamPremiumGrid">

{
members.map((m,index)=>(

<div
key={index}
className="premiumMemberCard"
>

<div className="cardGlow"></div>

<div className="memberTop">

<div className="avatarWrap">

<img
src={
m.avatar && m.avatar !== ''
? `https://cdn.discordapp.com/avatars/${m.discordId}/${m.avatar}.png?size=512`
: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=111111&color=ff0066&size=256`
}
className="premiumAvatar"
alt={m.name}
/>

<div className={m.online ? 'statusDot onlineDot' : 'statusDot offlineDot'}></div>

</div>

<div className="memberRank">
{m.rank}
</div>

</div>

<div className="memberInfo">

<h2 className="memberName">
{m.name}
</h2>

<div className="memberRole">
{m.role}
</div>

<div className="memberStatus">
{m.online ? 'ONLINE NOW' : 'OFFLINE'}
</div>

</div>

<div className="memberActions">

<a
href={`https://discord.com/users/${m.discordId}`}
target="_blank"
className="discordProfileBtn"
>
DISCORD PROFILE
</a>

</div>

</div>

))
}

</div>

</div>

)

}
