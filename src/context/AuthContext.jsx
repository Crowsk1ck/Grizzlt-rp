import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }){

  const [user,setUser] = useState(null)

  function logout(){
    setUser(null)
    localStorage.removeItem('grizzly_user')
  }

  return(
    <AuthContext.Provider
      value={{
        user,
        setUser,
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