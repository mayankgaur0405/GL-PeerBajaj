import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(emailOrUsername, password)
      nav('/dashboard')
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email or Username" value={emailOrUsername} onChange={(e)=>setEmailOrUsername(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded">Login</button>
      </form>
    </div>
  )
}


