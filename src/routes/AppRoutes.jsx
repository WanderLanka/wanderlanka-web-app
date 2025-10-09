import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  Home, 
  Auth,
  LandingPage,
  NotFound,
  TransportDashboard,
  VehiclesPage,
  AccommodationDashboard,
  AccommodationPayments,
  HotelsPage,
  Rooms,
  Bookings,
  AdminDashboard,
  AdminPayment,
  AdminRequests,
  AdminComplains,
  TravelerDashboard,
  MyBookings,
  MyTrips,
  Payments,
  Services,
  ServiceDetails,
  Profile
} from '../pages';
import { ProtectedRoute } from '../components';
import {
  TransportLayout,
  AccommodationLayout,
  AdminLayout,
  TravelerLayout
} from '../layouts';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected Transport Routes */}
      <Route element={<ProtectedRoute allowedRoles={["transport"]} />}>
        <Route path="/transport" element={<TransportLayout />} >
          <Route index element={<TransportDashboard />} />
          <Route path="vehicles" element={<VehiclesPage />} />
        </Route>
      </Route>

      {/* Protected Accommodation Routes */}
      <Route element={<ProtectedRoute allowedRoles={["accommodation"]} />}>
        <Route path="/accommodation" element={<AccommodationLayout />}>
          <Route index element={<AccommodationDashboard />} />
          <Route path="hotels" element={<HotelsPage />} />
          <Route path="hotels/:hotelid" element={<Rooms />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="payments" element={<AccommodationPayments />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["Sysadmin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="payment" element={<AdminPayment />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="complains" element={<AdminComplains />} />
        </Route>
      </Route>

      {/* Protected User/Tourist Routes */}
      <Route element={<ProtectedRoute allowedRoles={["traveler"]} />}>
        <Route path="/user" element={<TravelerLayout />}>
          <Route index element={<TravelerDashboard />} />
          <Route path="dashboard" element={<TravelerDashboard />} />
          <Route path="mybookings" element={<MyBookings />} />
          <Route path="mytrips" element={<MyTrips />} />
          <Route path="payments" element={<Payments />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetails />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
      
      {/* Catch all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
