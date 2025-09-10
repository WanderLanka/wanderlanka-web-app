import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  LandingPage,
  Home,
  Auth,
  NotFound
} from '../pages';

const PublicRoutes = () => {
  return (
    <Routes>
      {/* Landing Page - Default Route */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Home page */}
      <Route path="/home" element={<Home />} />
      
      {/* Authentication */}
      <Route path="/auth" element={<Auth />} />
      
      {/* Catch all for public routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
