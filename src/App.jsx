import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Dashboard from './pages/Dashboard'
import Contracts from './pages/Contracts'
import Team from './pages/Team'
import Admin from './pages/Admin'

export default function App(){
  return(
    <div className="app">
      <Sidebar />

      <div className="content">
        <Topbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/team" element={<Team />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </div>
  )
}