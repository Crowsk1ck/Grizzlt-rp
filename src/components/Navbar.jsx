import { Link } from 'react-router-dom'

export default function Navbar(){
  return(
    <nav className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-xl border-b border-red-500/20 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">

        <h1 className="text-3xl font-black text-red-500">
          GRIZZLY RP
        </h1>

        <div className="flex gap-3 flex-wrap">
          <Link className="bg-zinc-900 px-4 py-2 rounded-xl" to="/">Dashboard</Link>
          <Link className="bg-zinc-900 px-4 py-2 rounded-xl" to="/inventory">Inventory</Link>
          <Link className="bg-zinc-900 px-4 py-2 rounded-xl" to="/territory">Wars</Link>
          <Link className="bg-zinc-900 px-4 py-2 rounded-xl" to="/leaderboard">Top</Link>
          <Link className="bg-zinc-900 px-4 py-2 rounded-xl" to="/admin">Admin</Link>
        </div>

      </div>
    </nav>
  )
}