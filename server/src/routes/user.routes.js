import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  getUserById,
  searchUsers,
  filterUsers,
  suggestUsers,
  followUser,
  unfollowUser,
  updateUser
} from '../controllers/user.controller.js';

const router = Router();

// Users search/filter/suggest/follow – put these first
router.get('/suggest', suggestUsers);
router.get('/search', searchUsers);
router.post('/filter', filterUsers);

// Follow/unfollow
router.post('/:id/follow', authRequired, followUser);
router.post('/:id/unfollow', authRequired, unfollowUser);

// Sections/resources feature removed

// User profile
router.get('/:id', getUserById);
router.put('/:id', authRequired, updateUser);

export default router;
