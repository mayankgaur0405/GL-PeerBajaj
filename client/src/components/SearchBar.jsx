export default function SearchBar({ value, onChange, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search by username"
        className="flex-1 border rounded px-3 py-2"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
    </form>
  )
}


