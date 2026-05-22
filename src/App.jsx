import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import Home from './pages/Home'
import Team from './pages/Team'
import Gallery from './pages/Gallery'
import Contracts from './pages/Contracts'
import Apply from './pages/Apply'
import Admin from './pages/Admin'
import LoadingScreen from './components/LoadingScreen'

export default function App(){

const [user,setUser] = useState(null)
const [loading,setLoading] = useState(true)
const applicationSent = localStorage.getItem('application_sent')

useEffect(()=>{

const token = new URLSearchParams(
window.location.hash.substring(1)
).get('access_token')

if(token){

fetch('https://discord.com/api/users/@me',{
headers:{
authorization:`Bearer ${token}`
}
})
.then(r=>r.json())
.then(data=>{
localStorage.setItem('discord_user',JSON.stringify(data))
setUser(data)
window.location.hash=''
})

}

const saved = localStorage.getItem('discord_user')

if(saved){
setUser(JSON.parse(saved))
}

},[])

if(loading){
return <LoadingScreen onFinish={()=>setLoading(false)} />
}

if(!user){
return(
<>
<video className="bgvideo" autoPlay muted loop playsInline>
<source src="/assets/media/background.mp4" type="video/mp4"/>
</video>

<div className="overlay"></div>

<div className="auth">
<div style={{textAlign:'center'}}>
<h1 style={{fontSize:'72px',color:'#ff004c'}}>GRIZZLY FAMILY</h1>

<a
className="loginBtn"
href="https://discord.com/oauth2/authorize?client_id=1506029366008610856&response_type=token&redirect_uri=https%3A%2F%2Fwww.grizzly-family.online%2F&scope=identify%20email"
>
LOGIN WITH DISCORD
</a>

</div>
</div>
<audio autoPlay loop controls className='musicPlayer'><source src='/assets/music/phonk.mp3' type='audio/mp3'/></audio>
</>
)
}

return(
<>
<video className="bgvideo" autoPlay muted loop playsInline>
<source src="/assets/media/background.mp4" type="video/mp4"/>
</video>

<div className="overlay"></div>

<div className="userBox">

<img
src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
className="userAvatar"
/>

<div className="userInfo">

<div className="userName">
{user.username}
</div>

<button
className="logoutBtn"
onClick={logout}
>
LOGOUT
</button>

</div>

</div>

<nav>
<Link to="/">Головна</Link>
<Link to="/team">Команда</Link>
<Link to="/gallery">Галерея</Link>
<Link to="/contracts">Контракти</Link>

{!applicationSent && (
<Link to="/apply">Заявка</Link>
)}

</nav>

<div className="container">

<Routes>
<Route path="/" element={<Home />} />
<Route path="/team" element={<Team />} />
<Route path="/gallery" element={<Gallery />} />
<Route path="/contracts" element={<Contracts />} />
<Route path="/apply" element={<Apply />} />
<Route path="/admin" element={<Admin />} />
</Routes>

</div>
<audio autoPlay loop controls className='musicPlayer'><source src='/assets/music/phonk.mp3' type='audio/mp3'/></audio>
</>
)
}
