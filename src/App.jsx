import { useEffect, useRef, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Contracts from './pages/Contracts'
import Admin from './pages/Admin'

export default function App(){

const [user,setUser] = useState(null)
const audioRef = useRef(null)

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

if(!user){

return(
<>
<video className="bgvideo" autoPlay muted loop playsInline>
<source src="/assets/media/background.mp4" type="video/mp4"/>
</video>

<div className="overlay"></div>

<div className="auth">
<div className="authBox">

<h1 style={{fontSize:'72px',color:'#ff004c'}}>
GRIZZLY
</h1>

<p style={{color:'#ccc',lineHeight:'1.8'}}>
Premium GTA RP ecosystem with Firebase realtime systems.
</p>

<a
className="btn"
href="https://discord.com/oauth2/authorize?client_id=1506029366008610856&response_type=token&redirect_uri=https%3A%2F%2Fwww.grizzly-family.online%2F&scope=identify%20email"
>
LOGIN WITH DISCORD
</a>

</div>
</div>
</>
)

}

return(
<>
<video className="bgvideo" autoPlay muted loop playsInline>
<source src="/assets/media/background.mp4" type="video/mp4"/>
</video>

<div className="overlay"></div>

<audio autoPlay loop ref={audioRef}>
<source src="/assets/media/music.mp3" type="audio/mp3"/>
</audio>

<div className="profile">

<img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} />

<div>
<div>{user.username}</div>

<button
className="btn"
style={{marginTop:'8px'}}
onClick={()=>{
localStorage.clear()
location.reload()
}}
>
LOGOUT
</button>

</div>

</div>

<nav>
<Link to="/">Dashboard</Link>
<Link to="/contracts">Contracts</Link>
<Link to="/admin">Admin</Link>
</nav>

<div className="container">

<Routes>
<Route path="/" element={<Dashboard />} />
<Route path="/contracts" element={<Contracts />} />
<Route path="/admin" element={<Admin />} />
</Routes>

</div>
</>
)

}