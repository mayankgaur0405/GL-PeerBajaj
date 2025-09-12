import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  getUserNotifications,
  markNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount
} from '../controllers/notification.controller.js';

const router = Router();

// All notification routes require authentication
router.use(authRequired);

// Notification management
router.get('/', getUserNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/mark-read', markNotificationsAsRead);
router.put('/:id/read', markNotificationAsRead);
router.delete('/:id', deleteNotification);
router.delete('/', deleteAllNotifications);

export default router;
