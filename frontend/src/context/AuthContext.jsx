import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({children})=>{

  const [user,setUser] = useState(()=>{
    const saved = sessionStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (data)=>{
    sessionStorage.setItem('token', data.token)
    const userData = { email: data.email, role: data.role }
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = ()=>{
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setUser(null)
  }

  return(
    <AuthContext.Provider value={{user,login,logout}}>
      {children}
    </AuthContext.Provider>
  )
}