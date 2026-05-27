import { Routes, Route, Navigate } from 'react-router-dom'

import { useEffect, useState } from 'react'

import {
  db,
  doc,
  getDoc
} from './services/firebase/firebase'

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

  const [isAdmin,setIsAdmin] = useState(false)

  useEffect(()=>{

    async function checkAdmin(){

      try{

        const discordUser = JSON.parse(
          localStorage.getItem('discord_user')
        )

        if(!discordUser?.id) return

        const adminRef = doc(
          db,
          'admins',
          discordUser.id
        )

        const adminSnap = await getDoc(adminRef)

        setIsAdmin(
          adminSnap.exists()
        )

      }catch(error){

        console.log(error)
      }
    }

    if(isAuth){
      checkAdmin()
    }

  },[isAuth])

  return(
    <div className="app">

      {isAuth && (
        <Sidebar isAdmin={isAdmin} />
      )}

      <main className="content">

        <Topbar />

        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/contracts"
            element={
              isAuth
              ? <Contracts />
              : <Dashboard />
            }
          />

          <Route
            path="/team"
            element={
              isAuth
              ? <Team />
              : <Dashboard />
            }
          />

          <Route
            path="/wars"
            element={
              isAuth
              ? <Wars />
              : <Dashboard />
            }
          />

          <Route
            path="/economy"
            element={
              isAuth
              ? <Economy />
              : <Dashboard />
            }
          />

          <Route
            path="/admin"
            element={
              isAdmin
              ? <Admin />
              : <Navigate to="/" />
            }
          />

        </Routes>

      </main>

    </div>
  )
}