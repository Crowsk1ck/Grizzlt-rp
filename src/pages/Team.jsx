import { motion } from 'framer-motion'

const members = [
  'OWNER',
  'DEPUTY',
  'MAIN FIGHTER',
  'CONTRACT MANAGER'
]

export default function Team(){
  return(
    <>
      <h1 className="text-6xl font-black text-red-500 heroGlow mb-10">
        TEAM
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

        {members.map((member,index)=>(
          <motion.div
            key={index}
            whileHover={{y:-10}}
            className="glass rounded-[32px] p-8 text-center"
          >
            <div className="w-32 h-32 rounded-full bg-red-500/20 mx-auto mb-6 border border-red-500/20"></div>

            <h2 className="text-2xl font-black">
              {member}
            </h2>

            <div className="text-zinc-400 mt-2">
              GRIZZLY FAMILY
            </div>
          </motion.div>
        ))}

      </div>
    </>
  )
}