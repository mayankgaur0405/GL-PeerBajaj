import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  createPost,
  getPosts,
  getFeedPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  trackShare,
  getTrendingPosts,
  getUserPosts
} from '../controllers/post.controller.js';

const router = Router();

// Public routes
router.get('/', getPosts);
router.get('/trending', getTrendingPosts);
router.get('/user/:userId', getUserPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/', authRequired, createPost);
router.get('/feed/posts', authRequired, getFeedPosts);
router.put('/:id', authRequired, updatePost);
router.delete('/:id', authRequired, deletePost);

// Engagement routes
router.post('/:id/like', authRequired, toggleLike);
router.post('/:id/comment', authRequired, addComment);
router.delete('/:id/comments/:commentId', authRequired, deleteComment);
router.post('/:id/share', authRequired, trackShare);

export default router;
