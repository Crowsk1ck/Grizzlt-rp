import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'

import Layout from './components/layout/Layout'
import Topbar from './components/layout/Topbar'

import Dashboard from './pages/Dashboard'
import Team from './pages/Team'
import Contracts from './pages/Contracts'
import Stats from './pages/Stats'
import Gallery from './pages/Gallery'
import Settings from './pages/Settings'

export default function App(){

  return(
    <BrowserRouter>

      <AuthProvider>

        <Layout>

          <div className="main-page">

            <Topbar />

            <Routes>

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/team"
                element={<Team />}
              />

              <Route
                path="/contracts"
                element={<Contracts />}
              />

              <Route
                path="/stats"
                element={<Stats />}
              />

              <Route
                path="/gallery"
                element={<Gallery />}
              />

              <Route
                path="/settings"
                element={<Settings />}
              />

            </Routes>

          </div>

        </Layout>

      </AuthProvider>

    </BrowserRouter>
  )
}