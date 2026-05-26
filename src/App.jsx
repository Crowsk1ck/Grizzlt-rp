import { NavLink, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'

const LOGIN_URL =
'https://discord.com/oauth2/authorize?client_id=1508833507894624399&response_type=token&redirect_uri=https%3A%2F%2Fwww.grizzly-family.online&scope=identify'

function Page({title,text}){
  return (
    <div className="card">
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  )
}

export default function App(){

  const [user,setUser] = useState(null)

  useEffect(()=>{

    const hash = window.location.hash

    if(hash.includes('access_token')){

      const params = new URLSearchParams(
        hash.replace('#','')
      )

      const token = params.get('access_token')

      localStorage.setItem(
        'discord_token',
        token
      )

      window.location.hash=''

      fetchUser(token)
    }

    const savedToken = localStorage.getItem(
      'discord_token'
    )

    if(savedToken){
      fetchUser(savedToken)
    }

  },[])

  async function fetchUser(token){

    try{

      const response = await fetch(
        'https://discord.com/api/users/@me',
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      setUser(data)

    }catch(error){
      console.error(error)
    }
  }

  function logout(){

    localStorage.removeItem('discord_token')

    window.location.reload()
  }

  return (
    <div className="layout">

      <aside className="sidebar">

        <div className="logo">
          <h1>GRIZZLY</h1>
          <span>FAMILY</span>
        </div>

        <nav className="nav">
          <NavLink to="/">Главная</NavLink>
          <NavLink to="/team">Команда</NavLink>
          <NavLink to="/contracts">Контракты</NavLink>
          <NavLink to="/stats">Статистика</NavLink>
          <NavLink to="/gallery">Галерея</NavLink>
          <NavLink to="/settings">Настройки</NavLink>
        </nav>

      </aside>

      <main className="content">

        <div className="topbar">

          <h2>GRIZZLY RP DASHBOARD</h2>

          {
            user ? (
              <div className="user-box">

                <img
                  className="avatar"
                  src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                />

                <span>{user.username}</span>

                <button
                  className="logout-btn"
                  onClick={logout}
                >
                  ВЫЙТИ
                </button>

              </div>
            ) : (
              <a
                className="login"
                href={LOGIN_URL}
              >
                ВОЙТИ DISCORD
              </a>
            )
          }

        </div>

        <Routes>
          <Route path="/" element={<Page title="Главная" text="Premium GTA RP dashboard." />} />
          <Route path="/team" element={<Page title="Команда" text="Участники семьи." />} />
          <Route path="/contracts" element={<Page title="Контракты" text="Система контрактов." />} />
          <Route path="/stats" element={<Page title="Статистика" text="Финансовая аналитика." />} />
          <Route path="/gallery" element={<Page title="Галерея" text="Медиа семьи." />} />
          <Route path="/settings" element={<Page title="Настройки" text="Настройки аккаунта." />} />
        </Routes>

      </main>

    </div>
  )
}