import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Home from './pages/Home'

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        <Topbar />
        <Home />
      </main>
    </div>
  )
}