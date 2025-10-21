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

  redirect: async (userData) =>{
    try{
      const response = await api.post('/auth/redirect', userData);
      return response.data;
    } catch (error) {
      console.error('Redirection failed:', error.response?.data || error.message);
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

export const adminAPI={
  requests:async()=>{
    try{
      const response = await api.get('/auth/requests');
      return response.data;
    }
    catch (error) {
      console.error('Get requests failed:', error.response?.data || error.message);
      throw error;
  }
}
,
updateRequestStatus:async(requestid,action)=>{
  try{
    const response = await api.put('/auth/updateRequestStatus', { requestId: requestid, action });
    return response.data;
  }
  catch (error) {
    console.error('Update request status failed:', error.response?.data || error.message);
    throw error;    
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
      console.log('Response data structure:', {
        hasData: !!response.data.data,
        hasSuccess: !!response.data.success,
        userId: response.data.data?.userId,
        _id: response.data.data?._id
      });
      // Extract the actual data from the response structure
      const extractedData = response.data.data || response.data;
      console.log('Extracted data:', extractedData);
      return extractedData;
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

// Itinerary endpoints
export const itineraryAPI = {
  // Store completed trip data
  storeCompletedTrip: async (tripData) => {
    try {
      console.log('[FE][itineraryAPI] POST /itinerary/store-completed-trip payload:', {
        keys: Object.keys(tripData || {}),
        hasTripData: !!tripData?.tripData,
        hasPlanningBookings: !!tripData?.planningBookings,
        hasDayPlaces: !!tripData?.dayPlaces
      });
      const response = await api.post('/itinerary/store-completed-trip', tripData);
      console.log('[FE][itineraryAPI] Response status:', response.status, 'data:', response.data);
      return response.data;
    } catch (error) {
      console.error('[FE][itineraryAPI] Store completed trip failed. Status:', error.response?.status, 'Data:', error.response?.data);
      throw error;
    }
  },

  // Create new itinerary
  create: async (itineraryData) => {
    try {
      const response = await api.post('/itinerary/create', itineraryData);
      return response.data;
    } catch (error) {
      console.error('Create itinerary failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get user itineraries
  getUserItineraries: async (status = null) => {
    try {
      const url = status ? `/itinerary/user?status=${status}` : '/itinerary/user';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get user itineraries failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get itinerary by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/itinerary/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get itinerary failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update itinerary
  update: async (id, updates) => {
    try {
      const response = await api.put(`/itinerary/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update itinerary failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete itinerary
  delete: async (id) => {
    try {
      const response = await api.delete(`/itinerary/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete itinerary failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Search places
  searchPlaces: async (query, location = null) => {
    try {
      const params = new URLSearchParams({ query });
      if (location) {
        params.append('latitude', location.latitude);
        params.append('longitude', location.longitude);
      }
      const response = await api.get(`/itinerary/places/search?${params}`);
      return response.data;
    } catch (error) {
      console.error('Search places failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get place details
  getPlaceDetails: async (placeId) => {
    try {
      const response = await api.get(`/itinerary/places/${placeId}`);
      return response.data;
    } catch (error) {
      console.error('Get place details failed:', error.response?.data || error.message);
      throw error;
    }
  }
};

// Bookings endpoints
export const bookingsAPI = {
  // Get user bookings with pagination and filtering
  getUserBookings: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add query parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.serviceType) queryParams.append('serviceType', params.serviceType);
      if (params.status) queryParams.append('status', params.status);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const response = await api.get(`/booking/userBookings?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get user bookings failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Create enhanced booking
  createEnhanced: async (bookingData) => {
    try {
      const response = await api.post('/booking/s/enhanced', bookingData);
      return response.data;
    } catch (error) {
      console.error('Create enhanced booking failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Create Stripe checkout session
  createCheckoutSession: async (sessionData) => {
    try {
      const response = await api.post('/booking/payments/create-session', sessionData);
      return response.data;
    } catch (error) {
      console.error('Create checkout session failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get provider bookings
  getProviderBookings: async (serviceType) => {
    try {
      const response = await api.get(`/booking/provider/bookings?serviceType=${serviceType}`);
      return response.data;
    } catch (error) {
      console.error('Get provider bookings failed:', error.response?.data || error.message);
      throw error;
    }
  }
};

// Payment endpoints
export const paymentAPI = {
  // Get user payments (for travelers)
  getUserPayments: async () => {
    try {
      const response = await api.get('/payment/getUserPayments');
      return response.data;
    } catch (error) {
      console.error('Get user payments failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get accommodation provider payments
  getAccommodationPayments: async () => {
    try {
      const response = await api.get('/payment/getAccommodationPayments');
      return response.data;
    } catch (error) {
      console.error('Get accommodation payments failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get transportation provider payments
  getTransportPayments: async () => {
    try {
      const response = await api.get('/payment/getTransportPayments');
      return response.data;
    } catch (error) {
      console.error('Get transportation payments failed:', error.response?.data || error.message);
      throw error;
    }
  }
};

// Export the configured axios instance for direct use if needed
export { api as axiosInstance };
