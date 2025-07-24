import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadExcel, processExcel } from '../controllers/excel.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

// Configure multer for Excel file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['.xls', '.xlsx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Routes
router.post('/upload', auth, upload.single('file'), uploadExcel);
router.post('/process', auth, processExcel);

export default router; 