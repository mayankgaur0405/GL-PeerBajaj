import express from 'express';
import { authRequired } from '../middleware/auth.js';
import { 
  createFeedback, 
  getApprovedFeedback, 
  getAllFeedback, 
  updateFeedbackStatus, 
  deleteFeedback 
} from '../controllers/feedback.controller.js';

const router = express.Router();

// Public routes
router.get('/', getApprovedFeedback);

// Protected routes (require authentication)
router.post('/', authRequired, createFeedback);

// Admin routes (you might want to add admin middleware later)
router.get('/admin', authRequired, getAllFeedback);
router.put('/admin/:id', authRequired, updateFeedbackStatus);
router.delete('/admin/:id', authRequired, deleteFeedback);

export default router;

