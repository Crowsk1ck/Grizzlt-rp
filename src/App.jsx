import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Contracts from './pages/Contracts'
import Team from './pages/Team'

export default function App(){
  return(
    <>
      <div className="bg"></div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-red-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">

          <h1 className="text-3xl font-black text-red-500">
            GRIZZLY RP
          </h1>

          <div className="flex gap-3">
            <Link className="bg-zinc-900 px-4 py-2 rounded-xl" to="/">Dashboard</Link>
            <Link className="bg-zinc-900 px-4 py-2 rounded-xl" to="/contracts">Contracts</Link>
            <Link className="bg-zinc-900 px-4 py-2 rounded-xl" to="/team">Team</Link>
          </div>

        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </div>
    </>
  )
}