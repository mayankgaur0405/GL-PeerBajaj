import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';
import { FaUserMinus, FaUserPlus } from 'react-icons/fa';

export default function FollowingList({ userId, isOwnProfile }) {
  const { user } = useAuth();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFollowing();
  }, [userId]);

  const fetchFollowing = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/follow/${userId}/following`);
      setFollowing(response.data.following);
    } catch (error) {
      console.error('Failed to fetch following:', error);
      setError('Failed to load following list');
    } finally {
      setLoading(false);
    }
  };

  const unfollowUser = async (userId) => {
    try {
      await api.delete(`/follow/${userId}`);
      setFollowing(prev => prev.filter(f => f._id !== userId));
    } catch (error) {
      console.error('Failed to unfollow user:', error);
      alert('Failed to unfollow user');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg animate-pulse">
            <div className="w-10 h-10 bg-white/20 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-white/20 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchFollowing}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (following.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
          <FaUserPlus className="w-8 h-8 text-white/50" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Not following anyone</h3>
        <p className="text-white/70">
          {isOwnProfile 
            ? "Start following users to see their posts in your feed."
            : "This user is not following anyone yet."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {following.map((followedUser) => (
        <div key={followedUser._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <img
              src={followedUser.profilePicture || '/default-avatar.svg'}
              alt={followedUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h4 className="font-medium text-white">{followedUser.name}</h4>
              <p className="text-sm text-white/70">@{followedUser.username}</p>
              {followedUser.bio && (
                <p className="text-xs text-white/60 mt-1 line-clamp-1">{followedUser.bio}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <button
                onClick={() => unfollowUser(followedUser._id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                title="Unfollow"
              >
                <FaUserMinus className="w-4 h-4" />
              </button>
            ) : followedUser._id !== user?._id && (
              <button
                onClick={() => window.location.href = `/profile/${followedUser._id}`}
                className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                View Profile
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


