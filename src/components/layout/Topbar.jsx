import { useEffect, useState } from 'react'

const LOGIN_URL =
'https://discord.com/oauth2/authorize?client_id=1508833507894624399&response_type=token&redirect_uri=https%3A%2F%2Fwww.grizzly-family.online&scope=identify'

export default function Topbar(){

  const [connected,setConnected] =
    useState(false)

  const [user,setUser] =
    useState(null)

  useEffect(()=>{

    const hash = window.location.hash

    if(hash.includes('access_token')){

      const params = new URLSearchParams(
        hash.replace('#','')
      )

      const token =
        params.get('access_token')

      localStorage.setItem(
        'discord_token',
        token
      )

      window.location.hash=''

      setConnected(true)
    }

    const savedToken =
      localStorage.getItem(
        'discord_token'
      )

    if(savedToken){

      setConnected(true)

      fetch(
        'https://discord.com/api/users/@me',
        {
          headers:{
            Authorization:`Bearer ${savedToken}`
          }
        }
      )
      .then(res=>res.json())
      .then(data=>{
        setUser(data)
      })

    }

  },[])

  function logout(){

    localStorage.removeItem(
      'discord_token'
    )

    window.location.reload()
  }

  return(

    <header className="topbar">

      <div>
        <h1>
          GRIZZLY FAMILY SYSTEM
        </h1>

        <p>
          Premium Cyberpunk GTA RP Platform
        </p>
      </div>

      {
        connected && user ? (

          <div className="topbar-profile">

            <img
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
              alt=""
            />

            <div className="profile-info">

              <span className="nickname">
                {user.username}
              </span>

              <span className="role-badge">
                MEMBER
              </span>

            </div>

            <button
              className="notify-btn"
              onClick={logout}
            >
              🔔
            </button>

          </div>

        ) : (

          <a
            href={LOGIN_URL}
            className="login-btn"
          >
            ВОЙТИ DISCORD
          </a>

        )
      }

    </header>
  )
}
