import express from 'express';
import { getFollowingFeed, getGlobalFeed } from '../controllers/feed.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Get following feed
router.get('/following', authRequired, getFollowingFeed);

// Get global feed
router.get('/global', authRequired, getGlobalFeed);

export default router;
