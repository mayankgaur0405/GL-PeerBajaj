import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { saveFile, getUserFiles, updateVisibility } from '../controllers/file.controller.js';

const router = Router();

router.post('/save', authRequired, saveFile);
router.get('/:userId', authRequired, getUserFiles);
router.put('/:fileId/visibility', authRequired, updateVisibility);

export default router;


