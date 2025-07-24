import express from 'express';
import { register, login, getCurrentUser, heartbeat, updateProfile, requestPasswordReset, resetPassword, changePassword } from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', auth, getCurrentUser);
router.get('/profile', auth, getCurrentUser);
router.patch('/profile', auth, updateProfile);
router.post('/heartbeat', auth, heartbeat);
router.post('/change-password', auth, changePassword);

export default router; 