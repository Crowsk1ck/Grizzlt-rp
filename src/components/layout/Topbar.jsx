import { useEffect, useState } from 'react'

import '../../styles/topbar.css'

const LOGIN_URL =
'https://discord.com/oauth2/authorize?client_id=1508833507894624399&response_type=token&redirect_uri=https%3A%2F%2Fwww.grizzly-family.online%2F&scope=identify'

export default function Topbar(){

  const [user,setUser] = useState(null)

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

      window.location.href='/'
    }

    const token =
      localStorage.getItem(
        'discord_token'
      )

    if(token){

      fetch(
        'https://discord.com/api/users/@me',
        {
          headers:{
            Authorization:`Bearer ${token}`
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

      <div className="topbar-title">

        <div className="topbar-badge">
          GRIZZLY FAMILY
        </div>

        <h1>
          PREMIUM CONTROL PANEL
        </h1>

        <p>
          Premium Cyberpunk GTA RP Platform
        </p>

      </div>

      <div className="topbar-actions">

        {
          user ? (

            <button
              className="logout-btn"
              onClick={logout}
            >
              ВИЙТИ
            </button>

          ) : (

            <a
              href={LOGIN_URL}
              className="discord-login-btn"
            >

              <div className="discord-glow"></div>

              <span>
                LOGIN WITH DISCORD
              </span>

            </a>

          )
        }

      </div>

    </header>

  )

}
