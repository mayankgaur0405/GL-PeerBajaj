import { Link, useNavigate } from 'react-router-dom'

export default function ProfileCard({ user, compact = false }) {
  const navigate = useNavigate()
  
  if (compact) {
    return (
      <div
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        onClick={() => navigate(`/profile/${user._id}`)}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-slate-900 dark:text-white truncate">{user.name}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300 truncate">@{user.username}</div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{user.year || '-'}yr</div>
      </div>
    )
  }
  
  return (
    <div
      className="bg-white/80 backdrop-blur rounded-xl shadow hover:shadow-lg transition-shadow p-4 flex flex-col cursor-pointer"
      onClick={() => navigate(`/profile/${user._id}`)}
    >
      {/* Top Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-gray-600">@{user.username}</p>
        </div>
        <span className="text-sm text-gray-500">{user.year || '-'} year</span>
      </div>

      {/* Bio */}
      {user.bio && <p className="mt-2 text-gray-700 line-clamp-3">{user.bio}</p>}

      {/* Department / Specialization */}
      <div className="mt-3 text-sm text-gray-500">
        {user.department} • {user.specialization}
      </div>

      {/* Sections feature removed */}

      {/* View Profile Button */}
      <Link
        to={`/profile/${user._id}`}
        onClick={(e) => e.stopPropagation()}
        className="mt-4 px-3 py-2 rounded bg-blue-600 text-white text-center hover:bg-blue-700 transition-colors"
      >
        View Profile
      </Link>
    </div>
  )
}
