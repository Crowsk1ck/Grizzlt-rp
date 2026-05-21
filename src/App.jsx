import { useEffect, useRef, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

export default function App(){

  const [loading,setLoading] = useState(true)
  const audioRef = useRef(null)

  useEffect(()=>{
    setTimeout(()=>{
      setLoading(false)
    },3000)
  },[])

  const playMusic = ()=>{
    audioRef.current.play()
  }

  if(loading){
    return(
      <div className="loading-screen">
        <h1 className="text-7xl font-black text-red-500 hero">
          GRIZZLY
        </h1>

        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
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
      <div className="smoke"></div>

      <div className="particles">
        {[...Array(40)].map((_,i)=>(
          <div
            key={i}
            className="particle"
            style={{
              left:`${Math.random()*100}%`,
              animationDelay:`${Math.random()*8}s`,
              animationDuration:`${5+Math.random()*8}s`
            }}
          />
        ))}
      </div>

      <audio ref={audioRef} loop>
        <source src="/assets/music.mp3" type="audio/mp3"/>
      </audio>

      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-5 flex-wrap gap-4">

          <h1 className="text-4xl font-black text-red-500 hero">
            GRIZZLY
          </h1>

          <div className="flex flex-wrap gap-3">
            <Link className="px-5 py-2 rounded-2xl glass hover:bg-red-500 transition neon" to="/">Dashboard</Link>

            <button
              onClick={playMusic}
              className="px-5 py-2 rounded-2xl bg-red-500 neon hover:scale-105 transition"
            >
              PLAY MUSIC
            </button>
          </div>

        </div>
      </nav>

      <div className="hud glass rounded-3xl p-4">
        <div>💰 $52,000,000</div>
        <div>👥 ONLINE 147</div>
        <div>⚔ WARS 6</div>
      </div>

      <div className="minimap glass">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"
          style={{width:'100%',height:'100%',objectFit:'cover'}}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-36 pb-10 overflow-y-auto h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  )
}