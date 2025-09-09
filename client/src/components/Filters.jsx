export default function Filters({ filters, setFilters, onApply }) {
  const update = (key, value) => setFilters((f) => ({ ...f, [key]: value }))
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <input className="border rounded px-3 py-2" placeholder="Year" value={filters.year || ''} onChange={(e) => update('year', e.target.value)} />
      <input className="border rounded px-3 py-2" placeholder="Department" value={filters.department || ''} onChange={(e) => update('department', e.target.value)} />
      <input className="border rounded px-3 py-2" placeholder="Specialization" value={filters.specialization || ''} onChange={(e) => update('specialization', e.target.value)} />
      <button onClick={onApply} className="px-4 py-2 bg-gray-800 text-white rounded">Apply</button>
    </div>
  )
}


