import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  AccommodationDashboard,
  AccommodationPayments,
  AccommodationProfile,
  HotelsPage,
  Rooms,
  AddNewAccommodation
} from '../pages';
import { ProviderBookings } from '../pages/accommodation';

const AccommodationRoutes = () => {
  return (
    <Routes>
      {/* Accommodation Dashboard - Default */}
      <Route index element={<AccommodationDashboard />} />
      
      {/* Hotels Management */}
      <Route path="hotels" element={<HotelsPage />} />
      
      {/* Add New Accommodation */}
      <Route path="add-new" element={<AddNewAccommodation />} />
      
      {/* Specific Hotel Rooms */}
      <Route path="hotels/:hotelid" element={<Rooms />} />
      
      {/* Bookings Management */}
      <Route path="bookings" element={<ProviderBookings />} />
      
      {/* Payments Management */}
      <Route path="payments" element={<AccommodationPayments />} />

      {/* Profile */}
      <Route path="profile" element={<AccommodationProfile />} />
    </Routes>
  );
};

export default AccommodationRoutes;
