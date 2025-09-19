import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  TravelerDashboard,
  MyBookings,
  MyTrips,
  Payments,
  Services,
  Profile
} from '../pages';

const TravelerRoutes = () => {
  return (
    <Routes>
      {/* Traveler Dashboard - Default */}
      <Route index element={<TravelerDashboard />} />
      
      {/* My Bookings */}
      <Route path="mybookings" element={<MyBookings />} />
      
      {/* My Trips */}
      <Route path="mytrips" element={<MyTrips />} />
      
      {/* Payments */}
      <Route path="payments" element={<Payments />} />
      
      {/* Services */}
      <Route path="services" element={<Services />} />
      
      {/* Profile */}
      <Route path="profile" element={<Profile />} />
    </Routes>
  );
};

export default TravelerRoutes;
