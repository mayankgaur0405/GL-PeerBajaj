import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  getUserChats,
  getOrCreateChat,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  deleteMessage,
  deleteChat,
  getUnreadCount
} from '../controllers/chat.controller.js';

const router = Router();

// All chat routes require authentication
router.use(authRequired);

// Chat management
router.get('/', getUserChats);
router.get('/unread-count', getUnreadCount);
router.post('/user/:userId', getOrCreateChat);

// Message management
router.get('/:chatId/messages', getChatMessages);
router.post('/:chatId/messages', sendMessage);
router.put('/:chatId/read', markMessagesAsRead);
router.delete('/:chatId/messages/:messageId', deleteMessage);
router.delete('/:chatId', deleteChat);

export default router;
