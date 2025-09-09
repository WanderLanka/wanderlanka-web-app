import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4 lg:p-8 text-white">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-5xl w-full text-center lg:text-left">
        <div className="flex-1">
          <div className="text-6xl md:text-8xl font-bold text-white/30 leading-none mb-4">404</div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Oops! Page Not Found</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
            The page you're looking for seems to have wandered off the beaten path.
            Let's get you back to exploring Sri Lanka!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/">
              <Button variant="primary" size="large">Go Home</Button>
            </Link>
            <Link to="/auth">
              <Button variant="secondary" size="large">Sign In</Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 text-center">
          <img 
            src="/api/placeholder/400/300" 
            alt="Lost traveler" 
            className="max-w-full h-auto rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
