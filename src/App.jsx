import CustomCursor from './components/CustomCursor'
import { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'

import {
db,
collection,
getDocs,
addDoc
} from './services/firebase'

import Home from './pages/Home'
import Team from './pages/Team'
import Gallery from './pages/Gallery'
import Contracts from './pages/Contracts'
import Apply from './pages/Apply'
import Admin from './pages/Admin'
import LoadingScreen from './components/LoadingScreen'

function SidebarLink({to,label,icon}){

const location = useLocation()

return(
<Link
to={to}
className={`sideLink ${location.pathname === to ? 'activeSide' : ''}`}
>
<span>{icon}</span>
{label}
</Link>
)

}

const particles = Array.from({ length: 35 })

export default function App(){

const [user,setUser] = useState(null)
const [loading,setLoading] = useState(true)
const [onlineCount,setOnlineCount] = useState(48)

useEffect(()=>{

const interval = setInterval(()=>{
setOnlineCount(Math.floor(Math.random() * 30) + 35)
},30000)

return ()=>clearInterval(interval)

},[])


const logout = ()=>{

localStorage.removeItem('discord_user')
window.location.reload()

}

const applicationSent = localStorage.getItem('application_sent')

const syncDiscordUserToTeam = async(discordUser)=>{

try{

if(!discordUser) return

const snapshot = await getDocs(
collection(db,'team')
)

let exists = false

snapshot.forEach(docu=>{

const data = docu.data()

if(data.discordId === discordUser.id){
exists = true
}

})

if(!exists){

await addDoc(
collection(db,'team'),
{
name:discordUser.username,
role:'MEMBER',
discordId:discordUser.id,
avatar:discordUser.avatar,
created:Date.now()
}
)

}

}catch(err){

console.log(err)

}

}

useEffect(()=>{

const saved = localStorage.getItem('discord_user')

if(saved){

try{

const parsed = JSON.parse(saved)

setUser(parsed)

syncDiscordUserToTeam(parsed)

}catch(err){

console.log(err)

}

}

setLoading(false)

},[])

if(loading){
return <LoadingScreen onFinish={()=>setLoading(false)} />
}

if(!user){

return(

<div className="loginPage">

<video className="bgvideo" autoPlay muted loop playsInline>
<source src="/assets/media/background.mp4" type="video/mp4"/>
</video>

<div className="overlay"></div>

<div className="loginCard">

<h1 className="loginTitle">
GRIZZLY FAMILY
</h1>

<p className="loginText">
PREMIUM GTA RP ORGANIZATION PANEL
</p>

<a
className="loginBtn"
href="https://discord.com/oauth2/authorize?client_id=1506029366008610856&response_type=token&redirect_uri=https%3A%2F%2Fwww.grizzly-family.online%2F&scope=identify"
>
LOGIN WITH DISCORD
</a>

</div>

</div>

)

}

return(

<>

<CustomCursor />

<div className="layoutRoot">

<div className="particles">
{
particles.map((_,i)=>(

<div
key={i}
className="particle"
/>

))
}
</div>

<video className="bgvideo" autoPlay muted loop playsInline>
<source src="/assets/media/background.mp4" type="video/mp4"/>
</video>

<div className="overlay"></div>

<aside className="sidebar">

<div className="logoBox">

<div className="logoIcon">
🐻
</div>

<div>
<div className="logoTitle">
GRIZZLY
</div>

<div className="logoSub">
FAMILY
</div>
</div>

</div>

<div className="sidebarLinks">

<SidebarLink to="/" label="Главная" icon="⌂" />
<SidebarLink to="/team" label="Команда" icon="👥" />
<SidebarLink to="/gallery" label="Галерея" icon="▣" />
<SidebarLink to="/contracts" label="Контракты" icon="◈" />

{!applicationSent && (
<SidebarLink to="/apply" label="Заявка" icon="✦" />
)}

<SidebarLink to="/admin" label="Admin" icon="⚙" />

</div>

<div className="sidebarCard">

<div className="onlineTitle">
GRIZZLY FAMILY
</div>

<div className="onlineCount">
ONLINE: {onlineCount}
</div>

</div>

</aside>

<main className="mainContent">

<div className="topbar">

<div className="topbarGlow"></div>

<div className="topbarLeft">

<div className="pageLabel">
GRIZZLY PANEL
</div>

</div>

<div className="topbarRight">

<div className="profileCard">

<img
src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=512`}
className="userAvatar"
/>

<div>

<div className="userName">
{user.username}
</div>

<div className="adminBadge">
ADMIN
</div>

</div>

</div>

<button
className="logoutBtn"
onClick={logout}
>
LOGOUT
</button>

</div>

</div>

<div className="pageWrapper">

<Routes>
<Route path="/" element={<Home />} />
<Route path="/team" element={<Team />} />
<Route path="/gallery" element={<Gallery />} />
<Route path="/contracts" element={<Contracts />} />
<Route path="/apply" element={<Apply />} />
<Route path="/admin" element={<Admin />} />
</Routes>

</div>

</main>

</div>

</>

)

}
