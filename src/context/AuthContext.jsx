// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (savedToken) setToken(savedToken)
    if (savedUser) setUser(JSON.parse(savedUser))

    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, setToken, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
