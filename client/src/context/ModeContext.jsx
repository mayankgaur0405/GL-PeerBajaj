import React, { createContext, useContext, useEffect, useState } from 'react';

const ModeContext = createContext();

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};

export const ModeProvider = ({ children }) => {
  // Initialize from localStorage to persist across refreshes
  const [currentMode, setCurrentMode] = useState(() => {
    try {
      const saved = localStorage.getItem('glpb.currentMode')
      return saved === 'explore' ? 'explore' : 'social'
    } catch (_) {
      return 'social'
    }
  }); // 'social' or 'explore'

  const toggleMode = () => {
    setCurrentMode(prev => {
      const next = prev === 'social' ? 'explore' : 'social';
      // If switching back to social, clear any explore hash from URL
      if (next === 'social' && window?.location?.hash) {
        // Clear hash in a way that updates the router/location
        try {
          window.location.hash = ''
        } catch (_) {
          history.replaceState(null, '', window.location.pathname + window.location.search)
        }
      }
      return next;
    });
  };

  // Persist mode
  useEffect(() => {
    try {
      localStorage.setItem('glpb.currentMode', currentMode)
    } catch (_) {}
  }, [currentMode])

  const modeConfig = {
    social: {
      title: 'Social Mode',
      subtitle: 'Connect and share with your peers',
      icon: '👥',
      color: 'blue',
      description: 'Share experiences, learn from seniors, and connect with fellow students'
    },
    explore: {
      title: 'Explore Mode',
      subtitle: 'Discover resources and opportunities',
      icon: '🔍',
      color: 'green',
      description: 'Explore study materials, internships, and career guidance'
    }
  };

  const value = {
    currentMode,
    setCurrentMode,
    toggleMode,
    modeConfig: modeConfig[currentMode],
    isSocialMode: currentMode === 'social',
    isExploreMode: currentMode === 'explore'
  };

  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
};




