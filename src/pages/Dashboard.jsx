import { motion } from 'framer-motion'

export default function Dashboard(){
  return(
    <>
      <motion.div
        initial={{opacity:0,y:40}}
        animate={{opacity:1,y:0}}
      >
        <h1 className="text-7xl lg:text-8xl font-black text-red-500 heroGlow mb-6">
          GTA 6 RP
        </h1>

        <p className="text-zinc-300 text-2xl mb-10 max-w-3xl">
          Premium cinematic family dashboard with modern gaming UI,
          contracts system, live activity and GTA RP ecosystem.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6 mb-12">

        <motion.div
          whileHover={{scale:1.04}}
          className="glass rounded-3xl p-6"
        >
          <div className="text-zinc-400 mb-2">
            ONLINE PLAYERS
          </div>

          <div className="text-5xl font-black text-red-500">
            147
          </div>
        </motion.div>

        <motion.div
          whileHover={{scale:1.04}}
          className="glass rounded-3xl p-6"
        >
          <div className="text-zinc-400 mb-2">
            FAMILY BALANCE
          </div>

          <div className="text-4xl font-black text-red-500">
            $52M
          </div>
        </motion.div>

        <motion.div
          whileHover={{scale:1.04}}
          className="glass rounded-3xl p-6"
        >
          <div className="text-zinc-400 mb-2">
            ACTIVE WARS
          </div>

          <div className="text-5xl font-black text-red-500">
            6
          </div>
        </motion.div>

        <motion.div
          whileHover={{scale:1.04}}
          className="glass rounded-3xl p-6"
        >
          <div className="text-zinc-400 mb-2">
            GLOBAL RANK
          </div>

          <div className="text-4xl font-black text-red-500">
            TOP 3
          </div>
        </motion.div>

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        <motion.div
          initial={{opacity:0,x:-40}}
          animate={{opacity:1,x:0}}
          className="glass rounded-[32px] p-8"
        >
          <h2 className="text-4xl font-black mb-6 text-red-500">
            LIVE CONTRACTS
          </h2>

          <div className="space-y-4">

            <div className="bg-black/40 rounded-2xl p-5">
              🔥 Territory Assault
            </div>

            <div className="bg-black/40 rounded-2xl p-5">
              💰 Bank Delivery
            </div>

            <div className="bg-black/40 rounded-2xl p-5">
              ⚔ Gang Elimination
            </div>

          </div>
        </motion.div>

        <motion.div
          initial={{opacity:0,x:40}}
          animate={{opacity:1,x:0}}
          className="glass rounded-[32px] p-8"
        >
          <h2 className="text-4xl font-black mb-6 text-red-500">
            FAMILY ACTIVITY
          </h2>

          <div className="space-y-4">

            <div className="bg-black/40 rounded-2xl p-5">
              New member joined
            </div>

            <div className="bg-black/40 rounded-2xl p-5">
              Contract completed
            </div>

            <div className="bg-black/40 rounded-2xl p-5">
              Territory captured
            </div>

          </div>
        </motion.div>

      </div>
    </>
  )
}