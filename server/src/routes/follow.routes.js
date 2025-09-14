import express from 'express';
import { followUser, unfollowUser, removeFollower, getFollowers, getFollowing } from '../controllers/follow.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Follow/Unfollow routes
router.post('/:id', authRequired, followUser);
router.delete('/:id', authRequired, unfollowUser);
router.delete('/remove-follower/:id', authRequired, removeFollower);

// Get followers/following lists
router.get('/:id/followers', authRequired, getFollowers);
router.get('/:id/following', authRequired, getFollowing);

export default router;
