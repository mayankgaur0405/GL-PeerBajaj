import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Feed from '../components/Feed.jsx';
import CreatePost from '../components/CreatePost.jsx';
import UserSuggestions from '../components/UserSuggestions.jsx';

export default function FeedPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const filters = {
    all: {},
    text: { type: 'text' },
    section: { type: 'section' },
    image: { type: 'image' }
  };

  const handlePostCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <CreatePost onPostCreated={handlePostCreated} />

          {/* Filter Tabs */}
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

          {/* Feed */}
          <Feed 
            key={`${refreshKey}-${activeFilter}`}
            type="feed" 
            filters={filters[activeFilter]}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Suggestions */}
          <UserSuggestions />

          {/* Quick Stats */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted">Posts</span>
                <span className="font-medium text-white">{user?.totalPosts || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Followers</span>
                <span className="font-medium text-white">{user?.followers?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Following</span>
                <span className="font-medium text-white">{user?.following?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Total Likes</span>
                <span className="font-medium text-white">{user?.totalLikes || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href="/trending"
                className="block w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
              >
                🔥 Trending
              </a>
              <a
                href="/dashboard"
                className="block w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
              >
                ⚙️ Dashboard
              </a>
              <a
                href="/chat"
                className="block w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
              >
                💬 Messages
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
