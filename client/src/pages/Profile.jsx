import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import SectionCard from '../components/SectionCard.jsx'

export default function Profile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

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

  const amFollowing = user && profile.followers?.some((u) => (u._id || u) === user._id)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <div className="text-gray-600">@{profile.username}</div>
            <div className="mt-2 text-sm text-gray-600">{profile.year} • {profile.department} • {profile.specialization}</div>
            {profile.bio && <p className="mt-3 max-w-2xl">{profile.bio}</p>}
          </div>
          {user && user._id !== profile._id && (
            amFollowing ? (
              <button onClick={unfollow} className="px-4 py-2 rounded bg-gray-200">Unfollow</button>
            ) : (
              <button onClick={follow} className="px-4 py-2 rounded bg-blue-600 text-white">Follow</button>
            )
          )}
        </div>
      </div>

      <div className="space-y-4">
        {profile.sections?.length ? profile.sections.map((s) => (
          <SectionCard key={s._id} section={s} />
        )) : (
          <div className="text-gray-600">No sections yet.</div>
        )}
      </div>
    </div>
  )
}


