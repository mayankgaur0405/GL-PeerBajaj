import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Feed from '../components/Feed.jsx'

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Tabs for categorized posts on profile (keep hooks before any early returns)
  const [activeTab, setActiveTab] = useState('section')
  const filtersByTab = useMemo(() => ({
    section: { type: 'section' },
    text: { type: 'text' },
    image: { type: 'image' }
  }), [])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await api.get(`/users/${id}`)
        setProfile(res.data.user)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const follow = async () => {
    await api.post(`/users/${id}/follow`)
    const res = await api.get(`/users/${id}`)
    setProfile(res.data.user)
  }

  const unfollow = async () => {
    await api.post(`/users/${id}/unfollow`)
    const res = await api.get(`/users/${id}`)
    setProfile(res.data.user)
  }

  if (loading) return <div>Loading...</div>
  if (!profile) return <div>Not found</div>

  const amFollowing =
    user && profile.followers?.some((u) => (u._id || u) === user._id)

  // sections feature removed

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <div className="text-gray-600">@{profile.username}</div>
            <div className="mt-2 text-sm text-gray-600">
              {profile.year} • {profile.department} • {profile.specialization}
            </div>
            {profile.bio && (
              <p className="mt-3 max-w-2xl whitespace-pre-wrap">{profile.bio}</p>
            )}
          </div>
          {user && user._id !== profile._id && (
            <div className="flex gap-2">
              {amFollowing ? (
                <button
                  onClick={unfollow}
                  className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={follow}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Follow
                </button>
              )}
              <button
                onClick={() => navigate(`/chat?userId=${profile._id}`)}
                className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sections feature removed from profile view */}

      {/* Categorized Posts */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Posts</h2>
        <div className="tab-group w-full md:w-auto">
          {[
            { key: 'section', label: 'Sections/Roadmaps' },
            { key: 'text', label: 'Blogs/Text' },
            { key: 'image', label: 'Images' }
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`tab-btn ${activeTab === t.key ? 'tab-btn-active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Feed type="user" userId={profile._id} filters={filtersByTab[activeTab]} />
      </div>
    </div>
  )
}
