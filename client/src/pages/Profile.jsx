import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Feed from '../components/Feed.jsx'
import ProfilePictureUpload from '../components/ProfilePictureUpload.jsx'

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editProfile, setEditProfile] = useState({})
  const { user, setUser } = useAuth()

  // Tabs for categorized posts on profile (keep hooks before any early returns)
  const [activeTab, setActiveTab] = useState('section')
  const filtersByTab = useMemo(() => ({
    section: { type: 'section' },
    text: { type: 'text' },
    image: { type: 'image' }
  }), [])

  const isOwnProfile = user && user._id === id

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await api.get(`/users/${id}`)
        setProfile(res.data.user)
        setEditProfile(res.data.user)
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

  const saveProfile = async () => {
    setSaving(true)
    try {
      const res = await api.put(`/users/${profile._id}`, editProfile)
      setProfile(res.data.user)
      setUser(res.data.user)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const cancelEdit = () => {
    setEditProfile(profile)
    setIsEditing(false)
  }

  const handleProfilePictureUpdate = (newPicture) => {
    setProfile(prev => ({ ...prev, profilePicture: newPicture }))
    setEditProfile(prev => ({ ...prev, profilePicture: newPicture }))
  }

  if (loading) return <div>Loading...</div>
  if (!profile) return <div>Not found</div>

  const amFollowing =
    user && profile.followers?.some((u) => (u._id || u) === user._id)

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {isOwnProfile && isEditing ? (
                <ProfilePictureUpload
                  onUpload={handleProfilePictureUpdate}
                  currentPicture={profile.profilePicture}
                  size="xlarge"
                />
              ) : (
                <img
                  src={profile.profilePicture || '/default-avatar.svg'}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editProfile.name || ''}
                      onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Username</label>
                    <input
                      type="text"
                      value={editProfile.username || ''}
                      onChange={(e) => setEditProfile({ ...editProfile, username: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Bio</label>
                    <textarea
                      value={editProfile.bio || ''}
                      onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Year</label>
                      <input
                        type="text"
                        value={editProfile.year || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, year: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Department</label>
                      <input
                        type="text"
                        value={editProfile.department || ''}
                        onChange={(e) => setEditProfile({ ...editProfile, department: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Specialization</label>
                    <input
                      type="text"
                      value={editProfile.specialization || ''}
                      onChange={(e) => setEditProfile({ ...editProfile, specialization: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., AI/ML, Web Development"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <div className="text-gray-400">@{profile.username}</div>
                  <div className="mt-2 text-sm text-gray-400">
                    {profile.year} • {profile.department} • {profile.specialization}
                  </div>
                  {profile.bio && (
                    <p className="mt-3 max-w-2xl whitespace-pre-wrap text-gray-300">{profile.bio}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            {isOwnProfile ? (
              isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )
            ) : user && user._id !== profile._id ? (
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
            ) : null}
          </div>
        </div>
      </div>

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
