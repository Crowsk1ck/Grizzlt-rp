import { useEffect, useRef, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Contracts from './pages/Contracts'
import Team from './pages/Team'

export default function App(){

  const [isAuth,setIsAuth] = useState(false)

  const audioRef = useRef(null)

  useEffect(()=>{

    const hash = window.location.hash

    if(hash.includes('access_token')){
      localStorage.setItem('discord_auth','true')
      setIsAuth(true)
    }

    const saved = localStorage.getItem('discord_auth')

    if(saved){
      setIsAuth(true)
    }

  },[])

  const discordLogin = () => {

    window.location.href =
    'https://discord.com/oauth2/authorize?client_id=1506029366008610856&response_type=token&redirect_uri=https%3A%2F%2Fwww.grizzly-family.online%2F&scope=identify+email'

  }

  const playMusic = () => {
    audioRef.current.play()
  }

  if(!isAuth){

    return(
      <>
        <video
          className="video-bg"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/assets/background.mp4" type="video/mp4"/>
        </video>

        <div className="overlay"></div>

        <div className="h-screen flex items-center justify-center px-4">

          <div className="glass rounded-[40px] p-12 text-center max-w-xl w-full">

            <h1 className="text-7xl font-black text-red-500 hero mb-6">
              GRIZZLY
            </h1>

            <p className="text-zinc-300 text-xl mb-8">
              Авторизуйтесь через Discord чтобы войти на сайт.
            </p>

            <button
              onClick={discordLogin}
              className="px-8 py-4 rounded-2xl bg-red-500 hover:scale-105 transition text-xl font-bold"
            >
              LOGIN WITH DISCORD
            </button>

          </div>

        </div>
      </>
    )
  }

  return(
    <>
      <video
        className="video-bg"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/assets/background.mp4" type="video/mp4"/>
      </video>

      <div className="overlay"></div>

      <audio ref={audioRef} loop>
        <source src="/assets/music.mp3" type="audio/mp3"/>
      </audio>

      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center p-5 gap-4">

          <h1 className="text-4xl font-black text-red-500 hero">
            GRIZZLY
          </h1>

          <div className="flex flex-wrap gap-3">
            <Link className="px-4 py-2 rounded-2xl bg-zinc-900/70 hover:bg-red-500 transition" to="/">Dashboard</Link>
            <Link className="px-4 py-2 rounded-2xl bg-zinc-900/70 hover:bg-red-500 transition" to="/contracts">Contracts</Link>
            <Link className="px-4 py-2 rounded-2xl bg-zinc-900/70 hover:bg-red-500 transition" to="/team">Team</Link>

            <button
              onClick={playMusic}
              className="px-5 py-2 rounded-2xl bg-red-500 hover:scale-105 transition"
            >
              PLAY MUSIC
            </button>
          </div>

        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-36 pb-12">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </div>
    </>
  )
}