export default function TrendingResourceCard({ item }) {
  const type = item.pdf ? 'PDF' : item.youtube ? 'YouTube' : item.notes ? 'Notes' : ''
  
  // Mock engagement data
  const views = Math.floor(Math.random() * 1000) + 100
  const downloads = Math.floor(Math.random() * 200) + 20
  const saves = Math.floor(Math.random() * 150) + 10
  
  return (
    <div className="glass-card p-4 hover-glow hover-raise">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-white font-semibold truncate">{item.title}</h4>
          <p className="text-white/60 text-sm mt-1">{type}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-white font-bold text-lg">{views}</div>
          <div className="text-white/60 text-xs">views</div>
        </div>
      </div>
      
      {/* Engagement metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="flex justify-between">
          <span className="text-white/60">Downloads:</span>
          <span className="text-white font-medium">{downloads}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Saves:</span>
          <span className="text-white font-medium">{saves}</span>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-2">
        {(item.pdf || item.youtube || item.notes) && (
          <a href={item.pdf || item.youtube || item.notes} target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm btn-glow">View</a>
        )}
        <button className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm">Save</button>
      </div>
    </div>
  )
}


