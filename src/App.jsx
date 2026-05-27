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

  const isAuth =
    !!localStorage.getItem(
      'discord_token'
    )

  return(
    <div className="app">
      {isAuth && <Sidebar />}

      <main className="content">
        <Topbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contracts" element={isAuth ? <Contracts /> : <Dashboard />} />
          <Route path="/team" element={isAuth ? <Team /> : <Dashboard />} />
          <Route path="/wars" element={isAuth ? <Wars /> : <Dashboard />} />
          <Route path="/economy" element={isAuth ? <Economy /> : <Dashboard />} />
          <Route path="/admin" element={isAuth ? <Admin /> : <Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}