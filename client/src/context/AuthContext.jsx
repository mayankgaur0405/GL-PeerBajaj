import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/auth/me')
        setUser(res.data.user)
      } catch (_) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const login = async (emailOrUsername, password) => {
    const res = await api.post('/auth/login', { emailOrUsername, password })
    setUser(res.data.user)
    return res
  }

  const signup = async (payload) => {
    const res = await api.post('/auth/register', payload)
    setUser(res.data.user)
    return res
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}


