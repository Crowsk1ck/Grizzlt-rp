import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Topbar from './components/layout/Topbar'
import Dashboard from './pages/Dashboard'

export default function App(){

  return(
    <AuthProvider>

      <Layout>

        <Topbar />

        <Dashboard />

      </Layout>

    </AuthProvider>
  )
}