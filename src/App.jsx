import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import Home from './pages/Home'
import Team from './pages/Team'
import Gallery from './pages/Gallery'
import Contracts from './pages/Contracts'
import Apply from './pages/Apply'

export default function App(){

const [user,setUser] = useState(null)
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
</>
)
}

return(
<>
<video className="bgvideo" autoPlay muted loop playsInline>
<source src="/assets/media/background.mp4" type="video/mp4"/>
</video>

<div className="overlay"></div>

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
<Link to="/">Інфо</Link>
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
</Routes>

</div>
</>
)
}