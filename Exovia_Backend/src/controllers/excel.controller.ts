import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { Analysis } from '../models/analysis.model';

export const uploadExcel = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(200).json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        path: req.file.path
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file' });
  }
};

export const processExcel = async (req: Request, res: Response) => {
  try {
    const { filePath, chartType, xAxis, yAxis } = req.body;

    if (!filePath || !chartType || !xAxis || !yAxis) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Get file stats
    const stats = fs.statSync(filePath);

    // Create new analysis record
    const analysis = new Analysis({
      userId: req.user._id,
      fileName: path.basename(filePath),
      fileType: path.extname(filePath).slice(1),
      fileSize: stats.size,
      analysisType: chartType,
      status: 'completed',
      result: {
        chartType,
        xAxis,
        yAxis,
        data
      }
    });

    await analysis.save();

    // Clean up the file after processing
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: 'Excel file processed successfully',
      analysis: {
        id: analysis._id,
        fileName: analysis.fileName,
        fileType: analysis.fileType,
        fileSize: analysis.fileSize,
        analysisType: analysis.analysisType,
        status: analysis.status,
        result: analysis.result
      }
    });
  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).json({ message: 'Error processing Excel file' });
  }
}; 