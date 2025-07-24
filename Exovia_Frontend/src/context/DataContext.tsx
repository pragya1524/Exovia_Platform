import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { chartAPI, fileAPI } from '../lib/api';
import * as XLSX from 'xlsx';

interface ExcelData {
  id: string;
  fileName: string;
  data: any[];
  columns: string[];
  uploadDate: Date;
  fileType: string;
  fileSize: number;
}

interface Chart {
  id: string;
  fileName: string;
  chartType: string;
  xAxis: string;
  yAxis: string;
  data: any[];
  createdDate: Date;
  status: string;
}

interface DataContextType {
  excelFiles: ExcelData[];
  charts: Chart[];
  currentData: any[] | null;
  fileName: string | null;
  loading: boolean;
  uploadExcelFile: (file: File) => Promise<void>;
  createChart: (chartData: Omit<Chart, 'id' | 'createdDate' | 'status'>) => Promise<void>;
  setCurrentData: (data: ExcelData | null) => void;
  loadFileData: (fileId: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  deleteChart: (id: string) => Promise<void>;
  loadUserData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [excelFiles, setExcelFiles] = useState<ExcelData[]>([]);
  const [charts, setCharts] = useState<Chart[]>([]);
  const [currentData, setCurrentDataState] = useState<any[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load user data when user logs in
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Clear data when user logs out
      setExcelFiles([]);
      setCharts([]);
      setCurrentDataState(null);
      setFileName(null);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load user's files
      const filesResponse = await fileAPI.getUserFiles();
      const files = filesResponse.files || [];

      // Load user's chart history (IMPORTANT: now use charts, not analyses)
      const chartsResponse = await chartAPI.getHistory();
      const chartsArr = chartsResponse.charts || [];
      console.log('charts loaded', chartsArr);

      // Convert backend data to frontend format
      const convertedFiles: ExcelData[] = files.map((file: any) => ({
        id: file._id,
        fileName: file.originalName,
        data: [],
        columns: [],
        uploadDate: new Date(file.createdAt),
        fileType: file.fileType,
        fileSize: file.fileSize
      }));

      const convertedCharts: Chart[] = chartsArr.map((analysis: any) => ({
        id: analysis._id,
        fileName: analysis.fileName,
        chartType: analysis.analysisType,
        xAxis: analysis.result?.xAxis || '',
        yAxis: analysis.result?.yAxis || '',
        data: analysis.result?.data || [],
        createdDate: new Date(analysis.createdAt),
        status: analysis.status
      }));

      setExcelFiles(convertedFiles);
      setCharts(convertedCharts);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadExcelFile = async (file: File): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    return new Promise(async (resolve, reject) => {
      try {
        // First, upload file to backend
        const uploadResponse = await fileAPI.uploadFile(file);

        // Parse file data for frontend use
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (jsonData.length === 0) {
              reject(new Error('Excel file is empty'));
              return;
            }

            const columns = Object.keys(jsonData[0] as object);

            const newFile: ExcelData = {
              id: uploadResponse.file.id,
              fileName: file.name,
              data: jsonData,
              columns,
              uploadDate: new Date(),
              fileType: file.type,
              fileSize: file.size
            };

            setExcelFiles(prev => [...prev, newFile]);
            setCurrentDataState(jsonData);
            setFileName(file.name);
            resolve();
          } catch (error) {
            reject(new Error('Failed to parse Excel file'));
          }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsBinaryString(file);
      } catch (error) {
        reject(error);
      }
    });
  };

  const createChart = async (chartData: Omit<Chart, 'id' | 'createdDate' | 'status'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Call the backend API to create the chart
      const response = await chartAPI.createChart({
        fileName: chartData.fileName,
        chartType: chartData.chartType,
        xAxis: chartData.xAxis,
        yAxis: chartData.yAxis,
        data: chartData.data
      });

      // Add the new chart to local state
      const newChart: Chart = {
        id: response.analysis.id,
        fileName: response.analysis.fileName,
        chartType: response.analysis.analysisType,
        xAxis: response.analysis.result.xAxis,
        yAxis: response.analysis.result.yAxis,
        data: response.analysis.result.data,
        createdDate: new Date(response.analysis.createdAt),
        status: response.analysis.status
      };

      setCharts(prev => [...prev, newChart]);
    } catch (error) {
      console.error('Error creating chart:', error);
      throw error;
    }
  };

  const setCurrentData = (data: ExcelData | null) => {
    if (data) {
      setCurrentDataState(data.data);
      setFileName(data.fileName);
    } else {
      setCurrentDataState(null);
      setFileName(null);
    }
  };

  const loadFileData = async (fileId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Load file data from backend
      const response = await fileAPI.getFileData(fileId);
      const file = response.file;

      // Set file data as current data for re-analysis
      setCurrentDataState(file.data);
      setFileName(file.fileName);
    } catch (error) {
      console.error('Error loading file data:', error);
      throw error;
    }
  };

  const deleteFile = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await fileAPI.deleteFile(id);
      setExcelFiles(prev => prev.filter(file => file.id !== id));
      // Also remove charts associated with this file
      setCharts(prev => prev.filter(chart => chart.fileName !== excelFiles.find(f => f.id === id)?.fileName));
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  const deleteChart = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Here you would typically call the backend to delete the chart
      setCharts(prev => prev.filter(chart => chart.id !== id));
    } catch (error) {
      console.error('Error deleting chart:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      excelFiles,
      charts,
      currentData,
      fileName,
      loading,
      uploadExcelFile,
      createChart,
      setCurrentData,
      loadFileData,
      deleteFile,
      deleteChart,
      loadUserData,
    }}>
      {children}
    </DataContext.Provider>
  );
};
