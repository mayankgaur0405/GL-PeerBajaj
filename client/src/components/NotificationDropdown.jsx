import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import { useUnreadCount } from '../context/UnreadCountContext.jsx';
import api from '../lib/api.js';
import { FaBell, FaTimes, FaCheck, FaUser, FaHeart, FaComment, FaPlus } from 'react-icons/fa';

export default function NotificationDropdown({ isOpen, onClose, onUnreadCountChange }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { notificationCount, updateNotificationCount } = useUnreadCount();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isOpen]);

  useEffect(() => {
    if (socket) {
      socket.on('new_notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        updateNotificationCount(notificationCount + 1);
      });

      return () => {
        socket.off('new_notification');
      };
    }
  }, [socket, notificationCount, updateNotificationCount]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      const count = response.data.unreadCount;
      updateNotificationCount(count);
      // Notify parent component of count change
      if (onUnreadCountChange) {
        onUnreadCountChange(count);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, readStatus: true }
            : notif
        )
      );
      const newCount = Math.max(0, notificationCount - 1);
      updateNotificationCount(newCount);
      // Notify parent component of count change
      if (onUnreadCountChange) {
        onUnreadCountChange(newCount);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, readStatus: true }))
      );
      updateNotificationCount(0);
      // Notify parent component of count change
      if (onUnreadCountChange) {
        onUnreadCountChange(0);
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_follower':
        return <FaUser className="w-4 h-4 text-blue-500" />;
      case 'new_post':
        return <FaPlus className="w-4 h-4 text-green-500" />;
      case 'like':
        return <FaHeart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <FaComment className="w-4 h-4 text-purple-500" />;
      default:
        return <FaBell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationText = (notification) => {
    const senderName = notification.senderId?.name || 'Someone';
    
    switch (notification.type) {
      case 'new_follower':
        return `${senderName} started following you`;
      case 'new_post':
        return `${senderName} created a new post`;
      case 'like':
        return `${senderName} liked your post`;
      case 'comment':
        return `${senderName} commented on your post`;
      default:
        return 'New notification';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-full sm:w-96 max-w-[92vw] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 z-50 max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          <div className="flex items-center gap-2">
            {notificationCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <FaTimes className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mx-auto"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <FaBell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200 ${
                !notification.readStatus ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {getNotificationText(notification)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>

                {!notification.readStatus && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
                    title="Mark as read"
                  >
                    <FaCheck className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 dark:border-slate-700">
          <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}


