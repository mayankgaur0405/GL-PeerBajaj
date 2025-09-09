import { useEffect, useState } from 'react'
import api from '../lib/api.js'
import SearchBar from '../components/SearchBar.jsx'
import Filters from '../components/Filters.jsx'
import ProfileCard from '../components/ProfileCard.jsx'

export default function Home() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ year: '', department: '', specialization: '' })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const loadSuggestions = async () => {
    setLoading(true)
    try {
      const res = await api.get('/users/suggest?limit=8')
      setUsers(res.data.users)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSuggestions()
  }, [])

  const handleSearch = async () => {
    if (!query && !filters.year && !filters.department && !filters.specialization) {
      return loadSuggestions()
    }
    setLoading(true)
    try {
      let results = []
      if (query) {
        const res = await api.get('/users/search', { params: { username: query } })
        results = res.data.users
      }
      if (filters.year || filters.department || filters.specialization) {
        const res = await api.post('/users/filter', filters)
        results = results.length ? intersectById(results, res.data.users) : res.data.users
      }
      setUsers(results)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-4">
        <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} />
        <div className="mt-4">
          <Filters filters={filters} setFilters={setFilters} onApply={handleSearch} />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-3">{query || (filters.year||filters.department||filters.specialization) ? 'Results' : 'People you may know'}</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users.map((u) => (
              <ProfileCard key={u._id} user={u} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function intersectById(a, b) {
  const ids = new Set(a.map((x) => x._id))
  return b.filter((x) => ids.has(x._id))
}


