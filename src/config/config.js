// config.js - Centralized configuration for the application
const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',
  
  // Timeouts
  API_TIMEOUT: 10000, // 10 seconds
  
  // Token Configuration
  TOKEN_STORAGE_KEY: 'token',
  USER_STORAGE_KEY: 'user',
  
  // Development settings
  DEBUG_API_CALLS: import.meta.env.MODE === 'development',
};

export default config;
