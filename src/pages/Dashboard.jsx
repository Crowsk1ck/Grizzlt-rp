import { motion } from 'framer-motion'

export default function Dashboard(){
  return(
    <>
      <motion.h1
        initial={{opacity:0,y:30}}
        animate={{opacity:1,y:0}}
        className="text-6xl font-black text-red-500 mb-8"
      >
        ENTERPRISE RP SYSTEM
      </motion.h1>

      <div className="grid lg:grid-cols-4 gap-6 mb-10">

        <div className="card">
          👥 Online Players: 147
        </div>

        <div className="card">
          💰 Family Balance: $52,000,000
        </div>

        <div className="card">
          🔫 Active Wars: 6
        </div>

        <div className="card">
          🏆 Global Rank: TOP 3
        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="card">
          <h2 className="text-3xl font-bold mb-4">
            LIVE NOTIFICATIONS
          </h2>

          <div className="space-y-3">
            <div className="bg-black/40 p-3 rounded-xl">
              Territory captured
            </div>

            <div className="bg-black/40 p-3 rounded-xl">
              Contract completed
            </div>

            <div className="bg-black/40 p-3 rounded-xl">
              New donor joined
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-3xl font-bold mb-4">
            WEAPON STATISTICS
          </h2>

          <div className="space-y-3">
            <div>Heavy Sniper — 94%</div>
            <div>Carbine Rifle — 82%</div>
            <div>SMG — 76%</div>
          </div>
        </div>

      </div>
    </>
  )
}