import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';

export default function Trending() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profiles');
  const [trendingData, setTrendingData] = useState({
    profiles: [],
    sections: [],
    posts: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTrendingData();
  }, [activeTab, filter]);

  const fetchTrendingData = async () => {
    try {
      setLoading(true);
      let endpoint = '/trending';
      let params = {};

      switch (activeTab) {
        case 'profiles':
          endpoint = '/trending/profiles';
          params = { filter };
          break;
        case 'sections':
          endpoint = '/trending/sections';
          break;
        case 'posts':
          endpoint = '/trending/posts';
          break;
        case 'categories':
          endpoint = '/trending/categories';
          break;
      }

      const response = await api.get(endpoint, { params });
      
      setTrendingData(prev => ({
        ...prev,
        [activeTab]: response.data[activeTab] || response.data
      }));
    } catch (err) {
      console.error('Failed to fetch trending data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    if (!user) return;
    
    try {
      await api.post(`/users/${userId}/follow`);
      // Update local state
      setTrendingData(prev => ({
        ...prev,
        profiles: prev.profiles.map(profile => 
          profile._id === userId 
            ? { ...profile, followers: [...(profile.followers || []), user._id] }
            : profile
        )
      }));
    } catch (err) {
      console.error('Failed to follow user:', err);
    }
  };

  const handleUnfollow = async (userId) => {
    if (!user) return;
    
    try {
      await api.post(`/users/${userId}/unfollow`);
      // Update local state
      setTrendingData(prev => ({
        ...prev,
        profiles: prev.profiles.map(profile => 
          profile._id === userId 
            ? { ...profile, followers: profile.followers?.filter(id => id !== user._id) || [] }
            : profile
        )
      }));
    } catch (err) {
      console.error('Failed to unfollow user:', err);
    }
  };

  const renderProfiles = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingData.profiles.map((profile) => {
          const isFollowing = user && profile.followers?.includes(user._id);
          const isCurrentUser = profile._id === user?._id;
          
          return (
            <div key={profile._id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={profile.profilePicture || '/default-avatar.png'}
                  alt={profile.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{profile.name}</h3>
                  <p className="text-sm text-gray-500">@{profile.username}</p>
                </div>
              </div>
              
              {profile.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{profile.bio}</p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{profile.followers?.length || 0} followers</span>
                <span>{profile.totalPosts || 0} posts</span>
                <span>{profile.totalLikes || 0} likes</span>
              </div>
              
              {!isCurrentUser && (
                <button
                  onClick={() => isFollowing ? handleUnfollow(profile._id) : handleFollow(profile._id)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSections = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex space-x-4">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {trendingData.sections.map((section, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{section._id}</h3>
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                #{index + 1} Trending
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{section.count}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{section.totalLikes}</div>
                <div className="text-sm text-gray-500">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{section.totalComments}</div>
                <div className="text-sm text-gray-500">Comments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{section.totalShares}</div>
                <div className="text-sm text-gray-500">Shares</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Trending Score: <span className="font-semibold">{Math.round(section.trendingScore)}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPosts = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {trendingData.posts.map((post) => (
          <div key={post._id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={post.author?.profilePicture || '/default-avatar.png'}
                alt={post.author?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{post.author?.name}</h3>
                <p className="text-sm text-gray-500">@{post.author?.username}</p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            
            {post.type === 'section' && post.section && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-blue-900">{post.section.title}</h4>
                <p className="text-blue-700 text-sm mt-1">{post.section.description}</p>
                {post.section.category && (
                  <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                    {post.section.category}
                  </span>
                )}
              </div>
            )}
            
            {post.content && (
              <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>❤️ {post.likes?.length || 0}</span>
                <span>💬 {post.comments?.length || 0}</span>
                <span>🔄 {post.shares?.length || 0}</span>
              </div>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                Score: {Math.round(post.trendingScore)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCategories = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trendingData.categories.map((category, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{category._id}</h3>
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                #{index + 1}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{category.postCount}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{category.totalLikes}</div>
                <div className="text-sm text-gray-500">Likes</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Trending Score: <span className="font-semibold">{Math.round(category.trendingScore)}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔥 Trending</h1>
        <p className="text-gray-600">Discover what's popular in the community</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'profiles', label: 'Trending Profiles' },
            { key: 'sections', label: 'Trending Sections' },
            { key: 'posts', label: 'Trending Posts' },
            { key: 'categories', label: 'Trending Categories' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Filter */}
      {activeTab === 'profiles' && (
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'top10', label: 'Top 10' },
              { key: 'top20', label: 'Top 20' },
              { key: 'top50', label: 'Top 50' }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  filter === filterOption.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'profiles' && renderProfiles()}
      {activeTab === 'sections' && renderSections()}
      {activeTab === 'posts' && renderPosts()}
      {activeTab === 'categories' && renderCategories()}
    </div>
  );
}
