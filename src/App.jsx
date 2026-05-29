import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { db } from './services/firebase/firebase'

import {
  doc,
  getDoc
} from 'firebase/firestore'

import Sidebar from './components/layout/Sidebar'

import Dashboard from './pages/Dashboard'
import Contracts from './pages/Contracts'
import Team from './pages/Team'
import Members from './pages/Members'
import Admin from './pages/Admin'
import Liders from './pages/Liders'
import Statistics from './pages/Statistics'
import Gallery from './pages/Gallery'

import './styles/global.css'
import './styles/sidebar.css'
import './styles/topbar.css'
import './styles/dashboard.css'
import './styles/team.css'
import './styles/contracts.css'
import './styles/liders.css'
import './styles/admin.css'
import './styles/statistics.css'
import './styles/animations.css'
import './styles/responsive.css'
import './styles/gallery.css'

export default function App(){

  const isAuth =
    !!localStorage.getItem(
      'discord_token'
    )

  const [isAdmin,setIsAdmin] =
    useState(false)

  // Discord OAuth

  // Discord OAuth

useEffect(()=>{

  const hash = window.location.hash

  if(hash.includes('access_token')){

    const params =
      new URLSearchParams(
        hash.replace('#','')
      )

    const token =
      params.get('access_token')

    if(token){

      localStorage.setItem(
        'discord_token',
        token
      )

      fetch(
        'https://discord.com/api/users/@me',
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )
      .then(res=>res.json())
      .then(data=>{

        localStorage.setItem(
          'discord_user',
          JSON.stringify(data)
        )

        window.location.href='/'

      })

    }

  }

},[])


// Admin Check

useEffect(()=>{

  async function checkAdmin(){

    try{

      const discordUser = JSON.parse(
        localStorage.getItem(
          'discord_user'
        )
      )

      if(!discordUser?.id) return

      const adminRef = doc(
        db,
        'admins',
        discordUser.id
      )

      const adminSnap =
        await getDoc(adminRef)

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

      {

        isAuth && (

          <Sidebar
            isAdmin={isAdmin}
          />

        )

      }

      <main className="content">

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
            path="/liders"
            element={
              isAuth
                ? <Liders />
                : <Dashboard />
            }
          />

          <Route
            path="/members"
            element={
              isAuth
                ? <Members />
                : <Dashboard />
            }
          />

          <Route
            path="/gallery"
            element={
              isAuth
                ? <Gallery />
                : <Dashboard />
            }
          />

          <Route
            path="/statistics"
            element={
              isAuth
                ? <Statistics />
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
