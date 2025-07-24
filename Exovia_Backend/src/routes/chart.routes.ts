import express from 'express';
import { getChartData, downloadChart, getAnalysisHistory, createChart } from '../controllers/chart.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get chart data
router.get('/data/:analysisId', getChartData);

// Download chart as image
router.get('/download/:analysisId', downloadChart);

// Get analysis history
router.get('/history', getAnalysisHistory);

// Create a new chart
router.post('/create', createChart);

export default router; 