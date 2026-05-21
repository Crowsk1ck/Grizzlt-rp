import { useRef } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Contracts from './pages/Contracts'
import Team from './pages/Team'
import Leaderboard from './pages/Leaderboard'
import Marketplace from './pages/Marketplace'
import Garage from './pages/Garage'

export default function App(){

  const audioRef = useRef(null)

  const playMusic = () => {
    audioRef.current.play()
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
            <Link className="px-4 py-2 rounded-2xl bg-zinc-900/70 hover:bg-red-500 transition" to="/leaderboard">Top</Link>
            <Link className="px-4 py-2 rounded-2xl bg-zinc-900/70 hover:bg-red-500 transition" to="/marketplace">Market</Link>
            <Link className="px-4 py-2 rounded-2xl bg-zinc-900/70 hover:bg-red-500 transition" to="/garage">Garage</Link>

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
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/garage" element={<Garage />} />
        </Routes>
      </div>
    </>
  )
}