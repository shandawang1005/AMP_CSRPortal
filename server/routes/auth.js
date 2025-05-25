
import express from 'express';
import { login, logout, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', requireAuth, getMe);
router.post('/login', login);
router.post('/logout', logout);

export default router;
