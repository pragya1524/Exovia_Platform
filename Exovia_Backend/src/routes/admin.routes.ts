import express from 'express';
import { getDashboardStats, getUsers, blockUser, deleteUser, updateUserRole, toggleUserBlock } from '../controllers/admin.controller';
import { adminAuth } from '../middleware/auth.middleware';

const router = express.Router();

// All routes are protected with adminAuth middleware
router.use(adminAuth);

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getUsers);
router.patch('/users/:userId/role', updateUserRole);
router.patch('/users/:userId/block', toggleUserBlock);
router.delete('/users/:userId', deleteUser);

export default router; 