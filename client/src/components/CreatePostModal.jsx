import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [postType, setPostType] = useState('text');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    section: {
      title: '',
      description: '',
      category: '',
      resources: []
    }
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    'DSA', 'Web Dev', 'Mobile Dev', 'AI/ML', 'DevOps', 
    'Data Science', 'Cybersecurity', 'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      const postData = {
        type: postType,
        title: formData.title,
        content: formData.content,
        tags: formData.tags.filter(tag => tag.trim())
      };

      if (postType === 'section') {
        postData.section = {
          ...formData.section,
          title: formData.title,
          description: formData.content,
          category: formData.category || undefined, // Don't send empty string
          resources: formData.section.resources.filter(resource => 
            resource.title.trim() && resource.link.trim()
          ) // Only include resources with both title and link
        };
      }

      if (postType === 'image' && images.length > 0) {
        postData.images = images;
      }

      const response = await api.post('/posts', postData);
      const { postId, postType: createdPostType } = response.data;
      
      // Show success notification
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        tags: [],
        section: {
          title: '',
          description: '',
          category: '',
          resources: []
        }
      });
      setImages([]);
      setPostType('text');
      
      // Call the callback if provided
      if (onPostCreated) {
        onPostCreated();
      }
      
      // Close modal
      onClose();
      
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

      setImages(prev => [...prev, ...response.data.images]);
    } catch (err) {
      console.error('Failed to upload images:', err);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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

  if (!isOpen) return null;

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
      
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Create Post</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Post Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Post Type</label>
            <div className="flex space-x-6">
              {[
                { value: 'text', label: 'Text/Blog' },
                { value: 'section', label: 'Section/Roadmap' },
                { value: 'image', label: 'Image' }
              ].map(type => (
                <label key={type.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value={type.value}
                    checked={postType === type.value}
                    onChange={(e) => setPostType(e.target.value)}
                    className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                  />
                  <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Post Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Post Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter post title..."
              required
            />
          </div>

          {/* Post Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Post Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full rounded-lg px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Write your post content... (supports line breaks and formatting)"
            />
          </div>

          {/* Category - Only for Section/Roadmap posts */}
          {postType === 'section' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
              <select
                value={formData.section.category}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  section: { ...prev.section, category: e.target.value }
                }))}
                className="w-full rounded-lg px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          )}

          {/* Resources for Section/Roadmap posts */}
          {postType === 'section' && (
            <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Resources</label>
                  <button
                    type="button"
                    onClick={addResource}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Resource
                  </button>
                </div>
                {formData.section.resources.map((resource, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg mb-3 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-slate-700 dark:text-slate-300">Resource {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeResource(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={resource.title}
                      onChange={(e) => updateResource(index, 'title', e.target.value)}
                      className="w-full rounded-lg px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Resource title"
                    />
                    <input
                      type="url"
                      value={resource.link}
                      onChange={(e) => updateResource(index, 'link', e.target.value)}
                      className="w-full rounded-lg px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Resource URL"
                    />
                    <input
                      type="text"
                      value={resource.description}
                      onChange={(e) => updateResource(index, 'description', e.target.value)}
                      className="w-full rounded-lg px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description (optional)"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image upload for image posts */}
          {postType === 'image' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full rounded-lg px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Uploading...</p>}
              
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {images.map((image, index) => (
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tags</label>
            <input
              type="text"
              onKeyPress={addTag}
              className="w-full rounded-lg px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Press Enter to add tags"
            />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full flex items-center"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
