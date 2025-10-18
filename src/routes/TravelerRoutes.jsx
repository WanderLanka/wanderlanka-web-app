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
  TourGuideDetails,
  BookingPayment
} from '../pages';

const TravelerRoutes = () => {
  return (
    <Routes>
      {/* Traveler Dashboard - Default */}
      <Route index element={<TravelerDashboard />} />
      
      {/* Trip Planning */}
      <Route path="trip-planning" element={<TripPlanning />} />
      
      {/* Booking Payment */}
      <Route path="booking-payment" element={<BookingPayment />} />
      
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
    </Routes>
  );
};

export default TravelerRoutes;
