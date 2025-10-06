import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useEffect } from 'react'

export default function LeftRail() {
  const { user } = useAuth()
  useEffect(() => {}, [])

  const navItem = (to, icon, label) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition-base ${
          isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'
        }`
      }
    >
      <span className="w-5 h-5 inline-flex items-center justify-center">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  )

  return (
    <aside className="hidden lg:block sticky top-16 self-start" style={{ width: 180 }}>
      <div className="space-y-2 mb-4">
        {navItem('/', '🏠', 'Home')}
        {navItem('/sitemap', '🗂️', 'All')}
        {navItem('/feed', '📱', 'Feed')}
        {navItem('/chat', '💬', 'Messages')}
        {navItem('/trending', '🔥', 'Trending')}
        {navItem('/guide', '📖', 'Guide')}
        {user && (
          <Link
            to={`/profile/${user._id}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-base text-white/80 hover:text-white hover:bg-white/5"
          >
            <img
              src={user.profilePicture || '/default-avatar.svg'}
              alt={user.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-sm font-medium">Profile</span>
          </Link>
        )}
      </div>

      {/* Content moved to main feed header row */}
    </aside>
  )
}



