import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  TravelerDashboard,
  MyBookings,
  MyTrips,
  Payments,
  Services,
  ServiceDetails,
  Profile,
  Accommodations,
  Transportation,
  TourGuides
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
      <Route path="services/:id" element={<ServiceDetails />} />
      
      {/* Dedicated Service Category Pages */}
      <Route path="accommodations" element={<Accommodations />} />
      <Route path="transportation" element={<Transportation />} />
      <Route path="tour-guides" element={<TourGuides />} />
      
      {/* Profile */}
      <Route path="profile" element={<Profile />} />
    </Routes>
  );
};

export default TravelerRoutes;
