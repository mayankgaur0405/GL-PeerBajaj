import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'
import { useUnreadCount } from '../context/UnreadCountContext.jsx'
import Notifications from './Notifications.jsx'
import NotificationDropdown from './NotificationDropdown.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { socket } = useSocket()
  const { notificationCount, messageCount, incrementNotificationCount, incrementMessageCount, updateNotificationCount } = useUnreadCount()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false)

  useEffect(() => {
    if (socket) {
      socket.on('new_notification', () => {
        incrementNotificationCount()
      })

      socket.on('new_message', () => {
        incrementMessageCount()
      })

      return () => {
        socket.off('new_notification')
        socket.off('new_message')
      }
    }
  }, [socket, incrementNotificationCount, incrementMessageCount])

  return (
    <header className="backdrop-blur bg-slate-900/70 border-b border-white/10 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between relative">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center group">
          <img 
            src="/logo.png" 
            alt="GL PeerBajaj" 
            className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
          />
        </Link>

        {/* Center: Main navigation */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 text-white">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center space-x-1 transition-base ${isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}`
            }
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </NavLink>

          

          <NavLink 
            to="/sitemap" 
            className={({ isActive }) => 
              `flex items-center space-x-1 transition-base ${isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}`
            }
            title="All links"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>All</span>
          </NavLink>

          {user && (
            <div className="relative">
              <button
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className="relative flex items-center space-x-1 text-white/80 hover:text-blue-400 transition-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 7h6V5H4v2zM4 13h6v-2H4v2z" />
                </svg>
                <span>Notifications</span>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
              
              <NotificationDropdown 
                isOpen={showNotificationDropdown}
                onClose={() => setShowNotificationDropdown(false)}
                onUnreadCountChange={updateNotificationCount}
              />
            </div>
          )}
        </nav>

        {/* Right: Auth controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to={`/profile/${user._id}`} className="flex items-center space-x-2">
                <img 
                  src={user.profilePicture || '/default-avatar.svg'} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-white/90">{user.name}</span>
              </Link>
              <button 
                onClick={logout} 
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm transition-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}>Login</NavLink>
              <NavLink to="/signup" className={({ isActive }) => isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}>Signup</NavLink>
            </>
          )}
        </div>
      </div>

      {/* Notifications Modal */}
      <Notifications 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </header>
  )
}


