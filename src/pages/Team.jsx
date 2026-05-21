export default function Team(){

const members = [

{
name:'CrowsKick',
role:'OWNER',
avatar:'https://i.imgur.com/8Km9tLL.png'
},

{
name:'Maryana',
role:'CO-OWNER',
avatar:'https://i.imgur.com/8Km9tLL.png'
},

{
name:'Zim',
role:'LEADER',
avatar:'https://i.imgur.com/8Km9tLL.png'
},

{
name:'Neffiltrovanuyi',
role:'WAR MANAGER',
avatar:'https://i.imgur.com/8Km9tLL.png'
},

{
name:'BlackWolf',
role:'BUSINESS',
avatar:'https://i.imgur.com/8Km9tLL.png'
},

{
name:'Ghost',
role:'EVENTS',
avatar:'https://i.imgur.com/8Km9tLL.png'
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
