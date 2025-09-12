import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';
import PostCard from './PostCard.jsx';

export default function Feed({ type = 'feed', userId = null, filters = {} }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      let endpoint = '/posts';
      let params = {
        page: pageNum,
        limit: 10,
        ...filters
      };

      if (type === 'feed') {
        endpoint = '/posts/feed/posts';
      } else if (type === 'user' && userId) {
        endpoint = `/posts/user/${userId}`;
      }

      const response = await api.get(endpoint, { params });
      const newPosts = response.data.posts || [];

      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setHasMore(newPosts.length === 10);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [type, userId, filters]);

  useEffect(() => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    fetchPosts(1, true);
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, false);
    }
  }, [page, loadingMore, hasMore, fetchPosts]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  const handlePostUpdate = () => {
    // Refresh the first page to get updated posts
    fetchPosts(1, true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-white/20 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-white/20 rounded w-1/4"></div>
              </div>
            </div>
            <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-white/20 rounded"></div>
              <div className="h-4 bg-white/20 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => fetchPosts(1, true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-white/70 mb-4">
          <span className="inline-flex w-14 h-14 items-center justify-center rounded-full bg-white/10">📰</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">No posts yet</h3>
        <p className="text-white/70 text-sm">
          {type === 'feed' 
            ? "Follow some users to see their posts in your feed"
            : "This user hasn't posted anything yet"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="section-header">
        <span className="section-badge">📰</span>
        <h3 className="text-white font-semibold">Your Feed</h3>
      </div>
      {posts.map((post, idx) => (
        <div key={post._id} className="animate-[fadeInUp_.25s_ease-out]" style={{animationDelay: `${idx * 40}ms`, animationFillMode: 'backwards'}}>
          <PostCard 
            post={post} 
            onUpdate={handlePostUpdate}
          />
        </div>
      ))}

      {loadingMore && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-white/80">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/20 border-t-blue-600"></div>
            <span>Loading more posts...</span>
          </div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 text-white/70">
            <span>🎉</span>
            <p>You\'ve reached the end of the feed</p>
          </div>
        </div>
      )}
    </div>
  );
}
