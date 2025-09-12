import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { uploadSingle, uploadMultiple, uploadImage, uploadImages } from '../controllers/upload.controller.js';

const router = Router();

// All upload routes require authentication
router.use(authRequired);

// Single image upload
router.post('/single', uploadSingle, uploadImage);

// Multiple images upload
router.post('/multiple', uploadMultiple, uploadImages);

export default router;
