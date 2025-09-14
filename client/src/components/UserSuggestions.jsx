import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';
import { useNavigate } from 'react-router-dom';

export default function UserSuggestions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(new Set());

  useEffect(() => {
    fetchSuggestions();
    if (user) {
      setFollowing(new Set(user.following?.map(f => f._id) || []));
    }
  }, [user]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/suggest?limit=4');
      setSuggestions(response.data.users || []);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await api.post(`/users/${userId}/follow`);
      setFollowing(prev => new Set([...prev, userId]));
    } catch (err) {
      console.error('Failed to follow user:', err);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await api.post(`/users/${userId}/unfollow`);
      setFollowing(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    } catch (err) {
      console.error('Failed to unfollow user:', err);
    }
  };

  const handleShuffle = () => {
    fetchSuggestions();
  };

  if (loading) {
    return (
      <div className="bg-white/10 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Suggested for you</h3>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-white/20 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-white/20 rounded w-1/2"></div>
              </div>
              <div className="w-16 h-8 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="glass-card p-6 hover-glow hover-raise">
        <h3 className="text-white text-lg font-semibold mb-4">Suggested for you</h3>
        <p className="text-white/60 text-center py-4">No suggestions available</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 hover-glow hover-raise">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">Suggested for you</h3>
        <button onClick={handleShuffle} className="text-sm text-blue-400 hover:text-blue-300 font-medium">Shuffle</button>
      </div>
      
      <div className="space-y-3">
        {suggestions.map((suggestion) => {
          const isFollowing = following.has(suggestion._id);
          const isCurrentUser = suggestion._id === user?._id;
          
          return (
            <div
              key={suggestion._id}
              className="flex items-center space-x-3 transition transform hover:scale-[1.01] cursor-pointer"
              onClick={() => navigate(`/profile/${suggestion._id}`)}
            >
              <img
                src={suggestion.profilePicture || '/default-avatar.svg'}
                alt={suggestion.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm truncate">{suggestion.name}</h4>
                <p className="text-xs text-white/60 truncate">@{suggestion.username}</p>
                {suggestion.bio && (
                  <p className="text-xs text-white/60 truncate mt-1">{suggestion.bio}</p>
                )}
              </div>
              {!isCurrentUser && (
                <button
                  onClick={(e) => { e.stopPropagation(); isFollowing ? handleUnfollow(suggestion._id) : handleFollow(suggestion._id); }}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-colors btn-glow ${
                    isFollowing
                      ? 'bg-white/20 text-white hover:bg-white/30'
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
    </div>
  );
}
