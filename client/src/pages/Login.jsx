import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { validateGLBITMEmail, isGLBITMEmail } from '../utils/emailValidation.js'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleEmailOrUsernameChange = (value) => {
    setEmailOrUsername(value)
    setEmailError('')
    
    // Only validate if it looks like an email (contains @)
    if (value.includes('@')) {
      const validation = validateGLBITMEmail(value)
      if (!validation.isValid) {
        setEmailError(validation.message)
      }
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setEmailError('')
    
    // If input looks like an email, validate it
    if (emailOrUsername.includes('@')) {
      const emailValidation = validateGLBITMEmail(emailOrUsername)
      if (!emailValidation.isValid) {
        setEmailError(emailValidation.message)
        return
      }
    }
    
    try {
      await login(emailOrUsername, password)
      nav('/')
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto rounded-2xl shadow-xl p-6 bg-white text-slate-900 dark:bg-slate-900/80 dark:text-slate-100 backdrop-blur">
      <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">Sign in to your account</p>
      {error && <div className="mb-3 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-400/10 border border-red-200/70 dark:border-red-400/30 rounded px-3 py-2">{error}</div>}
      
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-slate-700 dark:text-slate-200">Email or Username</label>
          <input 
            className={`w-full rounded-lg px-3 py-2 bg-white dark:bg-slate-800/80 border focus:outline-none focus:ring-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 ${
              emailError 
                ? 'border-red-300 dark:border-red-500 focus:ring-red-500/60' 
                : 'border-slate-300 dark:border-white/10 focus:ring-blue-500/60'
            }`}
            placeholder="your.email@example.com or username" 
            value={emailOrUsername} 
            onChange={(e)=>handleEmailOrUsernameChange(e.target.value)} 
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm mb-1 text-slate-700 dark:text-slate-200">Password</label>
          <div className="relative">
            <input 
              className="w-full rounded-lg px-3 py-2 pr-12 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-slate-900 dark:text-slate-100 placeholder-slate-400" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={password} 
              onChange={(e)=>setPassword(e.target.value)} 
            />
            {password && (
              <button 
                type="button" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
        
        <button className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900">
          Login
        </button>
      </form>
    </div>
  )
}