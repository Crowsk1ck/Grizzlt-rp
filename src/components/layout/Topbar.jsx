import { useEffect, useState } from 'react'

const LOGIN_URL =
'https://discord.com/oauth2/authorize?client_id=1508833507894624399&response_type=token&redirect_uri=https%3A%2F%2Fwww.grizzly-family.online&scope=identify'

export default function Topbar(){

  const [connected,setConnected] =
    useState(false)

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
          GTA RP
        </p>
      </div>

      {
        connected ? (

          <button onClick={logout}>
            Discord Connected
          </button>

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
