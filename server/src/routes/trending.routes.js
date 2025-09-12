import { Router } from 'express';
import {
  getTrendingProfiles,
  getTrendingSections,
  getTrendingPosts,
  getTrendingCategories,
  getTrendingData
} from '../controllers/trending.controller.js';

const router = Router();

// All trending routes are public
router.get('/profiles', getTrendingProfiles);
router.get('/sections', getTrendingSections);
router.get('/posts', getTrendingPosts);
router.get('/categories', getTrendingCategories);
router.get('/', getTrendingData);

export default router;
