import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCreatePost } from '../context/CreatePostContext.jsx'
import { useMode } from '../context/ModeContext.jsx'
import apiClient from '../lib/api.js'
import SearchBar from '../components/SearchBar.jsx'
import Filters from '../components/Filters.jsx'
import ProfileCard from '../components/ProfileCard.jsx'
import UserSuggestions from '../components/UserSuggestions.jsx'
import CardGrid from '../components/CardGrid.jsx'
import LeaderboardCard from '../components/LeaderboardCard.jsx'
import TrendingResourceCard from '../components/TrendingResourceCard.jsx'
import { topContributors as fallbackContributors, trendingResources } from '../data/homeShowcase.js'
import Feed from '../components/Feed.jsx'
import StudyMaterials from '../components/StudyMaterials.jsx'
import Extras, { PlacementPrepSection, AboutSection, BenefitsSection, CareerSection, InternshipSection, PlatformFeaturesSection, FooterSection, HeroSection, FeedbackSection } from '../components/Extras.jsx'

export default function Home() {
  const { user } = useAuth()
  const { openModal } = useCreatePost()
  const { isSocialMode, isExploreMode, currentMode, toggleMode, setCurrentMode } = useMode()
  const location = useLocation()
  const [pendingAnchor, setPendingAnchor] = useState('')
  const [confirming, setConfirming] = useState(false)

  // Explore section ids referenced from sitemap/hash links
  const exploreIds = new Set([
    'StudyMaterials',
    'PlacementPrepSection',
    'about',
    'features',
    'benefits',
    'careers',
    'internships',
    'feedback'
  ])
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ year: '', department: '', specialization: '' })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('global')
  const [activeFilter, setActiveFilter] = useState('all')
  const [contributors, setContributors] = useState(fallbackContributors)
  const hasSearch = (query && query.trim().length > 0) || !!(filters.year || filters.department || filters.specialization)

  const postFilters = {
    all: {},
    text: { type: 'text' },
    section: { type: 'section' },
    image: { type: 'image' }
  }

  const loadSuggestions = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/users/suggest?limit=8')
      setUsers(res.data.users)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSuggestions()
      ; (async () => {
        try {
          const res = await apiClient.get('/trending/contributors?limit=6')
          if (res.data?.contributors?.length)
            setContributors(
              res.data.contributors.map(c => ({
                name: c.name,
                username: c.username,
                posts: c.posts,
                likes: c.likes,
                comments: c.comments,
                shares: c.shares,
                avatar: c.avatar,
                max: 150
              }))
            )
        } catch (_) { }
      })()
  }, [])

  // Smoothly scroll to an element by id
  const scrollToId = (id) => {
    if (!id) return
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Detect hash targeting Explore sections and request mode switch if needed
  useEffect(() => {
    const hash = (location.hash || '').replace(/^#/, '')
    if (!hash) return

    if (!exploreIds.has(hash)) return

    setPendingAnchor(hash)
    if (currentMode === 'social') {
      // Option A: auto-switch without prompt
      // toggleMode()
      // Option B: show a lightweight confirm dialog
      if (!confirming) {
        setConfirming(true)
        const ok = window.confirm('This section is part of Explore Mode. Switch now?')
        setConfirming(false)
        if (ok) {
          setCurrentMode('explore')
        } else {
          // user declined; clear hash to avoid repeated prompts
          try { window.location.hash = '' } catch (_) {
            history.replaceState(null, '', window.location.pathname + window.location.search)
          }
          setPendingAnchor('')
        }
      }
    } else {
      // already in explore
      setTimeout(() => scrollToId(hash), 50)
    }
  }, [location.hash, currentMode, toggleMode])

  // If user manually switches back to Social while an explore hash is present, clear it to avoid re-prompts
  useEffect(() => {
    if (currentMode !== 'social') return
    const hash = (location.hash || '').replace(/^#/, '')
    if (!hash) return
    if (exploreIds.has(hash)) {
      try { window.location.hash = '' } catch (_) {
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }
      setPendingAnchor('')
    }
  }, [currentMode, location.hash])

  // After explore mode becomes active, scroll to the pending anchor
  useEffect(() => {
    if (isExploreMode && pendingAnchor) {
      // allow layout to mount before scrolling
      const id = pendingAnchor
      setPendingAnchor('')
      setTimeout(() => scrollToId(id), 150)
    }
  }, [isExploreMode, pendingAnchor])

  const handleSearch = async () => {
    if (!query && !filters.year && !filters.department && !filters.specialization) {
      return loadSuggestions()
    }
    setLoading(true)
    try {
      let results = []
      if (query) {
        const res = await apiClient.get('/users/search', { params: { username: query } })
        results = res.data.users
      }
      if (filters.year || filters.department || filters.specialization) {
        const res = await apiClient.post('/users/filter', filters)
        results = results.length ? intersectById(results, res.data.users) : res.data.users
      }
      setUsers(results)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <HeroSection />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </div>

      {/* Social Mode - Feed Content */}
      {isSocialMode && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Feed Content - Takes up 2/3 of the width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Social Mode Header */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">👥</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Social Feed</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Connect and share with your peers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Create Post Button */}
                    {user && (
                      <button
                        onClick={openModal}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <span>✏️</span>
                        <span>Create Post</span>
                      </button>
                    )}
                    
                    {/* Feed Type Toggle */}
                    <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                      {[
                        { key: 'global', label: 'Global', icon: '🌍' },
                        { key: 'following', label: 'Following', icon: '👥' }
                      ].map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeTab === tab.key
                              ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <span>{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,000+</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">5,000+</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">50+</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">Topics</div>
                  </div>
                </div>
              </div>

              {/* Welcome Message for New Users */}
              {!user && (
                <div className="glass-card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl">👋</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Welcome to GL PeerBajaj!</h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-4">
                        Join our community to learn from seniors' experiences, share your knowledge, and connect with fellow students.
                      </p>
                      <div className="flex space-x-3">
                        <Link
                          to="/signup"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Get Started
                        </Link>
                        <Link
                          to="/login"
                          className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
                        >
                          Sign In
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stories/Highlights Section */}
              {user && (
                <div className="glass-card p-4">
                  <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                    <div className="flex-shrink-0 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mb-2 border-2 border-dashed border-gray-400 dark:border-slate-500">
                        <span className="text-gray-500 dark:text-slate-400 text-xl">+</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">Your Story</p>
                    </div>
                    {contributors.slice(0, 5).map((contributor, idx) => (
                      <div key={idx} className="flex-shrink-0 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-2 ring-2 ring-blue-500/30">
                          <span className="text-white text-sm font-bold">{contributor.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 truncate w-16">{contributor.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Post Type Filters */}
              <div className="glass-card p-4">
                <div className="tab-group">
                  {[
                    { key: 'all', label: 'All Posts' },
                    { key: 'text', label: 'Blogs/Text' },
                    { key: 'section', label: 'Sections/Roadmaps' },
                    { key: 'image', label: 'Images' }
                  ].map(filter => (
                    <button
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      className={`tab-btn ${activeFilter === filter.key ? 'tab-btn-active' : ''}`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Feed */}
              <Feed type={activeTab} filters={postFilters[activeFilter]} />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* User Suggestions */}
              <UserSuggestions />

              {/* Quick Actions */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Quick Actions</h3>
                <div className="space-y-2">
                  <Link
                    to="/trending"
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <span className="text-xl">🔥</span>
                    <span>Trending Content</span>
                  </Link>
                  {user && (
                    <>
                      <Link
                        to="/feed"
                        className="flex items-center space-x-3 w-full text-left px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <span className="text-xl">📱</span>
                        <span>Your Feed</span>
                      </Link>
                      <Link
                        to="/chat"
                        className="flex items-center space-x-3 w-full text-left px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <span className="text-xl">💬</span>
                        <span>Messages</span>
                      </Link>
                      <Link
                        to={`/profile/${user._id}`}
                        className="flex items-center space-x-3 w-full text-left px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <span className="text-xl">⚙️</span>
                        <span>Profile</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Top Contributors</h3>
                <div className="space-y-3">
                  {contributors.slice(0, 3).map((contributor, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-white">{contributor.name}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">{contributor.posts ?? contributor.contributions ?? 0} posts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discover People - Compact Version */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Discover People</h3>
                <div className="space-y-3">
                  <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} />
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Search by username or use filters to find students
                  </div>
                  {hasSearch && (
                    <div className="space-y-2">
                      {loading ? (
                        <div className="space-y-2">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-3 animate-pulse">
                              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                              <div className="flex-1">
                                <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2 mb-1"></div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-1/3"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {users.slice(0, 3).map(u => (
                            <ProfileCard key={u._id} user={u} compact />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explore Mode - Resources and Information Sections */}
      {isExploreMode && (
        <div className="mt-10 space-y-10 snap-start">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-1" id="StudyMaterials">
            <div className="rounded-2xl p-6 bg-slate-900 space-y-8">
              <StudyMaterials />
            </div>
          </div>

          <div className="snap-start" id="PlacementPrepSection"><PlacementPrepSection /></div>
          <div className="snap-start" id="about"><AboutSection /></div>
          <div className="snap-start" id="features"><PlatformFeaturesSection /></div>
          <div className="snap-start" id="benefits"><BenefitsSection /></div>
          <div className="snap-start" id="careers"><CareerSection /></div>
          <div className="snap-start" id="internships"><InternshipSection /></div>
          <div className="snap-start" id="feedback"><FeedbackSection /></div>
        </div>
      )}
    </div>
  )
}

function intersectById(a, b) {
  const ids = new Set(a.map(x => x._id))
  return b.filter(x => ids.has(x._id))
}
