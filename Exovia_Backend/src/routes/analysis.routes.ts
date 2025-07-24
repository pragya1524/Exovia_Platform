import express from 'express';
import { auth } from '../middleware/auth.middleware';
import {
  getAnalysisHistory,
  createAnalysis,
  updateAnalysis,
  deleteAnalysis
} from '../controllers/analysis.controller';

const router = express.Router();

// Get user's analysis history
router.get('/history', auth, getAnalysisHistory);

// Create new analysis
router.post('/', auth, createAnalysis);

// Update analysis
router.patch('/:id', auth, updateAnalysis);

// Delete analysis
router.delete('/:id', auth, deleteAnalysis);

export default router; 