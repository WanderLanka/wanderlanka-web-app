import React from 'react';
import { X } from 'lucide-react';
import { Modal, Button, Input } from '../common';

const AuthModal = ({ isLogin, onClose, onToggleMode }) => (
  <Modal isOpen={true} onClose={onClose} size="md">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {isLogin ? 'Welcome Back' : 'Join Ceylon Explorer'}
      </h2>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <X className="w-6 h-6" />
      </button>
    </div>
    
    <form className="space-y-4">
      {!isLogin && (
        <Input
          type="text"
          placeholder="Full Name"
          className="focus:ring-green-500"
        />
      )}
      <Input
        type="email"
        placeholder="Email Address"
        className="focus:ring-green-500"
      />
      <Input
        type="password"
        placeholder="Password"
        className="focus:ring-green-500"
      />
      
      <Button 
        variant="primary" 
        size="lg" 
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        {isLogin ? 'Sign In' : 'Create Account'}
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

export default AuthModal;
