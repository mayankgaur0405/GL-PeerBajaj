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
    <div className="max-w-md mx-auto rounded-2xl shadow-xl p-6 bg-white text-slate-900 dark:bg-slate-900/80 dark:text-slate-100 backdrop-blur">
      <h1 className="text-2xl font-bold mb-1">Create your account</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">Join the community</p>
      {error && <div className="mb-3 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-400/10 border border-red-200/70 dark:border-red-400/30 rounded px-3 py-2">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-slate-700 dark:text-slate-200">Full Name</label>
          <input className="w-full rounded-lg px-3 py-2 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-slate-900 dark:text-slate-100 placeholder-slate-400" placeholder="Your name" value={form.name} onChange={(e)=>update('name', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-700 dark:text-slate-200">Email</label>
          <input className="w-full rounded-lg px-3 py-2 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-slate-900 dark:text-slate-100 placeholder-slate-400" type="email" placeholder="you@example.com" value={form.email} onChange={(e)=>update('email', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-700 dark:text-slate-200">Username</label>
          <input className="w-full rounded-lg px-3 py-2 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-slate-900 dark:text-slate-100 placeholder-slate-400" placeholder="username" value={form.username} onChange={(e)=>update('username', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-700 dark:text-slate-200">Password</label>
          <input className="w-full rounded-lg px-3 py-2 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-slate-900 dark:text-slate-100 placeholder-slate-400" type="password" placeholder="••••••••" value={form.password} onChange={(e)=>update('password', e.target.value)} />
        </div>
        <button className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900">Create account</button>
      </form>
    </div>
  )
}


