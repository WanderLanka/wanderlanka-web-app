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
    // Check for token in multiple possible keys
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    // Setting the header to identify the platform in the backend
    config.headers['x-platform'] = 'web';

    // Enhanced debug logging
    console.log('🔍 Axios Request Interceptor:', {
      method: config.method?.toUpperCase(),
      baseURL: config.baseURL,
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`
    });
    
    // Debug token availability
    const authToken = localStorage.getItem('authToken');
    const regularToken = localStorage.getItem('token');
    console.log('Token availability:', {
      authToken: authToken ? 'Found' : 'Not found',
      token: regularToken ? 'Found' : 'Not found',
      using: token ? 'authToken or token' : 'None'
    });
    console.log('Request URL:', config.baseURL + config.url);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header added:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log('❌ No token found in localStorage, Authorization header not added');
      console.log('Available localStorage keys:', Object.keys(localStorage));
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
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('🚪 Token expired, invalid, or insufficient permissions. Redirecting to login...');
      // Token expired, invalid, or insufficient permissions
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Show user-friendly message
      alert('Your session has expired. Please log in again.');
      
      // Redirect to login page
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;