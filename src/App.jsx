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
      <main className="content">
        <Topbar />
        <Dashboard />
        <Contracts />
        <Team />
        <Admin />
      </main>
    </div>
  )
}