import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Territory from './pages/Territory'
import Leaderboard from './pages/Leaderboard'
import Admin from './pages/Admin'
import Navbar from './components/Navbar'

export default function App(){
  return(
    <>
      <div className="bg"></div>

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/territory" element={<Territory />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </>
  )
}