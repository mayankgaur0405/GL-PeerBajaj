import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';

export default function PostCard({ post, onUpdate, showActions = true }) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likes?.some(like => like._id === user?._id) || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments?.length || 0);
  const [sharesCount, setSharesCount] = useState(post.shares?.length || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = async () => {
    if (!user || isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await api.post(`/posts/${post._id}/like`);
      setIsLiked(res.data.isLiked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error('Failed to like post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await api.post(`/posts/${post._id}/comment`, {
        content: newComment.trim()
      });
      setCommentsCount(prev => prev + 1);
      setNewComment('');
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      const res = await api.post(`/posts/${post._id}/share`);
      setSharesCount(res.data.sharesCount);
    } catch (err) {
      console.error('Failed to share post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPostContent = () => {
    switch (post.type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
        );
      
      case 'section':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">{post.section?.title}</h3>
              <p className="text-blue-700 text-sm mt-1">{post.section?.description}</p>
              {post.section?.category && (
                <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                  {post.section.category}
                </span>
              )}
            </div>
            {post.section?.resources && post.section.resources.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Resources:</h4>
                {post.section.resources.map((resource, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <a 
                      href={resource.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {resource.title || resource.description || 'Resource Link'}
                    </a>
                    {resource.description && (
                      <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {post.content && (
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>
            )}
          </div>
        );
      
      case 'image':
        return (
          <div className="space-y-4">
            {post.images && post.images.length > 0 && (
              <div className="grid gap-2">
                {post.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image.url} 
                      alt={image.caption || `Image ${index + 1}`}
                      className="w-full h-auto rounded-lg object-cover"
                    />
                    {image.caption && (
                      <p className="text-sm text-gray-600 mt-2">{image.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {post.content && (
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="glass-card p-6 space-y-4 hover-glow hover-raise">
      {/* Header */}
      <div className="flex items-center gap-3">
        <img 
          src={post.author?.profilePicture || '/default-avatar.png'} 
          alt={post.author?.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{post.author?.name}</h3>
            {post.author?.isVerified && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300">Verified</span>}
          </div>
          <p className="text-xs text-white/60 truncate">@{post.author?.username}</p>
        </div>
        <span className="text-xs text-white/60">{formatDate(post.createdAt)}</span>
      </div>

      {/* Post Title */}
      {post.title && <h2 className="text-xl font-semibold text-white">{post.title}</h2>}

      {/* Post Content */}
      {renderPostContent()}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 rounded-full border border-white/15 text-white/80"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              disabled={isLoading}
              className={`inline-flex items-center gap-2 ${
                isLiked ? 'text-red-400' : 'text-white/60 hover:text-red-400'
              } transition-colors`}
            >
              <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likesCount}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="inline-flex items-center gap-2 text-white/60 hover:text-blue-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{commentsCount}</span>
            </button>

            <button
              onClick={handleShare}
              disabled={isLoading}
              className="inline-flex items-center gap-2 text-white/60 hover:text-green-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>{sharesCount}</span>
            </button>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-white/10 pt-4 space-y-4">
          {/* Add Comment */}
          {user && (
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Posting...' : 'Post'}
              </button>
            </form>
          )}

          {/* Comments List */}
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <img 
                    src={comment.author?.profilePicture || '/default-avatar.png'} 
                    alt={comment.author?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="rounded-lg p-3 bg-white/5 border border-white/10">
                      <h4 className="font-medium text-sm text-white/90">{comment.author?.name}</h4>
                      <p className="text-sm mt-1 text-white/80">{comment.content}</p>
                    </div>
                    <span className="text-xs text-white/50">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
