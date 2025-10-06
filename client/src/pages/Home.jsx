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
import FeedPage from './Feed.jsx'
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

      {/* Social Mode - Use unified FeedPage component used by All/Your Feed */}
      {isSocialMode && (
        <FeedPage />
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
