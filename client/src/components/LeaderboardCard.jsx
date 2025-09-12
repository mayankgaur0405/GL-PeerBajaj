export default function LeaderboardCard({ user, index }) {
  const rankColors = ['from-blue-600 to-purple-600', 'from-emerald-600 to-teal-600', 'from-amber-600 to-orange-600']
  const gradient = rankColors[index] || 'from-slate-700 to-slate-800'
  const pct = Math.min(100, Math.round((user.contributions / (user.max || 150)) * 100))
  
  // Calculate breakdown of contributions (mock data for now)
  const posts = Math.floor(user.contributions * 0.4) || 0
  const comments = Math.floor(user.contributions * 0.3) || 0
  const likes = Math.floor(user.contributions * 0.2) || 0
  const shares = Math.floor(user.contributions * 0.1) || 0
  
  return (
    <div className="glass-card p-4 transition transform hover:scale-[1.01] hover:shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img 
            src={user.avatar || '/default-avatar.png'} 
            alt={user.name} 
            className="w-12 h-12 rounded-full object-cover flex-shrink-0" 
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-white font-semibold truncate">{user.name}</h4>
            <p className="text-white/60 text-sm truncate">@{user.username || user.name.toLowerCase()}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-white font-bold text-lg">{user.contributions}</div>
          <div className="text-white/60 text-xs">total</div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-white/10 rounded-full mb-3 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${gradient}`} style={{ width: pct + '%' }} />
      </div>
      
      {/* Contribution breakdown */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex justify-between">
          <span className="text-white/60">Posts:</span>
          <span className="text-white font-medium">{posts}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Comments:</span>
          <span className="text-white font-medium">{comments}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Likes:</span>
          <span className="text-white font-medium">{likes}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Shares:</span>
          <span className="text-white font-medium">{shares}</span>
        </div>
      </div>
      
      {/* Role/Description */}
      {user.role && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-white/70 text-xs">{user.role}</p>
        </div>
      )}
    </div>
  )
}


