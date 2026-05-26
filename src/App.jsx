import { Routes, Route } from 'react-router-dom'

import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'

import Dashboard from './pages/Dashboard'
import Contracts from './pages/Contracts'
import Team from './pages/Team'
import Wars from './pages/Wars'
import Economy from './pages/Economy'
import Admin from './pages/Admin'

export default function App(){
  return(
    <div className="app">
      <Sidebar />

      <main className="content">
        <Topbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/team" element={<Team />} />
          <Route path="/wars" element={<Wars />} />
          <Route path="/economy" element={<Economy />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  )
}