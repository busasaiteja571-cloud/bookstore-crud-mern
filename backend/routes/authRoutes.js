import express from 'express';
import { getMe, login, logout, signup } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe); // protect ensures only a logged-in user can check "who am I"

export default router;