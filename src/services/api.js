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

// Accommodation endpoints
export const accommodationAPI = {
  // Get all accommodations
  getAll: async () => {
    try {
      const response = await api.get('/accommodation/accommodations');
      console.log('API Response:', response.data);
      // Extract the actual data from the response structure
      return response.data.data || response.data;
    } catch (error) {
      console.error('Get accommodations failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get accommodation by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/accommodation/accommodations/${id}`);
      console.log('API Response:', response.data);
      // Extract the actual data from the response structure
      return response.data.data || response.data;
    } catch (error) {
      console.error('Get accommodation failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Search accommodations
  search: async (query) => {
    try {
      const response = await api.get(`/accommodation/accommodations/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Search accommodations failed:', error.response?.data || error.message);
      throw error;
    }
  }
};

// Transportation endpoints
export const transportationAPI = {
  // Get all transportation options
  getAll: async () => {
    try {
      const response = await api.get('/transport/transportation');
      console.log('Transportation API Response:', response.data);
      // Extract the actual data from the response structure
      return response.data.data || response.data;
    } catch (error) {
      console.error('Get transportation failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get transportation by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/transport/transportation/${id}`);
      console.log('Transportation API Response:', response.data);
      // Extract the actual data from the response structure
      return response.data.data || response.data;
    } catch (error) {
      console.error('Get transportation failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Search transportation
  search: async (query) => {
    try {
      const response = await api.get(`/transport/transportation/search?q=${encodeURIComponent(query)}`);
      console.log('Transportation Search API Response:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Search transportation failed:', error.response?.data || error.message);
      throw error;
    }
  }
};

// Tour Guide endpoints
export const tourGuideAPI = {
  // Get all tour guides
  getAll: async () => {
    try {
      const response = await api.get('/guide/list');
      console.log('Tour Guide API Response:', response.data);
      // Extract the actual data from the response structure
      return response.data.data || response.data;
    } catch (error) {
      console.error('Get tour guides failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get tour guide by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/guide/get/${id}`);
      console.log('Tour Guide API Response:', response.data);
      // Extract the actual data from the response structure
      return response.data.data || response.data;
    } catch (error) {
      console.error('Get tour guide failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Search tour guides
  search: async (query) => {
    try {
      const response = await api.get(`/guide/list?q=${encodeURIComponent(query)}`);
      console.log('Tour Guide Search API Response:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Search tour guides failed:', error.response?.data || error.message);
      throw error;
    }
  }
};

// Export the configured axios instance for direct use if needed
export { api as axiosInstance };
