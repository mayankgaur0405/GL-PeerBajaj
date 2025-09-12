import { Notification } from '../models/Notification.js';

// GET USER NOTIFICATIONS
export async function getUserNotifications(req, res, next) {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const notifications = await Notification.getUserNotifications(
      req.userId,
      parseInt(page),
      parseInt(limit),
      unreadOnly === 'true'
    );

    const total = await Notification.countDocuments({ recipient: req.userId });
    const unreadCount = await Notification.getUnreadCount(req.userId);

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    });
  } catch (err) {
    next(err);
  }
}

// MARK NOTIFICATIONS AS READ
export async function markNotificationsAsRead(req, res, next) {
  try {
    const { notificationIds } = req.body;

    if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      await Notification.markAsRead(req.userId, notificationIds);
    } else {
      // Mark all notifications as read
      await Notification.markAsRead(req.userId);
    }

    const unreadCount = await Notification.getUnreadCount(req.userId);

    res.json({ 
      message: 'Notifications marked as read',
      unreadCount 
    });
  } catch (err) {
    next(err);
  }
}

// MARK SINGLE NOTIFICATION AS READ
export async function markNotificationAsRead(req, res, next) {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to mark this notification' });
    }

    await notification.markAsRead();

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
}

// DELETE NOTIFICATION
export async function deleteNotification(req, res, next) {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this notification' });
    }

    await Notification.findByIdAndDelete(id);

    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    next(err);
  }
}

// DELETE ALL NOTIFICATIONS
export async function deleteAllNotifications(req, res, next) {
  try {
    await Notification.deleteMany({ recipient: req.userId });

    res.json({ message: 'All notifications deleted successfully' });
  } catch (err) {
    next(err);
  }
}

// GET UNREAD COUNT
export async function getUnreadCount(req, res, next) {
  try {
    const unreadCount = await Notification.getUnreadCount(req.userId);

    res.json({ unreadCount });
  } catch (err) {
    next(err);
  }
}
