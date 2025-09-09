import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup() {
  const { signup } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' })
  const [error, setError] = useState('')

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await signup(form)
      nav('/dashboard')
    } catch (e) {
      setError(e.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <h1 className="text-xl font-semibold mb-4">Signup</h1>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Full Name" value={form.name} onChange={(e)=>update('name', e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={form.email} onChange={(e)=>update('email', e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Username" value={form.username} onChange={(e)=>update('username', e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={form.password} onChange={(e)=>update('password', e.target.value)} />
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded">Create account</button>
      </form>
    </div>
  )
}


