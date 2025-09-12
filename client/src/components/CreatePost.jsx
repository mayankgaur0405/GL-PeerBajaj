import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [postType, setPostType] = useState('text');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
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
        postData.section = formData.section;
      }

      if (postType === 'image' && formData.images.length > 0) {
        postData.images = formData.images;
      }

      await api.post('/posts', postData);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
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
      
      if (onPostCreated) {
        onPostCreated();
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
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center space-x-3">
          <img 
            src={user?.profilePicture || '/default-avatar.png'} 
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <button
            onClick={() => setIsOpen(true)}
            className="flex-1 text-left bg-gray-100 rounded-full px-4 py-2 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            What's on your mind?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Create Post</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Post Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
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

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter post title..."
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Write your post content..."
          />
        </div>

        {/* Section-specific fields */}
        {postType === 'section' && (
          <div className="space-y-4 border-t pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={formData.section.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  section: { ...prev.section, title: e.target.value }
                }))}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., React Fundamentals"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.section.category}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  section: { ...prev.section, category: e.target.value }
                }))}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
              <textarea
                value={formData.section.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  section: { ...prev.section, description: e.target.value }
                }))}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe this section/roadmap..."
              />
            </div>

            {/* Resources */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Resources</label>
                <button
                  type="button"
                  onClick={addResource}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Add Resource
                </button>
              </div>
              {formData.section.resources.map((resource, index) => (
                <div key={index} className="border rounded-lg p-3 mb-2 space-y-2">
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
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="Resource title"
                  />
                  <input
                    type="url"
                    value={resource.link}
                    onChange={(e) => updateResource(index, 'link', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="Resource URL"
                  />
                  <input
                    type="text"
                    value={resource.description}
                    onChange={(e) => updateResource(index, 'description', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border rounded-lg px-3 py-2"
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <input
            type="text"
            onKeyPress={addTag}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Press Enter to add tags"
          />
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded flex items-center"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
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
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.title.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
