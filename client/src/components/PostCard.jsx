import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';
import EditPost from './EditPost.jsx';
import DeleteConfirmation from './DeleteConfirmation.jsx';
import FollowButton from './FollowButton.jsx';

export default function PostCard({ post, onUpdate, showActions = true, showFollowButton = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.likes?.some(like => like._id === user?._id || like === user?._id) || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments?.length || 0);
  const [sharesCount, setSharesCount] = useState(post.shares?.length || 0);
  const [isShared, setIsShared] = useState(post.shares?.some(share => share.user?._id === user?._id || share.user === user?._id) || false);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [deletingComment, setDeletingComment] = useState(null);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [showHeart, setShowHeart] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content, maxLength = 200) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getDisplayContent = (content) => {
    if (!content) return '';
    return isExpanded ? content : truncateContent(content);
  };

  const handlePostClick = () => {
    const routeMap = {
      'text': 'blog',
      'section': 'roadmap',
      'image': 'image'
    };
    
    const routeType = routeMap[post.type];
    if (routeType) {
      navigate(`/${routeType}/${post._id}`);
    }
  };

  const handleLike = async () => {
    if (!user || isLoading) return;
    
    console.log('Liking post:', post._id, 'User:', user._id);
    setIsLoading(true);
    try {
      const res = await api.post(`/posts/${post._id}/like`);
      console.log('Like response:', res.data);
      setIsLiked(res.data.isLiked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error('Failed to like post:', err);
      // Show user-friendly error message
      alert('Failed to like post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerLikeWithAnim = () => {
    // Avoid spamming like while a request is in flight
    if (isLoading) return;
    handleLike();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 650);
  };

  const handleDoubleClick = () => {
    triggerLikeWithAnim();
  };

  const handleTouchEnd = () => {
    const now = Date.now();
    if (now - lastTapTime < 300) {
      triggerLikeWithAnim();
    }
    setLastTapTime(now);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim() || isLoading) return;

    console.log('Adding comment to post:', post._id, 'Content:', newComment.trim());
    setIsLoading(true);
    try {
      const res = await api.post(`/posts/${post._id}/comment`, {
        content: newComment.trim()
      });
      console.log('Comment response:', res.data);
      setCommentsCount(prev => prev + 1);
      setNewComment('');
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!user || isLoading) return;

    // Generate shareable link
    const postUrl = `${window.location.origin}/blog/${post._id}`;
    const shareText = `Check out this post: "${post.section?.title || post.title || 'Untitled Post'}"`;
    
    // Try to use native sharing if available (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.section?.title || post.title || 'Untitled Post',
          text: shareText,
          url: postUrl
        });
        
        // Track the share
        await trackShare();
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Native sharing failed:', err);
        }
      }
    }
    
    // Fallback: Copy to clipboard and show options
    try {
      await navigator.clipboard.writeText(`${shareText}\n${postUrl}`);
      
      // Show share options modal
      setShowShareModal(true);
      
      // Track the share
      await trackShare();
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback: show the link in an alert
      alert(`Share this post:\n\n${shareText}\n${postUrl}`);
    }
  };

  const trackShare = async () => {
    try {
      const res = await api.post(`/posts/${post._id}/share`);
      setSharesCount(res.data.sharesCount);
    } catch (err) {
      console.error('Failed to track share:', err);
      // Don't show error to user for tracking
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user || deletingComment) return;

    console.log('Deleting comment:', commentId, 'from post:', post._id);
    setDeletingComment(commentId);
    try {
      const response = await api.delete(`/posts/${post._id}/comments/${commentId}`);
      console.log('Delete comment response:', response.data);
      setCommentsCount(prev => prev - 1);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Failed to delete comment:', err);
      console.error('Error details:', err.response?.data);
      if (err.response?.status === 403) {
        alert('You are not authorized to delete this comment.');
      } else if (err.response?.status === 404) {
        alert('Comment not found.');
      } else {
        alert('Failed to delete comment. Please try again.');
      }
    } finally {
      setDeletingComment(null);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/posts/${post._id}`);
      setShowDeleteConfirm(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwnPost = user && user._id === post.author?._id;

  const renderPostContent = () => {
    const content = post.content || '';
    const shouldShowToggle = content.length > 200;
    const displayContent = getDisplayContent(content);

    switch (post.type) {
      case 'text':
        return (
          <div className="space-y-3">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-white/90 leading-relaxed">{displayContent}</pre>
            </div>
            {shouldShowToggle && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                {isExpanded ? 'Show Less' : 'See More'}
              </button>
            )}
          </div>
        );
      
      case 'section':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50/10 border border-blue-200/20 p-4 rounded-lg">
              <div className="space-y-3">
                <p className="text-blue-100 text-sm mt-1 whitespace-pre-wrap font-sans leading-relaxed">{displayContent}</p>
                {shouldShowToggle && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    {isExpanded ? 'Show Less' : 'See More'}
                  </button>
                )}
              </div>
              {post.section?.category && (
                <span className="inline-block bg-blue-600/20 text-blue-300 text-xs px-2 py-1 rounded mt-2">
                  {post.section.category}
                </span>
              )}
            </div>
            
            {/* Resources Section with Toggle */}
            {post.section?.resources && post.section.resources.length > 0 && (
              <div className="space-y-3">
                <button
                  onClick={() => setShowResources(!showResources)}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors group"
                >
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${showResources ? 'rotate-90' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>See Resources ({post.section.resources.length})</span>
                </button>
                
                {showResources && (
                  <div className="space-y-2 animate-fadeIn">
                    {post.section.resources.map((resource, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 p-3 rounded hover:bg-white/10 transition-colors">
                        <a 
                          href={resource.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 hover:underline block"
                        >
                          {resource.title || resource.description || 'Resource Link'}
                        </a>
                        {resource.description && resource.title && (
                          <p className="text-sm text-white/70 mt-1">{resource.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
                      <p className="text-sm text-white/70 mt-2">{image.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {content && (
              <div className="space-y-3">
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-white/90 leading-relaxed">{displayContent}</pre>
                </div>
                {shouldShowToggle && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    {isExpanded ? 'Show Less' : 'See More'}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  // If editing, show edit form
  if (isEditing) {
    return (
      <EditPost
        post={post}
        onUpdate={handleEditSuccess}
        onCancel={handleEditCancel}
      />
    );
  }

  return (
    <>
      <div className="glass-card p-6 space-y-4 hover-glow hover-raise">
        {/* Header */}
        <div className="flex items-center gap-3">
          <img 
            src={post.author?.profilePicture || '/default-avatar.svg'} 
            alt={post.author?.name}
            className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all"
            onClick={() => navigate(`/profile/${post.author?._id}`)}
            title="View profile"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 
                className="font-semibold truncate cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => navigate(`/profile/${post.author?._id}`)}
                title="View profile"
              >
                {post.author?.name}
              </h3>
              {post.author?.isVerified && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300">Verified</span>}
            </div>
            <p 
              className="text-xs text-white/60 truncate cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => navigate(`/profile/${post.author?._id}`)}
              title="View profile"
            >
              @{post.author?.username}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">{formatDate(post.createdAt)}</span>
            {showFollowButton && !isOwnPost && (
              <FollowButton 
                userId={post.author?._id}
                isFollowing={user?.following?.includes(post.author?._id)}
              />
            )}
            {isOwnPost && showActions && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleEdit}
                  className="p-1 text-white/60 hover:text-blue-400 transition-colors"
                  title="Edit post"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1 text-white/60 hover:text-red-400 transition-colors"
                  title="Delete post"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Title - Use section title as main heading */}
        <h2 
          className="text-xl font-semibold text-white cursor-pointer hover:text-blue-400 transition-colors"
          onClick={handlePostClick}
        >
          {post.section?.title || post.title || 'Untitled Post'}
        </h2>

        {/* Post Content with double-tap like */}
        <div className="relative" onDoubleClick={handleDoubleClick} onTouchEnd={handleTouchEnd}>
          {renderPostContent()}
          {showHeart && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <svg className="w-20 h-20 text-red-500 opacity-90 animate-ping" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.462 2.25 9a4.5 4.5 0 018.59-1.657h.318A4.5 4.5 0 0119.75 9c0 3.462-2.438 6.36-4.739 8.507a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.003-.003.002a.75.75 0 01-.698 0l-.003-.002z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30 transition-colors"
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
                } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{isLoading ? '...' : likesCount}</span>
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
                className="inline-flex items-center gap-2 text-white/60 hover:text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>{isLoading ? '...' : sharesCount}</span>
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
                {post.comments.map((comment) => {
                  const isCommentAuthor = user && comment.author?._id === user._id;
                  const isPostAuthor = user && post.author?._id === user._id;
                  const canDelete = isCommentAuthor || isPostAuthor;
                  
                  return (
                    <div key={comment._id} className="flex gap-3">
                      <img 
                        src={comment.author?.profilePicture || '/default-avatar.svg'} 
                        alt={comment.author?.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="rounded-lg p-3 bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm text-white/90">{comment.author?.name}</h4>
                            {canDelete && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                disabled={deletingComment === comment._id}
                                className="text-white/40 hover:text-red-400 transition-colors disabled:opacity-50"
                                title="Delete comment"
                              >
                                {deletingComment === comment._id ? (
                                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                )}
                              </button>
                            )}
                          </div>
                          <p className="text-sm mt-1 text-white/80">{comment.content}</p>
                        </div>
                        <span className="text-xs text-white/50">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Share Post</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-white/80 text-sm mb-2">Post link copied to clipboard!</p>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="text-white text-sm font-medium mb-1">
                    {post.section?.title || post.title || 'Untitled Post'}
                  </p>
                  <p className="text-white/60 text-xs break-all">
                    {window.location.origin}/blog/{post._id}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-white/80 text-sm">Share via:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/blog/${post._id}`;
                      const text = `Check out this post: "${post.section?.title || post.title || 'Untitled Post'}"`;
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                      setShowShareModal(false);
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/blog/${post._id}`;
                      const text = `Check out this post: "${post.section?.title || post.title || 'Untitled Post'}"`;
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
                      setShowShareModal(false);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Facebook
                  </button>
                </div>
                <button
                  onClick={() => {
                    // Navigate to chat with post link
                    const url = `${window.location.origin}/blog/${post._id}`;
                    const text = `Check out this post: "${post.section?.title || post.title || 'Untitled Post'}"`;
                    navigate(`/chat?message=${encodeURIComponent(`${text}\n${url}`)}`);
                    setShowShareModal(false);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Share via Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
