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
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { key: 'all', label: 'All Posts' },
                { key: 'text', label: 'Blogs/Text' },
                { key: 'section', label: 'Sections/Roadmaps' },
                { key: 'image', label: 'Images' }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    activeFilter === filter.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
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
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Your Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Posts</span>
                <span className="font-medium">{user?.totalPosts || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Followers</span>
                <span className="font-medium">{user?.followers?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Following</span>
                <span className="font-medium">{user?.following?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Likes</span>
                <span className="font-medium">{user?.totalLikes || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href="/trending"
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                🔥 Trending
              </a>
              <a
                href="/dashboard"
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                ⚙️ Dashboard
              </a>
              <a
                href="/chat"
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
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
