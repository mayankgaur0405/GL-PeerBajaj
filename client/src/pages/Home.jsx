import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../lib/api.js'
import SearchBar from '../components/SearchBar.jsx'
import Filters from '../components/Filters.jsx'
import ProfileCard from '../components/ProfileCard.jsx'
import UserSuggestions from '../components/UserSuggestions.jsx'
import Feed from '../components/Feed.jsx'

export default function Home() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ year: '', department: '', specialization: '' })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('discover')

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
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to GL Peer Bajaj</h1>
        <p className="text-xl mb-6">Connect, learn, and grow with your peers in the tech community</p>
        {user ? (
          <div className="flex space-x-4">
            <Link 
              to="/feed" 
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Go to Feed
            </Link>
            <Link 
              to="/trending" 
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Explore Trending
            </Link>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link 
              to="/signup" 
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'discover', label: 'Discover People' },
            { key: 'feed', label: 'Recent Posts' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'discover' ? (
            <>
              {/* Search Section */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} />
                <div className="mt-4">
                  <Filters filters={filters} setFilters={setFilters} onApply={handleSearch} />
                </div>
              </div>

              {/* Users Grid */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {query || (filters.year||filters.department||filters.specialization) ? 'Search Results' : 'People you may know'}
                </h2>
                {loading ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-white rounded-xl shadow-sm border p-4 animate-pulse">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {users.map((u) => (
                      <ProfileCard key={u._id} user={u} />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <Feed type="posts" filters={{}} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Suggestions */}
          <UserSuggestions />

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Platform Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Users</span>
                <span className="font-medium">1,000+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Posts</span>
                <span className="font-medium">5,000+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categories</span>
                <span className="font-medium">8</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link 
                to="/trending" 
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                🔥 Trending Content
              </Link>
              {user && (
                <>
                  <Link 
                    to="/feed" 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    📱 Your Feed
                  </Link>
                  <Link 
                    to="/chat" 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    💬 Messages
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    ⚙️ Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function intersectById(a, b) {
  const ids = new Set(a.map((x) => x._id))
  return b.filter((x) => ids.has(x._id))
}


