import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import api from '../lib/api.js';

const UnreadCountContext = createContext();

export const useUnreadCount = () => {
  const context = useContext(UnreadCountContext);
  if (!context) {
    throw new Error('useUnreadCount must be used within an UnreadCountProvider');
  }
  return context;
};

export const UnreadCountProvider = ({ children }) => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  // Fetch unread counts when user changes
  useEffect(() => {
    if (user) {
      fetchUnreadCounts();
    } else {
      setNotificationCount(0);
      setMessageCount(0);
    }
  }, [user]);

  const fetchUnreadCounts = async () => {
    try {
      const [notificationsRes, chatRes] = await Promise.all([
        api.get('/notifications/unread-count'),
        api.get('/chat/unread-count')
      ]);
      setNotificationCount(notificationsRes.data.unreadCount || 0);
      setMessageCount(chatRes.data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch unread counts:', err);
    }
  };

  const updateNotificationCount = (count) => {
    setNotificationCount(count);
  };

  const updateMessageCount = (count) => {
    setMessageCount(count);
  };

  const incrementNotificationCount = () => {
    setNotificationCount(prev => prev + 1);
  };

  const incrementMessageCount = () => {
    setMessageCount(prev => prev + 1);
  };

  const decrementNotificationCount = () => {
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  const decrementMessageCount = () => {
    setMessageCount(prev => Math.max(0, prev - 1));
  };

  const value = {
    notificationCount,
    messageCount,
    updateNotificationCount,
    updateMessageCount,
    incrementNotificationCount,
    incrementMessageCount,
    decrementNotificationCount,
    decrementMessageCount,
    fetchUnreadCounts
  };

  return (
    <UnreadCountContext.Provider value={value}>
      {children}
    </UnreadCountContext.Provider>
  );
};
