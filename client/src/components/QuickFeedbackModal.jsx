import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';

export default function QuickFeedbackModal({ isOpen, onClose, onFeedbackSubmitted }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    role: '',
    text: '',
    rating: 5
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.role.trim() || !formData.text.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Submit as quick feedback type
      const feedbackData = {
        ...formData,
        type: 'quick' // Mark as quick feedback
      };
      
      console.log('Submitting quick feedback:', feedbackData); // Debug log
      const response = await api.post('/feedback', feedbackData);
      console.log('Quick feedback response:', response.data); // Debug log
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
          text: '',
          rating: 5
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      const errorMessage = err.response?.data?.message || 'Failed to submit feedback. Please try again.';
      alert(`Error: ${errorMessage}`);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-md w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Quick Feedback</h2>
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
            <p className="text-white/70">Thank you for your quick feedback!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Your Role/Year *</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm"
                  placeholder="e.g., CSE, Year 3"
                  required
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Rating *</label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: idx + 1 }))}
                    className={`text-2xl transition-colors ${
                      idx < formData.rating ? 'text-yellow-400' : 'text-white/20'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Text */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Your Feedback *</label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleChange}
                className="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm"
                rows={4}
                placeholder="Share your thoughts about the platform..."
                required
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 text-sm"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
