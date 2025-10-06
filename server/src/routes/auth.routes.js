import { Router } from 'express';
import { register, login, me, refresh, logout, startSignup } from '../controllers/auth.controller.js';
import { authRequired, attachCurrentUser } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/signup', startSignup);
router.get('/me', authRequired, attachCurrentUser, me);

export default router;


