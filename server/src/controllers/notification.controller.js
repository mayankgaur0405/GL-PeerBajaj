import { Notification } from '../models/Notification.js';

// Get user notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.getUserNotifications(userId, page, limit);
    const totalCount = await Notification.countDocuments({ receiverId: userId });

    res.json({
      notifications,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const unreadCount = await Notification.getUnreadCount(userId);

    res.json({ unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, receiverId: userId },
      { readStatus: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.markAllAsRead(userId);

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};