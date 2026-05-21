import { useRef } from 'react'
import { motion } from 'framer-motion'

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
        <div className="max-w-7xl mx-auto flex justify-between items-center p-5">

          <h1 className="text-4xl font-black text-red-500 hero">
            GRIZZLY
          </h1>

          <button
            onClick={playMusic}
            className="px-6 py-3 rounded-2xl bg-red-500 hover:scale-105 transition"
          >
            PLAY MUSIC
          </button>

        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-36 pb-10">

        <motion.h1
          initial={{opacity:0,y:40}}
          animate={{opacity:1,y:0}}
          className="text-8xl font-black text-red-500 hero mb-6"
        >
          GTA 6 RP
        </motion.h1>

        <p className="text-2xl text-zinc-300 mb-12 max-w-3xl">
          Cinematic premium RP ecosystem with modern gaming atmosphere.
        </p>

        <div className="grid lg:grid-cols-4 gap-6 mb-10">

          <div className="glass rounded-[32px] p-6">
            <div className="text-zinc-400 mb-2">
              ONLINE
            </div>

            <div className="text-5xl font-black text-red-500">
              147
            </div>
          </div>

          <div className="glass rounded-[32px] p-6">
            <div className="text-zinc-400 mb-2">
              FAMILY BALANCE
            </div>

            <div className="text-4xl font-black text-red-500">
              $52M
            </div>
          </div>

          <div className="glass rounded-[32px] p-6">
            <div className="text-zinc-400 mb-2">
              ACTIVE WARS
            </div>

            <div className="text-5xl font-black text-red-500">
              6
            </div>
          </div>

          <div className="glass rounded-[32px] p-6">
            <div className="text-zinc-400 mb-2">
              GLOBAL RANK
            </div>

            <div className="text-4xl font-black text-red-500">
              TOP 3
            </div>
          </div>

        </div>

      </div>
    </>
  )
}