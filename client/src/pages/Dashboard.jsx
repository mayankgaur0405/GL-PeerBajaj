import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [saving, setSaving] = useState(false);
  const [newSection, setNewSection] = useState({ title: '', description: '' });
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [viewingResources, setViewingResources] = useState({}); // sectionId -> boolean

  useEffect(() => {
    setProfile(user);
  }, [user]);

  if (!profile) return null;

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/users/${profile._id}`, profile);
      setProfile(res.data.user);
      setUser(res.data.user);
    } finally {
      setSaving(false);
    }
  };

  const addSection = async () => {
    if (!newSection.title) return;
    try {
      const res = await api.post(`/users/${profile._id}/sections`, newSection);
      setProfile({ ...profile, sections: res.data.sections });
      setNewSection({ title: '', description: '' });
    } catch (err) {
      console.error('Failed to add section:', err);
      alert(err.response?.data?.message || 'Failed to add section');
    }
  };

  const addResource = async (sectionId) => {
    const link = prompt('Resource link:');
    if (!link) return;
    const description = prompt('Description (optional):') || '';
    const img = prompt('Image URL (optional, for images only):') || '';
    try {
      const res = await api.post(
        `/users/${profile._id}/sections/${sectionId}/resources`,
        { link, description, img }
      );
      setProfile({
        ...profile,
        sections: profile.sections.map((s) =>
          s._id === sectionId ? res.data.section : s
        ),
      });
    } catch (err) {
      console.error('Failed to add resource:', err);
      alert(err.response?.data?.message || 'Failed to add resource');
    }
  };

  const deleteSection = async (sectionId) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    try {
      const res = await api.delete(
        `/users/${profile._id}/sections/${sectionId}`
      );
      setProfile({ ...profile, sections: res.data.sections });
    } catch (err) {
      console.error('Failed to delete section:', err);
      alert(err.response?.data?.message || 'Failed to delete section');
    }
  };

  const deleteResource = async (sectionId, resourceId) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      const res = await api.delete(
        `/users/${profile._id}/sections/${sectionId}/resources/${resourceId}`
      );
      setProfile({
        ...profile,
        sections: profile.sections.map((s) =>
          s._id === sectionId ? res.data.section : s
        ),
      });
    } catch (err) {
      console.error('Failed to delete resource:', err);
      alert(err.response?.data?.message || 'Failed to delete resource');
    }
  };

  const saveSection = async (sectionId, data) => {
    try {
      const res = await api.put(`/users/${profile._id}/sections/${sectionId}`, data);
      setProfile({
        ...profile,
        sections: profile.sections.map((s) =>
          s._id === sectionId ? res.data.section : s
        ),
      });
      setEditingSectionId(null);
    } catch (err) {
      console.error('Failed to save section:', err);
      alert(err.response?.data?.message || 'Failed to save section');
    }
  };

  const editResource = async (sectionId, resourceId, resource) => {
    const link = prompt('Edit Resource link:', resource.link);
    if (!link) return;
    const description = prompt('Edit description (optional):', resource.description || '') || '';
    const img = prompt('Edit image URL (optional):', resource.img || '') || '';
    try {
      const res = await api.put(
        `/users/${profile._id}/sections/${sectionId}/resources/${resourceId}`,
        { link, description, img }
      );
      setProfile({
        ...profile,
        sections: profile.sections.map((s) =>
          s._id === sectionId ? res.data.section : s
        ),
      });
    } catch (err) {
      console.error('Failed to edit resource:', err);
      alert(err.response?.data?.message || 'Failed to edit resource');
    }
  };

  const toggleViewResources = (sectionId) => {
    setViewingResources((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Form */}
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold mb-4">Edit Profile</h1>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
          <Field label="Username" value={profile.username} onChange={(v) => setProfile({ ...profile, username: v })} />
          <Field label="Year" value={profile.year || ''} onChange={(v) => setProfile({ ...profile, year: v })} />
          <Field label="Department" value={profile.department || ''} onChange={(v) => setProfile({ ...profile, department: v })} />
          <Field label="Specialization" value={profile.specialization || ''} onChange={(v) => setProfile({ ...profile, specialization: v })} />
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Bio</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>
        </div>
        <button
          onClick={saveProfile}
          disabled={saving}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">Sections</h2>
        <div className="grid gap-3">
          {profile.sections?.map((s) => (
            <div key={s._id} className="border rounded p-3 space-y-2">
              {editingSectionId === s._id ? (
                <>
                  <input
                    className="w-full border px-2 py-1 font-medium"
                    value={s.title}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        sections: profile.sections.map((sec) =>
                          sec._id === s._id ? { ...sec, title: e.target.value } : sec
                        ),
                      })
                    }
                  />
                  <textarea
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={s.description || ''}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        sections: profile.sections.map((sec) =>
                          sec._id === s._id ? { ...sec, description: e.target.value } : sec
                        ),
                      })
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveSection(s._id, { title: s.title, description: s.description })}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSectionId(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{s.title}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingSectionId(s._id)}
                        className="text-sm px-3 py-1 bg-yellow-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => addResource(s._id)}
                        className="text-sm px-3 py-1 bg-gray-800 text-white rounded"
                      >
                        Add Resource
                      </button>
                      <button
                        onClick={() => toggleViewResources(s._id)}
                        className="text-sm px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        {viewingResources[s._id] ? 'Hide Resources' : 'View Resources'}
                      </button>
                      <button
                        onClick={() => deleteSection(s._id)}
                        className="text-sm px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete Section
                      </button>
                    </div>
                  </div>
                  {s.description && (
                    <div className="text-sm text-gray-600 whitespace-pre-wrap">
                      {s.description}
                    </div>
                  )}

                  {/* Resources cards */}
                  {viewingResources[s._id] && (
                    <div className="grid md:grid-cols-2 gap-3 mt-2">
                      {s.resources?.length ? (
                        s.resources.map((r) => (
                          <div key={r._id} className="border rounded p-3 shadow space-y-1">
                            <div className="font-medium">{r.description || 'Resource'}</div>
                            {r.img ? (
                              <img src={r.img} alt={r.description} className="max-h-40 w-full object-cover rounded" />
                            ) : r.link.endsWith('.pdf') ? (
                              <a href={r.link} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                View PDF
                              </a>
                            ) : r.link.endsWith('.doc') || r.link.endsWith('.docx') ? (
                              <a href={r.link} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                View DOC
                              </a>
                            ) : (
                              <a href={r.link} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                Open Link
                              </a>
                            )}
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() => editResource(s._id, r._id, r)}
                                className="px-2 py-1 text-xs bg-yellow-500 text-white rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteResource(s._id, r._id)}
                                className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">No resources yet</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add New Section */}
        <div className="border rounded p-3 grid md:grid-cols-3 gap-2">
          <input
            className="border rounded px-3 py-2"
            placeholder="Section title"
            value={newSection.title}
            onChange={(e) =>
              setNewSection({ ...newSection, title: e.target.value })
            }
          />
          <input
            className="border rounded px-3 py-2 md:col-span-2"
            placeholder="Description (optional)"
            value={newSection.description}
            onChange={(e) =>
              setNewSection({ ...newSection, description: e.target.value })
            }
          />
          <button
            onClick={addSection}
            className="px-4 py-2 bg-blue-600 text-white rounded md:col-span-3"
          >
            Add Section
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

