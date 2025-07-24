import { Request, Response } from 'express';
import { File, IFile } from '../models/file.model';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import XLSX from 'xlsx';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create user-specific directory
    const userId = (req as any).user?.id;
    if (!userId) {
      return cb(new Error('User not authenticated'), '');
    }
    const userDir = path.join(__dirname, '../../uploads', userId.toString());
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all files for a specific user
export const getUserFiles = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const files = await File.find({ userId })
      .select('-fileData') // Don't send file data in the list
      .sort({ createdAt: -1 });

    res.json({ files });
  } catch (error) {
    console.error('Error getting user files:', error);
    res.status(500).json({ message: 'Error getting files' });
  }
};

// Upload a new file
export const uploadFile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create user-specific directory if it doesn't exist
    const userDir = path.join(__dirname, '../../uploads', userId.toString());
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const file = new File({
      userId,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileData: fs.readFileSync(req.file.path)
    });

    await file.save();

    // Delete the temporary file after saving to database
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: file._id,
        fileName: file.fileName,
        originalName: file.originalName,
        fileType: file.fileType,
        fileSize: file.fileSize,
        createdAt: file.createdAt
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
};

// Download a file
export const downloadFile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const file = await File.findOne({ _id: req.params.id, userId });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.setHeader('Content-Type', file.fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.send(file.fileData);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Error downloading file' });
  }
};

// Delete a file
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const file = await File.findOne({ _id: req.params.id, userId });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete the file from user's directory
    const userDir = path.join(__dirname, '../../uploads', userId.toString());
    const filePath = path.join(userDir, file.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await File.deleteOne({ _id: req.params.id });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
};

// Get file statistics for a user
export const getFileStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const totalFiles = await File.countDocuments({ userId });
    const totalSize = await File.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$fileSize' } } }
    ]);

    const fileTypes = await File.aggregate([
      { $match: { userId } },
      { $group: { _id: '$fileType', count: { $sum: 1 } } }
    ]);

    res.json({
      totalFiles,
      totalSize: totalSize[0]?.total || 0,
      fileTypes
    });
  } catch (error) {
    console.error('Error getting file stats:', error);
    res.status(500).json({ message: 'Error getting file statistics' });
  }
};

// Get file data for re-analysis
export const getFileData = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const file = await File.findOne({ _id: req.params.id, userId });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Parse the Excel data from the stored buffer
    const workbook = XLSX.read(file.fileData, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    const columns = jsonData.length > 0 ? Object.keys(jsonData[0] as object) : [];

    res.json({
      file: {
        id: file._id,
        fileName: file.originalName,
        fileType: file.fileType,
        fileSize: file.fileSize,
        uploadDate: file.createdAt,
        data: jsonData,
        columns: columns
      }
    });
  } catch (error) {
    console.error('Error getting file data:', error);
    res.status(500).json({ message: 'Error getting file data' });
  }
}; 