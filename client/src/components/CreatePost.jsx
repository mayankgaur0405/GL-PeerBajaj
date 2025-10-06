import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [postType, setPostType] = useState('text');
  const [formData, setFormData] = useState({
    section: {
      title: '',
      description: '',
      category: '',
      resources: [{ title: '', link: '', description: '' }] // Initialize with one empty resource
    },
    images: [],
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    'DSA', 'Web Dev', 'Mobile Dev', 'AI/ML', 'DevOps', 
    'Data Science', 'Cybersecurity', 'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.section.title.trim()) return;

    setLoading(true);
    try {
      const postData = {
        type: postType,
        title: formData.section.title, // Use section title as main title
        content: formData.section.description, // Use section description as content
        tags: formData.tags.filter(tag => tag.trim())
      };

      if (postType === 'section') {
        // Filter out empty resources before submitting
        const filteredResources = formData.section.resources.filter(resource => 
          resource.title.trim() || resource.link.trim() || resource.description.trim()
        );
        postData.section = {
          ...formData.section,
          resources: filteredResources
        };
      }

      if (postType === 'image' && formData.images.length > 0) {
        postData.images = formData.images;
      }

      const response = await api.post('/posts', postData);
      const { postId, postType: createdPostType } = response.data;
      
      // Show success notification
      const postTypeNames = {
        'text': 'Blog post',
        'section': 'Roadmap',
        'image': 'Image post'
      };
      
      // Show success notification
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset form
      resetForm();
      setIsOpen(false);
      
      // Call the callback if provided
      if (onPostCreated) {
        onPostCreated();
      }
      
      // Redirect to the newly created post's detail page
      const routeMap = {
        'text': 'blog',
        'section': 'roadmap',
        'image': 'image'
      };
      
      const routeType = routeMap[createdPostType];
      if (routeType && postId) {
        setTimeout(() => {
          navigate(`/${routeType}/${postId}`);
        }, 1500); // 1.5 second delay to show success notification
      } else {
        // Fallback to profile page if route doesn't exist
        if (user && user._id) {
          setTimeout(() => {
            navigate(`/profile/${user._id}`);
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Failed to create post:', err);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...response.data.images]
      }));
    } catch (err) {
      console.error('Failed to upload images:', err);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      section: {
        ...prev.section,
        resources: [...prev.section.resources, { title: '', link: '', description: '' }]
      }
    }));
  };

  const updateResource = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      section: {
        ...prev.section,
        resources: prev.section.resources.map((resource, i) => 
          i === index ? { ...resource, [field]: value } : resource
        )
      }
    }));
  };

  const removeResource = (index) => {
    setFormData(prev => ({
      ...prev,
      section: {
        ...prev.section,
        resources: prev.section.resources.filter((_, i) => i !== index)
      }
    }));
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (!formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const resetForm = () => {
    setFormData({
      section: {
        title: '',
        description: '',
        category: '',
        resources: [{ title: '', link: '', description: '' }]
      },
      images: [],
      tags: []
    });
    setPostType('text');
  };

  if (!isOpen) {
    return (
      <>
        {/* Success Notification */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fadeInUp">
            <span className="text-xl">✅</span>
            <span className="font-medium">
              {postType === 'text' ? 'Blog post' : 
               postType === 'section' ? 'Roadmap' : 
               'Image post'} created successfully!
            </span>
          </div>
        )}
        
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3">
            <img 
              src={user?.profilePicture || '/default-avatar.svg'} 
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <button
              onClick={() => setIsOpen(true)}
              className="flex-1 text-left bg-white/10 rounded-full px-4 py-2 text-white/60 hover:bg-white/20 transition-colors"
            >
              What's on your mind?
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fadeInUp">
          <span className="text-xl">✅</span>
          <span className="font-medium">
            {postType === 'text' ? 'Blog post' : 
             postType === 'section' ? 'Roadmap' : 
             'Image post'} created successfully!
          </span>
        </div>
      )}
      
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Create Post</h2>
          <button
            onClick={() => {
              setIsOpen(false);
              resetForm();
            }}
            className="text-white/60 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Post Type Selection */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Post Type</label>
          <div className="flex space-x-4">
            {[
              { value: 'text', label: 'Text/Blog' },
              { value: 'section', label: 'Section/Roadmap' },
              { value: 'image', label: 'Image' }
            ].map(type => (
              <label key={type.value} className="flex items-center">
                <input
                  type="radio"
                  value={type.value}
                  checked={postType === type.value}
                  onChange={(e) => setPostType(e.target.value)}
                  className="mr-2"
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>


        {/* Post Title and Content - Available for all post types */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Post Title *</label>
          <input
            type="text"
            value={formData.section.title}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              section: { ...prev.section, title: e.target.value }
            }))}
            className="w-full rounded-lg px-3 py-2"
            placeholder="Enter post title..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Post Content</label>
          <textarea
            value={formData.section.description}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              section: { ...prev.section, description: e.target.value }
            }))}
            className="w-full rounded-lg px-3 py-2"
            rows={4}
            placeholder="Write your post content... (supports line breaks and formatting)"
          />
        </div>

        {/* Category - Available for all post types */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
          <select
            value={formData.section.category}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              section: { ...prev.section, category: e.target.value }
            }))}
            className="w-full rounded-lg px-3 py-2"
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Resources - Available for all post types */}
        <div className="space-y-4 border-t pt-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-white/80">
                Resources {postType === 'section' && <span className="text-red-400">*</span>}
              </label>
              <button
                type="button"
                onClick={addResource}
                className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>+</span>
                <span>Add Another Resource</span>
              </button>
            </div>
            
            {/* Always show at least one resource field */}
            <div className="glass-card p-4 mb-3 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-white">Resource 1</h4>
                  {postType === 'section' && (
                    <span className="text-xs text-red-400">Required</span>
                  )}
                </div>
                {formData.section.resources.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeResource(0)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                    title="Remove resource"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-white/70 mb-1">Resource Title</label>
                  <input
                    type="text"
                    value={formData.section.resources[0]?.title || ''}
                    onChange={(e) => updateResource(0, 'title', e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none"
                    placeholder="Enter resource title"
                    required={postType === 'section'}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/70 mb-1">Resource URL</label>
                  <input
                    type="url"
                    value={formData.section.resources[0]?.link || ''}
                    onChange={(e) => updateResource(0, 'link', e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none"
                    placeholder="https://example.com"
                    required={postType === 'section'}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/70 mb-1">Description (Optional)</label>
                  <input
                    type="text"
                    value={formData.section.resources[0]?.description || ''}
                    onChange={(e) => updateResource(0, 'description', e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none"
                    placeholder="Brief description of the resource"
                  />
                </div>
              </div>
            </div>

            {/* Show additional resources if any */}
            {formData.section.resources.slice(1).map((resource, index) => (
              <div key={index + 1} className="glass-card p-4 mb-3 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white">Resource {index + 2}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeResource(index + 1)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                    title="Remove resource"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-white/70 mb-1">Resource Title</label>
                    <input
                      type="text"
                      value={resource.title}
                      onChange={(e) => updateResource(index + 1, 'title', e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none"
                      placeholder="Enter resource title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/70 mb-1">Resource URL</label>
                    <input
                      type="url"
                      value={resource.link}
                      onChange={(e) => updateResource(index + 1, 'link', e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/70 mb-1">Description (Optional)</label>
                    <input
                      type="text"
                      value={resource.description}
                      onChange={(e) => updateResource(index + 1, 'description', e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none"
                      placeholder="Brief description of the resource"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {/* Helper text */}
            <div className="text-xs text-white/60 mt-2">
              {postType === 'section' 
                ? "At least one resource is required for roadmap/section posts to provide helpful links."
                : "Add helpful resources and links to make your post more valuable to readers."
              }
            </div>
          </div>
        </div>

        {/* Image upload */}
        {postType === 'image' && (
          <div className="space-y-4 border-t pt-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full rounded-lg px-3 py-2"
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-white/60 mt-1">Uploading...</p>}
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Tags</label>
          <input
            type="text"
            onKeyPress={addTag}
            className="w-full rounded-lg px-3 py-2"
            placeholder="Press Enter to add tags"
          />
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-white/10 text-white text-sm px-2 py-1 rounded flex items-center"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-white/70 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/10 text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.section.title.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 btn-glow"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
      </div>
    </>
  );
}
