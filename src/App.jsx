import { useEffect, useMemo, useRef, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

export default function App(){

const [loading,setLoading] = useState(true)
const [user,setUser] = useState(null)
const audioRef = useRef(null)

useEffect(()=>{
setTimeout(()=>setLoading(false),3000)
},[])

useEffect(()=>{
const token = new URLSearchParams(window.location.hash.substring(1)).get('access_token')

if(token){
fetch('https://discord.com/api/users/@me',{
headers:{authorization:`Bearer ${token}`}
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

useEffect(()=>{
if(!loading){
audioRef.current?.play().catch(()=>{})
}
},[loading])

const particles = useMemo(()=>{
return [...Array(45)].map((_,i)=>({
left:Math.random()*100,
duration:5+Math.random()*8,
delay:Math.random()*5
}))
},[])

if(loading){
return(
<div className="loading">
<h1>GRIZZLY</h1>
<div className="loadingBar">
<div className="loadingProgress"></div>
</div>
</div>
)
}

if(!user){
return(
<>
<video className="bgvideo" autoPlay muted loop playsInline>
<source src="/assets/media/background.mp4" type="video/mp4"/>
</video>

<div className="overlay"></div>

<div className="authOverlay">
<div className="authBox">
<h1 style={{fontSize:'82px',color:'#ff004c'}}>GRIZZLY</h1>

<p style={{fontSize:'22px',color:'#d0d0d0',lineHeight:'1.8'}}>
Premium GTA 6 RP ecosystem with cinematic atmosphere.
</p>

<a
className="loginBtn"
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
<div className="smoke"></div>

<div className="particles">
{particles.map((p,i)=>(
<div
key={i}
className="particle"
style={{
left:p.left+'%',
animationDuration:p.duration+'s',
animationDelay:p.delay+'s'
}}
></div>
))}
</div>

<audio autoPlay loop ref={audioRef}>
<source src="/assets/media/music.mp3" type="audio/mp3"/>
</audio>

<nav>
<Link to="/">Dashboard</Link>
<Link to="/">Contracts</Link>
<Link to="/">Team</Link>
<Link to="/">Wars</Link>
<Link to="/">Marketplace</Link>
<Link to="/">Garage</Link>
</nav>

<div className="profile">
<img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} />
<div>
<div>{user.username}</div>
<button
style={{marginTop:'8px',padding:'8px 14px',background:'#ff004c',border:'none',borderRadius:'12px',color:'white'}}
onClick={()=>{
localStorage.clear()
location.reload()
}}
>
LOGOUT
</button>
</div>
</div>

<button
className="musicBtn"
onClick={()=>{
if(audioRef.current.paused){
audioRef.current.play()
}else{
audioRef.current.pause()
}
}}
>
MUSIC
</button>

<div className="hud">
<div>💰 MONEY: $52,000,000</div>
<div>👥 ONLINE: 147</div>
<div>⚔ WARS: 6</div>
<div>🏆 LEVEL: TOP RP</div>
</div>

<div className="container">
<Routes>
<Route path="/" element={<Dashboard />} />
</Routes>
</div>
</>
)
}