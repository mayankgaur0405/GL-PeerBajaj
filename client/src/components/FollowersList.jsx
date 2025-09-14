import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';
import { FaUserMinus, FaUserPlus, FaTimes } from 'react-icons/fa';

export default function FollowersList({ userId, isOwnProfile }) {
  const { user } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(null);

  useEffect(() => {
    fetchFollowers();
  }, [userId]);

  const fetchFollowers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/follow/${userId}/followers`);
      setFollowers(response.data.followers);
    } catch (error) {
      console.error('Failed to fetch followers:', error);
      setError('Failed to load followers');
    } finally {
      setLoading(false);
    }
  };

  const removeFollower = async (followerId) => {
    try {
      await api.delete(`/follow/remove-follower/${followerId}`);
      setFollowers(prev => prev.filter(f => f._id !== followerId));
      setShowConfirmModal(null);
    } catch (error) {
      console.error('Failed to remove follower:', error);
      alert('Failed to remove follower');
    }
  };

  const followUser = async (userId) => {
    try {
      await api.post(`/follow/${userId}`);
      // Update the follower's following status in the list
      setFollowers(prev => 
        prev.map(f => 
          f._id === userId 
            ? { ...f, isFollowing: true }
            : f
        )
      );
    } catch (error) {
      console.error('Failed to follow user:', error);
      alert('Failed to follow user');
    }
  };

  const unfollowUser = async (userId) => {
    try {
      await api.delete(`/follow/${userId}`);
      setFollowers(prev => 
        prev.map(f => 
          f._id === userId 
            ? { ...f, isFollowing: false }
            : f
        )
      );
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
          onClick={fetchFollowers}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (followers.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
          <FaUserMinus className="w-8 h-8 text-white/50" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No followers yet</h3>
        <p className="text-white/70">This user doesn't have any followers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {followers.map((follower) => (
        <div key={follower._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <img
              src={follower.profilePicture || '/default-avatar.svg'}
              alt={follower.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h4 className="font-medium text-white">{follower.name}</h4>
              <p className="text-sm text-white/70">@{follower.username}</p>
              {follower.bio && (
                <p className="text-xs text-white/60 mt-1 line-clamp-1">{follower.bio}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <button
                onClick={() => setShowConfirmModal(follower._id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                title="Remove follower"
              >
                <FaUserMinus className="w-4 h-4" />
              </button>
            ) : follower._id !== user?._id && (
              <button
                onClick={() => follower.isFollowing ? unfollowUser(follower._id) : followUser(follower._id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  follower.isFollowing
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {follower.isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Remove Follower
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to remove this follower? They will no longer be able to see your posts.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => removeFollower(showConfirmModal)}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


