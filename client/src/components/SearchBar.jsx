export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by username"
        className="flex-1 border rounded px-3 py-2"
      />
      <button onClick={onSearch} className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
    </div>
  )
}


