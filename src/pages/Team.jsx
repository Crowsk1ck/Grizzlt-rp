export default function Team(){

const members = [

{
name:'CrowsKick',
role:'OWNER',
id:'DISCORD_ID',
avatar:'DISCORD_AVATAR_HASH'
},

{
name:'Maryana',
role:'CO-OWNER',
id:'DISCORD_ID',
avatar:'DISCORD_AVATAR_HASH'
},

{
name:'Zim',
role:'LEADER',
id:'DISCORD_ID',
avatar:'DISCORD_AVATAR_HASH'
},

{
name:'Neffiltrovanuyi',
role:'WAR MANAGER',
id:'DISCORD_ID',
avatar:'DISCORD_AVATAR_HASH'
},

{
name:'BlackWolf',
role:'BUSINESS',
id:'DISCORD_ID',
avatar:'DISCORD_AVATAR_HASH'
},

{
name:'Ghost',
role:'EVENTS',
id:'DISCORD_ID',
avatar:'DISCORD_AVATAR_HASH'
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
src={m.avatar}
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
PROFILE
</button>

<button className="teamBtn secondary">
MESSAGE
</button>

</div>

</div>

))
}

</div>

</>

)

}
