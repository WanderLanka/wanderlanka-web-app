import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Modal, Button, Input } from '../common';
import { authAPI } from '../../services/api';

const AuthModal = ({ isLogin, onClose, onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        
        // Store authentication data for login only
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        // Redirect based on user role
        const userRole = response.user?.role;
        switch (userRole) {
          case 'Sysadmin':
          case 'admin':
            window.location.href = '/admin';
            break;
          case 'transport':
            window.location.href = '/transport';
            break;
          case 'accommodation':
            window.location.href = '/accommodation';
            break;
          case 'tourist':
            window.location.href = '/user';
            break;
          case 'guide':
            window.location.href = '/guide';
            break;
          default:
            window.location.href = '/dashboard';
        }
      } else {
        const response = await authAPI.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        // Registration successful - no tokens, switch to login mode
        const message = response.user?.role === 'guide' && response.user?.status === 'pending' 
          ? `Registration successful! Your guide application is under review.` 
          : `Registration successful! Please login to access your account.`;
        alert(message);
        onToggleMode(); // Switch to login mode
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isLogin ? 'Welcome Back' : 'Join Ceylon Explorer'}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="focus:ring-green-500"
            required
          />
        )}
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email Address"
          className="focus:ring-green-500"
          required
        />
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="focus:ring-green-500"
          required
        />
        
        <Button 
          type="submit"
          variant="primary" 
          size="lg" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={onToggleMode}
            className="text-green-600 font-semibold hover:text-green-700"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </Modal>
  );
};

export default AuthModal;
