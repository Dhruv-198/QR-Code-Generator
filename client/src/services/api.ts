import axios from 'axios';
import type { QRCodeGenerateRequest, QRCodeResponse, QRCodeHistoryResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making API request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const qrCodeService = {
  // Generate QR Code
  generateQRCode: async (data: QRCodeGenerateRequest): Promise<QRCodeResponse> => {
    try {
      const response = await api.post<QRCodeResponse>('/qr/generate', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to generate QR code',
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Get QR Code History
  getQRCodeHistory: async (page: number = 1, limit: number = 10): Promise<QRCodeHistoryResponse> => {
    try {
      const response = await api.get<QRCodeHistoryResponse>(`/qr/history?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Get QR Code by ID
  getQRCodeById: async (id: string): Promise<QRCodeResponse> => {
    try {
      const response = await api.get<QRCodeResponse>(`/qr/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to fetch QR code',
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Delete QR Code
  deleteQRCode: async (id: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await api.delete(`/qr/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Get Statistics
  getQRCodeStats: async (): Promise<any> => {
    try {
      const response = await api.get('/qr/stats');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export default api;