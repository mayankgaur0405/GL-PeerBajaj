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

  useEffect(() => setProfile(user), [user]);
  if (!profile) return null;

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/users/${profile._id}`, profile);
      setProfile(res.data.user);
      setUser(res.data.user);
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addSection = async () => {
    if (!newSection.title.trim()) return alert('Section title is required');
    try {
      const res = await api.post(`/users/${profile._id}/sections`, newSection);
      setProfile({ ...profile, sections: res.data.sections });
      setNewSection({ title: '', description: '' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add section');
    }
  };

  const deleteSection = async (sectionId) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    try {
      const res = await api.delete(`/users/${profile._id}/sections/${sectionId}`);
      setProfile({ ...profile, sections: res.data.sections });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete section');
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
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save section');
    }
  };

  const addResource = async (sectionId) => {
    const link = prompt('Resource link:')?.trim();
    if (!link) return alert('Link is required');
    const description = prompt('Description (optional):')?.trim() || '';
    const img = prompt('Image URL (optional):')?.trim() || '';
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
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add resource');
    }
  };

  const editResource = async (sectionId, resourceId, resource) => {
    const link = prompt('Edit Resource link:', resource.link)?.trim();
    if (!link) return alert('Link is required');
    const description = prompt('Edit description (optional):', resource.description || '')?.trim() || '';
    const img = prompt('Edit image URL (optional):', resource.img || '')?.trim() || '';
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
      console.error(err);
      alert(err.response?.data?.message || 'Failed to edit resource');
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
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete resource');
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
      <ProfileForm profile={profile} setProfile={setProfile} saveProfile={saveProfile} saving={saving} />
      <SectionsManager
        profile={profile}
        setProfile={setProfile}
        newSection={newSection}
        setNewSection={setNewSection}
        editingSectionId={editingSectionId}
        setEditingSectionId={setEditingSectionId}
        viewingResources={viewingResources}
        toggleViewResources={toggleViewResources}
        addSection={addSection}
        deleteSection={deleteSection}
        saveSection={saveSection}
        addResource={addResource}
        editResource={editResource}
        deleteResource={deleteResource}
      />
    </div>
  );
}

// --- Profile Form ---
function ProfileForm({ profile, setProfile, saveProfile, saving }) {
  return (
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
  );
}

// --- Sections Manager ---
function SectionsManager({
  profile,
  setProfile,
  newSection,
  setNewSection,
  editingSectionId,
  setEditingSectionId,
  viewingResources,
  toggleViewResources,
  addSection,
  deleteSection,
  saveSection,
  addResource,
  editResource,
  deleteResource
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold">Sections</h2>
      <div className="grid gap-3">
        {profile.sections?.map((s) => (
          <SectionCard
            key={s._id}
            section={s}
            profile={profile}
            editingSectionId={editingSectionId}
            setEditingSectionId={setEditingSectionId}
            viewingResources={viewingResources}
            toggleViewResources={toggleViewResources}
            saveSection={saveSection}
            deleteSection={deleteSection}
            addResource={addResource}
            editResource={editResource}
            deleteResource={deleteResource}
          />
        ))}
      </div>
      <div className="border rounded p-3 grid md:grid-cols-3 gap-2">
        <input
          className="border rounded px-3 py-2"
          placeholder="Section title"
          value={newSection.title}
          onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
        />
        <input
          className="border rounded px-3 py-2 md:col-span-2"
          placeholder="Description (optional)"
          value={newSection.description}
          onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
        />
        <button
          onClick={addSection}
          className="px-4 py-2 bg-blue-600 text-white rounded md:col-span-3"
        >
          Add Section
        </button>
      </div>
    </div>
  );
}

// --- Section Card ---
function SectionCard({
  section,
  profile,
  editingSectionId,
  setEditingSectionId,
  viewingResources,
  toggleViewResources,
  saveSection,
  deleteSection,
  addResource,
  editResource,
  deleteResource
}) {
  const isEditing = editingSectionId === section._id;
  const [localTitle, setLocalTitle] = useState(section.title);
  const [localDesc, setLocalDesc] = useState(section.description || '');

  useEffect(() => {
    setLocalTitle(section.title);
    setLocalDesc(section.description || '');
  }, [section]);

  return (
    <div className="border rounded p-3 space-y-2">
      {isEditing ? (
        <>
          <input className="w-full border px-2 py-1 font-medium" value={localTitle} onChange={(e) => setLocalTitle(e.target.value)} />
          <textarea className="w-full border rounded px-2 py-1 text-sm" value={localDesc} onChange={(e) => setLocalDesc(e.target.value)} />
          <div className="flex gap-2">
            <button onClick={() => saveSection(section._id, { title: localTitle, description: localDesc })} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
            <button onClick={() => setEditingSectionId(null)} className="px-3 py-1 bg-gray-400 text-white rounded">Cancel</button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="font-medium">{section.title}</div>
            <div className="flex gap-2">
              <button onClick={() => setEditingSectionId(section._id)} className="text-sm px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
              <button onClick={() => addResource(section._id)} className="text-sm px-3 py-1 bg-gray-800 text-white rounded">Add Resource</button>
              <button onClick={() => toggleViewResources(section._id)} className="text-sm px-3 py-1 bg-blue-600 text-white rounded">
                {viewingResources[section._id] ? 'Hide Resources' : 'View Resources'}
              </button>
              <button onClick={() => deleteSection(section._id)} className="text-sm px-3 py-1 bg-red-600 text-white rounded">Delete Section</button>
            </div>
          </div>
          {section.description && <div className="text-sm text-gray-600">{section.description}</div>}
          {viewingResources[section._id] && (
            <div className="grid md:grid-cols-2 gap-3 mt-2">
              {section.resources?.length ? section.resources.map((r) => (
                <div key={r._id} className="border rounded p-3 shadow space-y-1">
                  <div className="font-medium">{r.description || 'Resource'}</div>
                  {r.img ? (
                    <img src={r.img} alt={r.description} className="max-h-40 w-full object-cover rounded" />
                  ) : (
                    <a href={r.link} target="_blank" rel="noreferrer" className="text-blue-600 underline">{r.link.split('/').pop()}</a>
                  )}
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => editResource(section._id, r._id, r)} className="px-2 py-1 text-xs bg-yellow-500 text-white rounded">Edit</button>
                    <button onClick={() => deleteResource(section._id, r._id)} className="px-2 py-1 text-xs bg-red-600 text-white rounded">Delete</button>
                  </div>
                </div>
              )) : <div className="text-sm text-gray-500">No resources yet</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// --- Input Field ---
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
  );
}
