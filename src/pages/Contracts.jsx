import { motion } from 'framer-motion'

const contracts = [
  'Bank Heist',
  'Weapon Smuggling',
  'Territory Control',
  'Secret VIP Delivery'
]

export default function Contracts(){
  return(
    <>
      <h1 className="text-6xl font-black text-red-500 heroGlow mb-10">
        CONTRACTS
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {contracts.map((contract,index)=>(
          <motion.div
            key={index}
            whileHover={{scale:1.03}}
            className="glass rounded-[32px] p-8"
          >
            <h2 className="text-3xl font-black mb-4">
              {contract}
            </h2>

            <div className="bg-black/40 rounded-2xl p-4">
              ACTIVE MISSION
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}