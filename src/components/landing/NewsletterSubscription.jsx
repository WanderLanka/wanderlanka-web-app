import React, { useState } from 'react';
import { Button, Input } from '../common';
import { newsletterAPI } from '../../services/api';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await newsletterAPI.subscribe(email);
      setMessage(response.message || 'Thank you for subscribing!');
      setIsSuccess(true);
      setEmail('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Subscription failed. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Stay Updated on Sri Lankan Adventures
      </h3>
      <p className="text-gray-600 mb-4">
        Get the latest travel tips, destination guides, and exclusive offers delivered to your inbox.
      </p>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          isSuccess 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 focus:ring-green-500"
          required
        />
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSubscription;
