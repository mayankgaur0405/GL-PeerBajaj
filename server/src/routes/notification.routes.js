import express from 'express';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllAsRead, 
  getUnreadCount 
} from '../controllers/notification.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Get user notifications
router.get('/', authRequired, getNotifications);

// Get unread count
router.get('/unread-count', authRequired, getUnreadCount);

// Mark notification as read
router.patch('/:id/read', authRequired, markNotificationAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', authRequired, markAllAsRead);

export default router;