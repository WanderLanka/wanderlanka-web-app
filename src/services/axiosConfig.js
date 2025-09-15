// axiosConfig.js - Updated with debug logging
import axios from 'axios';
import config from '../config/config.js';

// Create axios instance
const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.API_TIMEOUT,
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Setting the header to identify the platfrom in the backend
    config.headers['X-Client-Type'] = 'web';

    // Debug logging
    console.log('🔍 Axios Request Interceptor:');
    console.log('Token from localStorage:', token ? 'Found' : 'Not found');
    console.log('Request URL:', config.baseURL + config.url);
    // console.log('X-Client-Type:', config.headers['X-Client-Type']); // DEBUGGING
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header added:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log('❌ No token found, Authorization header not added');
    }
    
    console.log('Request headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🚪 Token expired or invalid, redirecting to login...');
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;