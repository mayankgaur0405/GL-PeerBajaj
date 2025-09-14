import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../lib/api.js';
import FeedbackDetailModal from './FeedbackDetailModal.jsx';

export default function FeedbackCarousel({ onFeedbackSubmitted }) {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Fallback static feedback
  const staticFeedback = [
    { 
      _id: '1',
      name: 'Aarav Sharma', 
      role: 'CSE, Year 3', 
      issues: 'Login page sometimes takes too long to load',
      featureRequest: 'Would love to see dark mode toggle',
      nonFunctional: 'Search functionality not working on mobile',
      generalFeedback: 'Great platform overall, very helpful for studies',
      severity: 'Medium',
      deviceInfo: 'Chrome on Windows',
      createdAt: new Date().toISOString()
    },
    { 
      _id: '2',
      name: 'Isha Verma', 
      role: 'ECE, Year 2', 
      issues: 'File upload fails for large PDFs',
      featureRequest: 'Need better organization of study materials',
      nonFunctional: 'Notifications not showing properly',
      generalFeedback: 'Clean UI and easy to navigate',
      severity: 'High',
      deviceInfo: 'Safari on iOS',
      createdAt: new Date().toISOString()
    },
    { 
      _id: '3',
      name: 'Rohit Mehra', 
      role: 'AIML, Year 4', 
      issues: 'Chat messages sometimes disappear',
      featureRequest: 'Add video call feature for study groups',
      nonFunctional: 'Profile picture upload not working',
      generalFeedback: 'Excellent community support and resources',
      severity: 'Low',
      deviceInfo: 'Firefox on Linux',
      createdAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Auto-rotate carousel every 6 seconds
  useEffect(() => {
    if (feedback.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % feedback.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [feedback.length]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await api.get('/feedback?limit=10');
      setFeedback(response.data.feedback);
    } catch (err) {
      console.error('Failed to fetch feedback:', err);
      // Use static feedback as fallback
      setFeedback(staticFeedback);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmitted = () => {
    // Refresh feedback after new submission
    fetchFeedback();
    if (onFeedbackSubmitted) {
      onFeedbackSubmitted();
    }
  };

  const handleViewFullFeedback = (feedbackItem) => {
    setSelectedFeedback(feedbackItem);
    setShowDetailModal(true);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? feedback.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % feedback.length);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-400/20';
      case 'High': return 'text-orange-400 bg-orange-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="glass-card p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-white/20 rounded w-1/3"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
            <div className="h-4 bg-white/20 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-white mb-2">No Feedback Yet</h3>
        <p className="text-white/70">Be the first to share your feedback!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Carousel Container */}
      <div className="relative">
        <div className="glass-card p-6 hover-glow hover-raise">
          {/* Feedback Card */}
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ring-1 ring-white/10">
                  {feedback[currentIndex]?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="font-medium text-white">{feedback[currentIndex]?.name}</div>
                  <div className="text-xs text-white/60">{feedback[currentIndex]?.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(feedback[currentIndex]?.severity)}`}>
                  {feedback[currentIndex]?.severity}
                </span>
                <span className="text-xs text-white/60">
                  {new Date(feedback[currentIndex]?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Feedback Content */}
            <div className="space-y-3">
              {feedback[currentIndex]?.issues && (
                <div>
                  <h4 className="text-sm font-medium text-red-400 mb-1">Issues / Errors</h4>
                  <p className="text-white/80 text-sm">{truncateText(feedback[currentIndex].issues)}</p>
                </div>
              )}

              {feedback[currentIndex]?.featureRequest && (
                <div>
                  <h4 className="text-sm font-medium text-blue-400 mb-1">Feature Request</h4>
                  <p className="text-white/80 text-sm">{truncateText(feedback[currentIndex].featureRequest)}</p>
                </div>
              )}

              {feedback[currentIndex]?.nonFunctional && (
                <div>
                  <h4 className="text-sm font-medium text-orange-400 mb-1">Non-Functional</h4>
                  <p className="text-white/80 text-sm">{truncateText(feedback[currentIndex].nonFunctional)}</p>
                </div>
              )}

              {feedback[currentIndex]?.generalFeedback && (
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-1">General Feedback</h4>
                  <p className="text-white/80 text-sm">{truncateText(feedback[currentIndex].generalFeedback)}</p>
                </div>
              )}

              {/* Device Info */}
              <div className="text-xs text-white/60">
                <span className="font-medium">Device:</span> {feedback[currentIndex]?.deviceInfo}
              </div>
            </div>

            {/* View Full Feedback Button */}
            <button
              onClick={() => handleViewFullFeedback(feedback[currentIndex])}
              className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
            >
              View Full Feedback
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        {feedback.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {feedback.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {feedback.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Feedback Detail Modal */}
      <FeedbackDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        feedback={selectedFeedback}
      />
    </div>
  );
}
