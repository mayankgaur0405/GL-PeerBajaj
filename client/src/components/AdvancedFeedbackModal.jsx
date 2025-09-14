import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';

export default function AdvancedFeedbackModal({ isOpen, onClose, onFeedbackSubmitted }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    role: '',
    issues: '',
    featureRequest: '',
    nonFunctional: '',
    generalFeedback: '',
    deviceInfo: '',
    severity: 'Medium',
    attachments: []
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.role.trim() || !formData.deviceInfo.trim()) {
      alert('Please fill in all required fields (Name, Role, Device Info)');
      return;
    }

    // Check if at least one feedback field is provided
    const hasFeedback = formData.issues || formData.featureRequest || 
                       formData.nonFunctional || formData.generalFeedback;
    if (!hasFeedback) {
      alert('Please provide at least one type of feedback');
      return;
    }

    setLoading(true);
    try {
      await api.post('/feedback', formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted();
        }
        // Reset form
        setFormData({
          name: user?.name || '',
          role: '',
          issues: '',
          featureRequest: '',
          nonFunctional: '',
          generalFeedback: '',
          deviceInfo: '',
          severity: 'Medium',
          attachments: []
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        return {
          filename: file.name,
          url: response.data.url,
          fileType: file.type
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedFiles]
      }));
    } catch (err) {
      console.error('Failed to upload files:', err);
      alert('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Technical Feedback Report</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-white mb-2">Feedback Submitted!</h3>
            <p className="text-white/70">Thank you for your detailed feedback. It will be reviewed by our team.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-white/50"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Your Role/Year *</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-white/50"
                  placeholder="e.g., CSE, Year 3"
                  required
                />
              </div>
            </div>

            {/* Technical Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Device & Browser Info *</label>
                <input
                  type="text"
                  name="deviceInfo"
                  value={formData.deviceInfo}
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-white/50"
                  placeholder="e.g., Chrome on Windows, Safari on iOS"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Severity Level *</label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/20 text-white"
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Structured Feedback Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Issues / Errors in Website</label>
                <textarea
                  name="issues"
                  value={formData.issues}
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-white/50"
                  rows={3}
                  placeholder="Describe the technical issue, steps to reproduce, and error messages if any"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Feature Request / Improvements</label>
                <textarea
                  name="featureRequest"
                  value={formData.featureRequest}
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-white/50"
                  rows={3}
                  placeholder="Suggest any new features or improvements"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Non-Functional / Broken Features</label>
                <textarea
                  name="nonFunctional"
                  value={formData.nonFunctional}
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-white/50"
                  rows={3}
                  placeholder="Mention features that are not working as expected"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">General Feedback / Suggestions</label>
                <textarea
                  name="generalFeedback"
                  value={formData.generalFeedback}
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-white/50"
                  rows={3}
                  placeholder="Share your overall experience"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Screenshot / File Upload</label>
              <div className="space-y-3">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-white/70 text-sm">Uploading files...</p>
                )}
                
                {/* Display uploaded files */}
                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-white/70 text-sm">Uploaded files:</p>
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                        <span className="text-white/80 text-sm">{file.filename}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
