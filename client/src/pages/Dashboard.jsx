import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';
import Feed from '../components/Feed.jsx';

export default function Dashboard() {
	const { user, setUser } = useAuth();
	const [profile, setProfile] = useState(user || null);
	const [saving, setSaving] = useState(false);
	// Sections feature removed

	useEffect(() => {
		setProfile(user);
	}, [user]);

	if (!profile) return null;

	// Tabs for categorized posts
	const [activeTab, setActiveTab] = useState('section');
	const filtersByTab = useMemo(() => ({
		section: { type: 'section' },
		text: { type: 'text' },
		image: { type: 'image' }
	}), []);

	// Sections feature removed

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

	return (
		<div className="space-y-6">
			{/* Profile edit form */}
			<div className="glass-card p-6">
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

			{/* Sections feature removed */}

			{/* Posts categorized like feed */}
			<div className="glass-card p-6 space-y-4">
				<h2 className="text-lg font-semibold">Your Posts</h2>
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

