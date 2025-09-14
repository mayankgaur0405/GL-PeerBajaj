import React from 'react';

export default function FeedbackDetailModal({ isOpen, onClose, feedback }) {
  if (!isOpen || !feedback) return null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-400/20';
      case 'High': return 'text-orange-400 bg-orange-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

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
      <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Feedback Details</h2>
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
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center ring-1 ring-white/10">
            {feedback.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">{feedback.name}</h3>
            <p className="text-white/70 text-sm">{feedback.role}</p>
            <p className="text-white/60 text-xs">{formatDate(feedback.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(feedback.severity)}`}>
              {feedback.severity}
            </span>
          </div>
        </div>

        {/* Technical Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="font-medium text-white mb-2">Device & Browser</h4>
            <p className="text-white/80 text-sm">{feedback.deviceInfo}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="font-medium text-white mb-2">Status</h4>
            <span className="text-white/80 text-sm">{feedback.status || 'Pending'}</span>
          </div>
        </div>

        {/* Feedback Sections */}
        <div className="space-y-6">
          {/* Issues / Errors */}
          {feedback.issues && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h4 className="font-medium text-red-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Issues / Errors
              </h4>
              <p className="text-white/90 whitespace-pre-wrap">{feedback.issues}</p>
            </div>
          )}

          {/* Feature Request */}
          {feedback.featureRequest && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="font-medium text-blue-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Feature Request / Improvements
              </h4>
              <p className="text-white/90 whitespace-pre-wrap">{feedback.featureRequest}</p>
            </div>
          )}

          {/* Non-Functional Features */}
          {feedback.nonFunctional && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <h4 className="font-medium text-orange-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 00-1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                Non-Functional / Broken Features
              </h4>
              <p className="text-white/90 whitespace-pre-wrap">{feedback.nonFunctional}</p>
            </div>
          )}

          {/* General Feedback */}
          {feedback.generalFeedback && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="font-medium text-green-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                General Feedback / Suggestions
              </h4>
              <p className="text-white/90 whitespace-pre-wrap">{feedback.generalFeedback}</p>
            </div>
          )}

          {/* Legacy text field for backward compatibility */}
          {feedback.text && !feedback.issues && !feedback.featureRequest && !feedback.nonFunctional && !feedback.generalFeedback && (
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="font-medium text-white mb-3">Feedback</h4>
              <p className="text-white/90 whitespace-pre-wrap">{feedback.text}</p>
            </div>
          )}
        </div>

        {/* Attachments */}
        {feedback.attachments && feedback.attachments.length > 0 && (
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="font-medium text-white mb-3">Attachments</h4>
            <div className="space-y-2">
              {feedback.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-white/80 text-sm">{attachment.filename}</span>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

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
