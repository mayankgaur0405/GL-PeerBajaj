import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">GL PeerBajaj</Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Home</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Dashboard</NavLink>
              <button onClick={logout} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Login</NavLink>
              <NavLink to="/signup" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Signup</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}


