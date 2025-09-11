import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Profile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [showResources, setShowResources] = useState({}) // sectionId -> boolean

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

  const toggleResources = (sectionId) => {
    setShowResources((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
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
            amFollowing ? (
              <button
                onClick={unfollow}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={follow}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Follow
              </button>
            )
          )}
        </div>
      </div>

      <div className="space-y-4">
        {profile.sections?.length ? (
          profile.sections.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-xl shadow p-4 space-y-2"
            >
              <h4 className="font-semibold text-lg">{s.title}</h4>
              {s.description && (
                <div className="text-gray-600 whitespace-pre-wrap text-sm">
                  {s.description}
                </div>
              )}

              <button
                onClick={() => toggleResources(s._id)}
                className="text-sm text-blue-600 underline"
              >
                {showResources[s._id] ? 'Hide Resources' : 'View Resources'}
              </button>

              {showResources[s._id] && (
                s.resources?.length > 0 ? (
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {s.resources.map((r, idx) => (
                      <a
                        key={idx}
                        href={r.link}
                        target="_blank"
                        rel="noreferrer"
                        className="border rounded p-3 hover:bg-gray-50 flex items-center gap-3"
                      >
                        {r.img ? (
                          <img
                            src={r.img}
                            alt={r.description || 'resource'}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded" />
                        )}
                        <div>
                          <div className="font-medium line-clamp-1">
                            {r.description || r.link}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {r.link}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No resources yet</p>
                )
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-600">No sections yet.</div>
        )}
      </div>
    </div>
  )
}
