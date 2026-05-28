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

      {
        user ? (

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
              className="logout-btn"
              onClick={logout}
            >
              ВИЙТИ
            </button>

          </div>

        ) : (

          <a
            href={LOGIN_URL}
            className="discord-login-btn"
          >

            <div className="discord-glow"></div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.191.328-.403.77-.552 1.117a18.27 18.27 0 0 0-5.668 0A11.654 11.654 0 0 0 9.11 3a19.736 19.736 0 0 0-4.435 1.371C1.533 9.128.683 13.77 1.106 18.347a19.9 19.9 0 0 0 5.993 3.029c.483-.663.913-1.365 1.287-2.104a12.92 12.92 0 0 1-2.024-.977c.17-.125.336-.256.496-.39 3.905 1.824 8.144 1.824 12.002 0 .162.135.328.266.497.39-.646.377-1.325.705-2.026.978.373.738.803 1.44 1.287 2.102a19.87 19.87 0 0 0 5.996-3.03c.496-5.3-.84-9.902-4.297-13.976ZM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.956 2.419-2.157 2.419Zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.947 2.419-2.157 2.419Z"/>
            </svg>

            <span>
              LOGIN WITH DISCORD
            </span>

          </a>

        )
      }

    </header>

  )

}
