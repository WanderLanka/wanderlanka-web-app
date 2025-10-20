import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  TravelerDashboard,
  TripPlanning,
  MyBookings,
  MyTrips,
  Payments,
  Services,
  Profile,
  Accommodations,
  Transportation,
  TourGuides,
  AccommodationDetails,
  TransportationDetails,
  TourGuideDetails
} from '../pages';
import SubmitComplaint from '../pages/traveler/SubmitComplaint';
import ComplaintsList from '../pages/traveler/ComplaintsList';
import ComplaintDetail from '../pages/traveler/ComplaintDetail';

const TravelerRoutes = () => {
  return (
    <Routes>
      {/* Traveler Dashboard - Default */}
      <Route index element={<TravelerDashboard />} />
      
      {/* Trip Planning */}
      <Route path="trip-planning" element={<TripPlanning />} />
      
      {/* My Bookings */}
      <Route path="mybookings" element={<MyBookings />} />
      
      {/* My Trips */}
      <Route path="mytrips" element={<MyTrips />} />
      
      {/* Payments */}
      <Route path="payments" element={<Payments />} />
      
      {/* Services */}
      <Route path="services" element={<Services />} />
      
      {/* Dedicated Service Category Pages */}
      <Route path="accommodations" element={<Accommodations />} />
      <Route path="accommodations/:id" element={<AccommodationDetails />} />
      <Route path="transportation" element={<Transportation />} />
      <Route path="transportation/:id" element={<TransportationDetails />} />
      <Route path="tour-guides" element={<TourGuides />} />
      <Route path="tour-guides/:id" element={<TourGuideDetails />} />
      
      {/* Profile */}
      <Route path="profile" element={<Profile />} />
      
      {/* Complaints */}
      <Route path="complaints" element={<ComplaintsList />} />
      <Route path="complaints/submit" element={<SubmitComplaint />} />
      <Route path="complaints/:id" element={<ComplaintDetail />} />
    </Routes>
  );
};

export default TravelerRoutes;
