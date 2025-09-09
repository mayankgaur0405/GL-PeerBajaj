import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../lib/api.js'

export default function Dashboard() {
  const { user, setUser } = useAuth()
  const [profile, setProfile] = useState(user || null)
  const [saving, setSaving] = useState(false)
  const [newSection, setNewSection] = useState({ title: '', description: '' })

  useEffect(() => {
    setProfile(user)
  }, [user])

  if (!profile) return null

  const saveProfile = async () => {
    setSaving(true)
    try {
      const res = await api.put(`/users/${profile._id}/sections`, { sections: profile.sections || [] })
      setProfile(res.data.user)
      setUser(res.data.user)
    } finally {
      setSaving(false)
    }
  }

  const addSection = async () => {
    if (!newSection.title) return
    const res = await api.post(`/users/${profile._id}/sections`, newSection)
    setProfile({ ...profile, sections: res.data.sections })
    setNewSection({ title: '', description: '' })
  }

  const addResource = async (sectionId) => {
    const link = prompt('Resource link:')
    if (!link) return
    const description = prompt('Description (optional):') || ''
    const img = prompt('Image URL (optional):') || ''
    const res = await api.post(`/users/${profile._id}/sections/${sectionId}/resources`, { link, description, img })
    setProfile({ ...profile, sections: profile.sections.map(s => s._id === sectionId ? res.data.section : s) })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold mb-4">Edit Profile</h1>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Name" value={profile.name} onChange={(v)=>setProfile({ ...profile, name: v })} />
          <Field label="Username" value={profile.username} onChange={(v)=>setProfile({ ...profile, username: v })} />
          <Field label="Year" value={profile.year || ''} onChange={(v)=>setProfile({ ...profile, year: v })} />
          <Field label="Department" value={profile.department || ''} onChange={(v)=>setProfile({ ...profile, department: v })} />
          <Field label="Specialization" value={profile.specialization || ''} onChange={(v)=>setProfile({ ...profile, specialization: v })} />
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Bio</label>
            <textarea className="w-full border rounded px-3 py-2" value={profile.bio || ''} onChange={(e)=>setProfile({ ...profile, bio: e.target.value })} />
          </div>
        </div>
        <button onClick={saveProfile} disabled={saving} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          {saving ? 'Saving...' : 'Save Sections'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">Sections</h2>
        <div className="grid gap-3">
          {profile.sections?.map((s) => (
            <div key={s._id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{s.title}</div>
                <button onClick={() => addResource(s._id)} className="text-sm px-3 py-1 bg-gray-800 text-white rounded">Add Resource</button>
              </div>
              {s.description && <div className="text-sm text-gray-600">{s.description}</div>}
              {s.resources?.length ? (
                <ul className="list-disc ml-6 mt-2">
                  {s.resources.map((r, idx) => (
                    <li key={idx} className="text-sm"><a className="text-blue-600" href={r.link} target="_blank" rel="noreferrer">{r.description || r.link}</a></li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-500 mt-1">No resources yet</div>
              )}
            </div>
          ))}
        </div>

        <div className="border rounded p-3 grid md:grid-cols-3 gap-2">
          <input className="border rounded px-3 py-2" placeholder="Section title" value={newSection.title} onChange={(e)=>setNewSection({ ...newSection, title: e.target.value })} />
          <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Description (optional)" value={newSection.description} onChange={(e)=>setNewSection({ ...newSection, description: e.target.value })} />
          <button onClick={addSection} className="px-4 py-2 bg-blue-600 text-white rounded md:col-span-3">Add Section</button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input className="w-full border rounded px-3 py-2" value={value} onChange={(e)=>onChange(e.target.value)} />
    </div>
  )
}


