export default function Team(){

const discordUser = JSON.parse(
localStorage.getItem('discord_user')
)

const members = [

{
name:'CrowsKick',
role:'OWNER',
id: discordUser?.id || '511272056021581835',
avatar: discordUser?.avatar || null
},

{
name:'Maryana',
role:'CO-OWNER',
id:'1053785420351148132',
avatar:null
},

{
name:'Нету',
role:'LEADER',
id:'DISCORD_ID',
avatar:null
},

{
name:'Нету',
role:'WAR MANAGER',
id:'DISCORD_ID',
avatar:null
},

{
name:'Нету',
role:'BUSINESS',
id:'DISCORD_ID',
avatar:null
},

{
name:'Нету',
role:'EVENTS',
id:'DISCORD_ID',
avatar:null
}

]

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
? `https://cdn.discordapp.com/avatars/${m.id}/${m.avatar}.png`
: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=111111&color=ff0066&size=256`
}
className="teamAvatar"
/>

<div className="teamName">
{m.name}
</div>

<div className="teamRole">
{m.role}
</div>

<div className="teamButtons">

<button className="teamBtn">
Профіль
</button>

</div>

</div>

))
}

</div>

</>

)

}
