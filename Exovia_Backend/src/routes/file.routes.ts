import express from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth.middleware';
import {
  getUserFiles,
  uploadFile,
  downloadFile,
  deleteFile,
  getFileStats,
  getFileData
} from '../controllers/file.controller';
import path from 'path';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create user-specific directory
    const userId = (req as any).user?._id;
    if (!userId) {
      return cb(new Error('User not authenticated'), '');
    }
    const userDir = path.join(__dirname, '../../uploads', userId.toString());
    if (!require('fs').existsSync(userDir)) {
      require('fs').mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// All routes require authentication
router.use(auth);

// Get all files for the authenticated user
router.get('/', getUserFiles);

// Get file statistics for the authenticated user
router.get('/stats', getFileStats);

// Get file data for re-analysis
router.get('/:id/data', getFileData);

// Upload a new file
router.post('/upload', upload.single('file'), uploadFile);

// Download a file
router.get('/:id/download', downloadFile);

// Delete a file
router.delete('/:id', deleteFile);

export default router; 