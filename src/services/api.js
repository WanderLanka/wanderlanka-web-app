// api.js - Main API service using axiosConfig
import api from './axiosConfig.js';

// Auth endpoints
export const authAPI = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);  // Changed from /auth/signup to /auth/register
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } catch {
      // Even if logout fails on server, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
};

// Destinations endpoints
export const destinationsAPI = {
  // Get all destinations
  getAll: async () => {
    try {
      const response = await api.get('/destinations');
      return response.data;
    } catch (error) {
      console.error('Get destinations failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get destination by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/destinations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get destination failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Search destinations
  search: async (query) => {
    try {
      const response = await api.get(`/destinations/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Search destinations failed:', error.response?.data || error.message);
      throw error;
    }
  }
};

// Testimonials endpoints
export const testimonialsAPI = {
  // Get all testimonials
  getAll: async () => {
    try {
      const response = await api.get('/testimonials');
      return response.data;
    } catch (error) {
      console.error('Get testimonials failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Submit new testimonial
  create: async (testimonialData) => {
    try {
      const response = await api.post('/testimonials', testimonialData);
      return response.data;
    } catch (error) {
      console.error('Create testimonial failed:', error.response?.data || error.message);
      throw error;
    }
  }
};

// Bookings endpoints  
export const bookingsAPI = {
  // Create new booking
  create: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Create booking failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get user bookings
  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings/user');
      return response.data;
    } catch (error) {
      console.error('Get user bookings failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get booking by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get booking failed:', error.response?.data || error.message);
      throw error;
    }
  }
};

// Newsletter subscription
export const newsletterAPI = {
  subscribe: async (email) => {
    try {
      const response = await api.post('/newsletter/subscribe', { email });
      return response.data;
    } catch (error) {
      console.error('Newsletter subscription failed:', error.response?.data || error.message);
      throw error;
    }
  }
};

// Contact form
export const contactAPI = {
  submit: async (contactData) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      console.error('Contact form submission failed:', error.response?.data || error.message);
      throw error;
    }
  }
};

// Export the configured axios instance for direct use if needed
export { api as axiosInstance };
