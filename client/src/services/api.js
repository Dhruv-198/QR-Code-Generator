import axios from 'axios';

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
  generateQRCode: async (data) => {
    try {
      const response = await api.post('/qr/generate', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to generate QR code',
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Get QR Code History
  getQRCodeHistory: async (page = 1, limit = 10) => {
    try {
      console.log(`Calling API: GET /qr/history?page=${page}&limit=${limit}`);
      const response = await api.get(`/qr/history?page=${page}&limit=${limit}`);
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error in getQRCodeHistory:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Get QR Code by ID
  getQRCodeById: async (id) => {
    try {
      const response = await api.get(`/qr/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch QR code',
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Delete QR Code
  deleteQRCode: async (id) => {
    try {
      const response = await api.delete(`/qr/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  // Get Statistics
  getQRCodeStats: async () => {
    try {
      const response = await api.get('/qr/stats');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export default api;