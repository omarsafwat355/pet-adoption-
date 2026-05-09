import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({children})=>{

  const [user,setUser] = useState(()=>{
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (data)=>{
    localStorage.setItem('token', data.token)
    const userData = { email: data.email, role: data.role }
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = ()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return(
    <AuthContext.Provider value={{user,login,logout}}>
      {children}
    </AuthContext.Provider>
  )
}