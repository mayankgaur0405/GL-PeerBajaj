import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'
import { useUnreadCount } from '../context/UnreadCountContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import Notifications from './Notifications.jsx'
import NotificationDropdown from './NotificationDropdown.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { socket } = useSocket()
  const { theme, toggleTheme } = useTheme()
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
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <img 
            src="/logo.png" 
            alt="GL PeerBajaj" 
            className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
          />
        </Link>
        
        <nav className="flex items-center gap-6 text-white">
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

          {user ? (
            <>
              <NavLink 
                to="/feed" 
                className={({ isActive }) => 
                  `flex items-center space-x-1 transition-base ${isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <span>Feed</span>
              </NavLink>

              <NavLink 
                to="/editor/demo" 
                className={({ isActive }) => 
                  `flex items-center space-x-1 transition-base ${isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}`
                }
                title="Collaborative Code Editor"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                </svg>
                <span>Code Editor</span>
              </NavLink>

              <NavLink 
                to="/trending" 
                className={({ isActive }) => 
                  `flex items-center space-x-1 transition-base ${isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Trending</span>
              </NavLink>

              <NavLink 
                to="/team" 
                className={({ isActive }) => 
                  `flex items-center space-x-1 transition-base ${isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Team</span>
              </NavLink>

              <NavLink 
                to="/guide" 
                className={({ isActive }) => 
                  `flex items-center space-x-1 transition-base group relative ${isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}`
                }
                title="How the site works"
                aria-label="User Guide - Learn how to use the platform"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Guide</span>
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                  How the site works
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </NavLink>

              <Link 
                to="/chat" 
                className="relative flex items-center space-x-1 text-white/80 hover:text-blue-400 transition-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Messages</span>
                {messageCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {messageCount > 9 ? '9+' : messageCount}
                  </span>
                )}
              </Link>

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

              <NavLink 
                to={`/profile/${user._id}`} 
                className={({ isActive }) => 
                  `flex items-center space-x-1 transition-base ${isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Profile</span>
              </NavLink>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm transition-base"
                  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>
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
              </div>
            </>
          ) : (
            <>
              <NavLink 
                to="/editor/demo" 
                className={({ isActive }) => isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}
              >Code Editor</NavLink>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}>Login</NavLink>
              <NavLink to="/signup" className={({ isActive }) => isActive ? 'text-blue-400' : 'text-white/80 hover:text-blue-400'}>Signup</NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Notifications Modal */}
      <Notifications 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </header>
  )
}


