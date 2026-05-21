import { Routes, Route, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Dashboard from './pages/Dashboard'
import Contracts from './pages/Contracts'
import Team from './pages/Team'

export default function App(){
  return(
    <>
      <div className="bg"></div>
      <div className="overlay"></div>

      <motion.nav
        initial={{y:-80,opacity:0}}
        animate={{y:0,opacity:1}}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center p-5">

          <h1 className="text-4xl font-black text-red-500 heroGlow">
            GRIZZLY
          </h1>

          <div className="flex gap-4">
            <Link className="px-5 py-3 rounded-2xl bg-zinc-900/70 hover:bg-red-500 transition-all duration-300" to="/">Dashboard</Link>
            <Link className="px-5 py-3 rounded-2xl bg-zinc-900/70 hover:bg-red-500 transition-all duration-300" to="/contracts">Contracts</Link>
            <Link className="px-5 py-3 rounded-2xl bg-zinc-900/70 hover:bg-red-500 transition-all duration-300" to="/team">Team</Link>
          </div>

        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 pt-32 pb-12">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </div>
    </>
  )
}