import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCreatePost } from '../context/CreatePostContext.jsx';
import Feed from '../components/Feed.jsx';
import LeftRail from '../components/LeftRail.jsx';
import UserSuggestions from '../components/UserSuggestions.jsx';
import api from '../lib/api.js';

export default function FeedPage() {
  const { user } = useAuth();
  const { openModal } = useCreatePost();
  const [activeFeed, setActiveFeed] = useState('following');
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [contributors, setContributors] = useState([]);

  const filters = {
    all: {},
    text: { type: 'text' },
    section: { type: 'section' },
    image: { type: 'image' }
  };

  const handlePostCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Fetch top contributors for stories
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await api.get('/trending/contributors?limit=5');
        if (res.data?.contributors?.length) {
          setContributors(res.data.contributors);
        }
      } catch (err) {
        console.error('Failed to fetch contributors:', err);
      }
    };
    fetchContributors();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-16">
        {/* Left Rail */}
        <div className="hidden lg:block">
          <LeftRail />
        </div>

        {/* Main Feed - widest */}
        <div className="lg:col-span-4 space-y-6">
          {/* Learning Feed Header */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📚</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Learning Feed</h2>
                  <p className="text-sm text-white/70">Learn from seniors' experiences and insights</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Create Post Button */}
                {user && (
                  <button
                    onClick={openModal}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <span>✏️</span>
                    <span>Create Post</span>
                  </button>
                )}
                
                {/* Feed Type Toggle */}
                <div className="flex bg-white/10 rounded-lg p-1">
                  {[
                    { key: 'global', label: 'Global', icon: '🌍' },
                    { key: 'following', label: 'Following', icon: '👥' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveFeed(tab.key)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeFeed === tab.key
                          ? 'bg-white/20 text-white shadow-sm'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">1,000+</div>
                <div className="text-sm text-white/70">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">5,000+</div>
                <div className="text-sm text-white/70">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">50+</div>
                <div className="text-sm text-white/70">Topics</div>
              </div>
            </div>
          </div>

          {/* Header widgets row: Suggested, Contributors, Activity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Suggested for you */}
            <UserSuggestions />

            {/* Top Contributors */}
            <div className="glass-card p-6 hover-glow hover-raise transition-transform">
              <h3 className="text-lg font-semibold text-white mb-4">Top Contributors</h3>
              <div className="space-y-3">
                {contributors.slice(0, 3).map((contributor, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{contributor.name}</div>
                      <div className="text-sm text-white/70">{contributor.posts ?? contributor.contributions ?? 0} posts</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Activity */}
            {user ? (
              <div className="glass-card p-6 hover-glow hover-raise transition-transform">
                <h3 className="text-lg font-semibold text-white mb-4">Your Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Posts</span>
                    <span className="font-medium text-white">{user?.totalPosts || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Followers</span>
                    <span className="font-medium text-white">{user?.followers?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Following</span>
                    <span className="font-medium text-white">{user?.following?.length || 0}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-6 hover-glow hover-raise transition-transform flex items-center justify-center text-white/70">
                Sign in to view your activity
              </div>
            )}
          </div>

          {/* Stories Section */}
          {user && (
            <div className="glass-card p-4">
              <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                <div className="flex-shrink-0 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mb-2 border-2 border-dashed border-gray-400 dark:border-slate-500">
                    <span className="text-gray-500 dark:text-slate-400 text-xl">+</span>
                  </div>
                  <p className="text-xs text-white/70">Your Story</p>
                </div>
                {contributors.slice(0, 5).map((contributor, idx) => (
                  <div key={idx} className="flex-shrink-0 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-2 ring-2 ring-blue-500/30">
                      <span className="text-white text-sm font-bold">{contributor.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    </div>
                    <p className="text-xs text-white/70 truncate w-16">{contributor.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post Type Filters */}
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
            key={`${refreshKey}-${activeFeed}-${activeFilter}`}
            type={activeFeed}
            filters={filters[activeFilter]}
          />
        </div>

        {/* No right sidebar; content moved into LeftRail */}
      </div>

      {/* Floating Create Button (desktop + mobile) */}
      {user && (
        <button
          onClick={openModal}
          className="fixed bottom-6 right-6 z-40 shadow-lg rounded-full px-5 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>✏️</span>
          <span className="hidden sm:inline">Create</span>
        </button>
      )}
    </div>
  );
}
