export default function LeaderboardCard({ user, index }) {
  const rankColors = ['from-blue-600 to-purple-600', 'from-emerald-600 to-teal-600', 'from-amber-600 to-orange-600']
  const gradient = rankColors[index] || 'from-slate-700 to-slate-800'
  const pct = Math.min(100, Math.round((user.contributions / (user.max || 150)) * 100))
  return (
    <div className="glass-card p-4 transition transform hover:scale-[1.01] hover:shadow-xl">
      <div className="flex items-center gap-3">
        <img src={user.avatar || '/default-avatar.png'} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-semibold truncate">{user.name}</h4>
            <span className="text-white/70 text-sm">{user.contributions}</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${gradient}`} style={{ width: pct + '%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}


