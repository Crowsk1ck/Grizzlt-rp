import { Routes, Route } from 'react-router-dom'

import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'

import Dashboard from './pages/Dashboard'
import Contracts from './pages/Contracts'
import Team from './pages/Team'
import Gallery from './pages/Gallery'
import Apply from './pages/Apply'
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
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  )
}