import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  getUserById,
  searchUsers,
  filterUsers,
  suggestUsers,
  followUser,
  unfollowUser,
  upsertSections,
  addSection,
  updateSection,
  deleteSection,
  addResource,
  updateResource,
  deleteResource,
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

// Sections
router.post('/:id/sections', authRequired, addSection);
router.put('/:id/sections', authRequired, upsertSections); // update all sections at once
router.put('/:id/sections/:sectionId', authRequired, updateSection);
router.delete('/:id/sections/:sectionId', authRequired, deleteSection);

// Resources
router.post('/:id/sections/:sectionId/resources', authRequired, addResource);
router.put('/:id/sections/:sectionId/resources/:resourceId', authRequired, updateResource);
router.delete('/:id/sections/:sectionId/resources/:resourceId', authRequired, deleteResource);

// User profile
router.get('/:id', getUserById);
router.put('/:id', authRequired, updateUser);

export default router;
