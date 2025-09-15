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
      resources: []
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
        postData.section = formData.section;
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
      setFormData({
        section: {
          title: '',
          description: '',
          category: '',
          resources: []
        },
        images: [],
        tags: []
      });
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
            onClick={() => setIsOpen(false)}
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

        {/* Section-specific fields */}
        {postType === 'section' && (
          <div className="space-y-4 border-t pt-4">

            {/* Resources */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-white/80">Resources</label>
                <button
                  type="button"
                  onClick={addResource}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Add Resource
                </button>
              </div>
              {formData.section.resources.map((resource, index) => (
                <div key={index} className="glass-card p-3 mb-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Resource {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeResource(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={resource.title}
                    onChange={(e) => updateResource(index, 'title', e.target.value)}
                    className="w-full rounded px-2 py-1 text-sm"
                    placeholder="Resource title"
                  />
                  <input
                    type="url"
                    value={resource.link}
                    onChange={(e) => updateResource(index, 'link', e.target.value)}
                    className="w-full rounded px-2 py-1 text-sm"
                    placeholder="Resource URL"
                  />
                  <input
                    type="text"
                    value={resource.description}
                    onChange={(e) => updateResource(index, 'description', e.target.value)}
                    className="w-full rounded px-2 py-1 text-sm"
                    placeholder="Description (optional)"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
