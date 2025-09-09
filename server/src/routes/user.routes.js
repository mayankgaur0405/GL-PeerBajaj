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
  deleteResource
} from '../controllers/user.controller.js';

const router = Router();

router.get('/suggest', suggestUsers);
router.get('/search', searchUsers);
router.post('/filter', filterUsers);

router.get('/:id', getUserById);
router.post('/:id/follow', authRequired, followUser);
router.post('/:id/unfollow', authRequired, unfollowUser);

// sections CRUD
router.put('/:id/sections', authRequired, upsertSections);
router.post('/:id/sections', authRequired, addSection);
router.put('/:id/sections/:sectionId', authRequired, updateSection);
router.delete('/:id/sections/:sectionId', authRequired, deleteSection);
router.post('/:id/sections/:sectionId/resources', authRequired, addResource);
router.put('/:id/sections/:sectionId/resources/:resourceIndex', authRequired, updateResource);
router.delete('/:id/sections/:sectionId/resources/:resourceIndex', authRequired, deleteResource);

export default router;


