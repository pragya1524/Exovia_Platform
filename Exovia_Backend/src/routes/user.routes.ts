import express from 'express';
import { auth } from '../middleware/auth.middleware';
import { getCurrentUser } from '../controllers/auth.controller';

const router = express.Router();

// Protected routes
router.get('/profile', auth, getCurrentUser);

export default router; 