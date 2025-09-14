import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';
import PostCard from '../components/PostCard.jsx';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const response = await api.get(`/posts/${id}`);
        setPost(response.data.post);
      } catch (err) {
        console.error('Failed to fetch post:', err);
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handlePostUpdate = (updatedPost) => {
    setPost(updatedPost);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 text-center">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-1/4 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Post Not Found</h2>
          <p className="text-white/70 mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <PostCard 
        post={post} 
        onUpdate={handlePostUpdate}
        showActions={true}
        showFollowButton={true}
      />
    </div>
  );
}

