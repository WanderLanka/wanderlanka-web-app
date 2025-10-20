// Authentication helper utilities
export const authUtils = {
  // Get the authentication token from localStorage
  getToken: () => {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = authUtils.getToken();
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user data
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get user role
  getUserRole: () => {
    const user = authUtils.getCurrentUser();
    return user?.role || null;
  },

  // Check if user has specific role
  hasRole: (role) => {
    return authUtils.getUserRole() === role;
  },

  // Debug authentication state
  debugAuth: () => {
    const token = authUtils.getToken();
    const user = authUtils.getCurrentUser();
    const availableKeys = Object.keys(localStorage);
    
    console.log('🔍 Authentication Debug:', {
      token: token ? `Found (${token.length} chars)` : 'Not found',
      user: user ? `Found (${user.username || user.email})` : 'Not found',
      role: user?.role || 'No role',
      availableKeys,
      isAuthenticated: authUtils.isAuthenticated()
    });
    
    return {
      token: !!token,
      user: !!user,
      role: user?.role,
      availableKeys,
      isAuthenticated: authUtils.isAuthenticated()
    };
  },

  // Clear authentication data
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};
