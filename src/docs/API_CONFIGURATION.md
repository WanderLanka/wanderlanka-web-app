# API Configuration Guide

This document explains how API requests are centralized in the WanderLanka web application.

## Overview

All API requests in the application go through a centralized axios configuration that routes requests to the API Gateway at `http://localhost:3000/api`.

## Files Structure

### 1. Configuration Files
- **`src/config/config.js`** - Centralized application configuration
- **`src/services/axiosConfig.js`** - Axios instance with interceptors
- **`src/services/api.js`** - API service methods
- **`.env.development`** - Development environment variables (gitignored)
- **`.env.production`** - Production environment variables (gitignored)
- **`.env.example`** - Example environment file (committed to repo)

### 2. Key Features

#### Centralized Base URL
- All API requests use the same base URL configuration
- Environment-specific URLs via environment variables
- Easy to change for different deployment environments

#### Request Interceptors
- Automatically adds authentication tokens to requests
- Debug logging for development
- Consistent headers across all requests

#### Response Interceptors
- Handles 401 unauthorized responses automatically
- Redirects to login page when token expires
- Error logging and handling

#### Authentication Service
- Login and registration methods
- Token management
- User profile retrieval

## Usage Examples

### Using the Auth API
```javascript
import { authAPI } from '../../services/api';

// Login
const response = await authAPI.login({ username, password });

// Register
const response = await authAPI.register(userData);
```

### Using Direct API Instance
```javascript
import api from '../../services/axiosConfig';

// GET request
const response = await api.get('/transport/vehicles');

// POST request
const response = await api.post('/accommodation/addhotels', hotelData);

// PUT request
const response = await api.put(`/admin/update/${id}`, updateData);
```

## Environment Configuration

### Setup Instructions
1. Copy `.env.example` to `.env.development` for development
2. Copy `.env.example` to `.env.production` for production
3. Update the values according to your environment

### Development
Set `VITE_API_BASE_URL=http://localhost:3000/api` in `.env.development`

### Production
Set `VITE_API_BASE_URL=https://your-production-api.com/api` in `.env.production`

### Security Notes
- All `.env` files are gitignored to prevent exposing sensitive data
- Use `.env.example` as a template for team members
- Only commit `.env.example` to version control

## Benfits Gained

1. **Centralized Configuration** - All API settings in one place
2. **Environment Management** - Easy switching between dev/prod
3. **Authentication Handling** - Automatic token management
4. **Error Handling** - Consistent error responses
5. **Debugging** - Built-in request/response logging
6. **Maintainability** - Easy to update API endpoints
