import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }){

  const [user,setUser] = useState(null)

  useEffect(()=>{

    const savedUser = localStorage.getItem('grizzly_user')

    if(savedUser){
      setUser(JSON.parse(savedUser))
    }

    const hash = window.location.hash

    if(hash.includes('access_token')){

      const params = new URLSearchParams(
        hash.replace('#','')
      )

      const token = params.get('access_token')

      if(token){
        fetchDiscordUser(token)
      }
    }

  },[])

  async function fetchDiscordUser(token){

    try{

      const response = await fetch(
        'https://discord.com/api/users/@me',
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      const userData = {
        id:data.id,
        username:data.username,
        avatar:data.avatar,
        token
      }

      localStorage.setItem(
        'grizzly_user',
        JSON.stringify(userData)
      )

      setUser(userData)

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      )

    }catch(error){
      console.error(error)
    }
  }

  function logout(){
    localStorage.removeItem('grizzly_user')
    setUser(null)
    window.location.reload()
  }

  return(
    <AuthContext.Provider
      value={{
        user,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}