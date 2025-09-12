export default function ResourceList({ items }) {
  return (
    <div className="space-y-3">
      {items.map((r, idx) => (
        <div key={idx} className="rounded-xl border border-white/20 p-3 flex items-center justify-between">
          <div className="font-medium text-white/90">
            {r.title || r.name}
            {r.desc && <div className="text-sm text-white/60">{r.desc}</div>}
          </div>
          <div className="flex gap-2">
            {r.pdf && <a href={r.pdf} target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm btn-glow">PDF</a>}
            {r.notes && <a href={r.notes} target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-slate-600 hover:bg-slate-700 text-white text-sm">Notes</a>}
            {r.youtube && <a href={r.youtube} target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm">YouTube</a>}
          </div>
        </div>
      ))}
    </div>
  )
}


