import axios from 'axios';

const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData: { name?: string; email?: string; emailNotifications?: boolean }) => {
    const response = await api.patch('/auth/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  },

  heartbeat: async () => {
    const response = await api.post('/auth/heartbeat');
    return response.data;
  },
};

// Excel API
export const excelAPI = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/excel/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  processExcel: async (data: { filePath: string; chartType: string; xAxis: string; yAxis: string }) => {
    const response = await api.post('/excel/process', data);
    return response.data;
  },
};

// Chart API
export const chartAPI = {
  getChartData: async (analysisId: string) => {
    const response = await api.get(`/charts/data/${analysisId}`);
    return response.data;
  },

  downloadChart: async (analysisId: string) => {
    const response = await api.get(`/charts/download/${analysisId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/charts/history');
    return response.data;
  },

  createChart: async (chartData: { fileName: string; chartType: string; xAxis: string; yAxis: string; data: any[] }) => {
    const response = await api.post('/charts/create', chartData);
    return response.data;
  },
};

// File API
export const fileAPI = {
  getUserFiles: async () => {
    const response = await api.get('/files');
    return response.data;
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getFileData: async (fileId: string) => {
    const response = await api.get(`/files/${fileId}/data`);
    return response.data;
  },

  downloadFile: async (fileId: string) => {
    const response = await api.get(`/files/${fileId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  deleteFile: async (fileId: string) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },

  getFileStats: async () => {
    const response = await api.get('/files/stats');
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  blockUser: async (userId: string) => {
    const response = await api.patch(`/admin/users/${userId}/block`);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
};

export default api; 