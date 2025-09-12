export default function TrendingResourceCard({ item }) {
  const type = item.pdf ? 'PDF' : item.youtube ? 'YouTube' : item.notes ? 'Notes' : ''
  return (
    <div className="glass-card p-4 transition transform hover:scale-[1.01] hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-white font-semibold truncate">{item.title}</h4>
          <p className="text-white/60 text-sm mt-1">{type}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        {(item.pdf || item.youtube || item.notes) && (
          <a href={item.pdf || item.youtube || item.notes} target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm btn-glow">View</a>
        )}
        <button className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-sm">Save</button>
      </div>
    </div>
  )
}


