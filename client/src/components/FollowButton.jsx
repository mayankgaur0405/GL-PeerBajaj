import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';
import { FaUserPlus, FaUserMinus } from 'react-icons/fa';

export default function FollowButton({ userId, isFollowing: initialFollowing, onFollowChange }) {
  const { user, updateUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  // Don't show follow button for own posts
  if (user?._id === userId) {
    return null;
  }

  const handleFollow = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      if (isFollowing) {
        await api.delete(`/follow/${userId}`);
        setIsFollowing(false);
        
        // Update user context
        if (updateUser) {
          updateUser(prev => ({
            ...prev,
            following: prev.following?.filter(id => id !== userId) || []
          }));
        }
        
        onFollowChange?.(false);
      } else {
        await api.post(`/follow/${userId}`);
        setIsFollowing(true);
        
        // Update user context
        if (updateUser) {
          updateUser(prev => ({
            ...prev,
            following: [...(prev.following || []), userId]
          }));
        }
        
        onFollowChange?.(true);
      }
    } catch (error) {
      console.error('Failed to follow/unfollow user:', error);
      alert('Failed to follow/unfollow user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
        ${isFollowing
          ? 'bg-white/10 text-white hover:bg-white/20'
          : 'bg-blue-600 text-white hover:bg-blue-700'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : isFollowing ? (
        <>
          <FaUserMinus className="w-3 h-3" />
          Following
        </>
      ) : (
        <>
          <FaUserPlus className="w-3 h-3" />
          Follow
        </>
      )}
    </button>
  );
}


