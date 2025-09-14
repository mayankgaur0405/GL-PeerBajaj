import React from 'react';

export default function QuickFeedbackDetailModal({ isOpen, onClose, feedback }) {
  if (!isOpen || !feedback) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Quick Feedback Details</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
            {feedback.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-lg">{feedback.name}</h3>
            <p className="text-white/70">{feedback.role}</p>
            <p className="text-white/60 text-sm">{formatDate(feedback.createdAt)}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="p-4 bg-white/5 rounded-lg">
          <h4 className="font-medium text-white mb-3">Rating</h4>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <span
                key={idx}
                className={`text-2xl ${
                  idx < (feedback.rating || 0)
                    ? 'text-yellow-400'
                    : 'text-white/20'
                }`}
              >
                ⭐
              </span>
            ))}
            <span className="ml-3 text-white/70 text-sm">
              {feedback.rating}/5 stars
            </span>
          </div>
        </div>

        {/* Feedback Content */}
        <div className="p-4 bg-white/5 rounded-lg">
          <h4 className="font-medium text-white mb-3">Feedback</h4>
          <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
            {feedback.text}
          </p>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
