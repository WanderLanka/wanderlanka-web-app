import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  AccommodationDashboard,
  AccommodationPayments,
  HotelsPage,
  Rooms,
  Bookings
} from '../pages';

const AccommodationRoutes = () => {
  return (
    <Routes>
      {/* Accommodation Dashboard - Default */}
      <Route index element={<AccommodationDashboard />} />
      
      {/* Hotels Management */}
      <Route path="hotels" element={<HotelsPage />} />
      
      {/* Specific Hotel Rooms */}
      <Route path="hotels/:hotelid" element={<Rooms />} />
      
      {/* Bookings Management */}
      <Route path="bookings" element={<Bookings />} />
      
      {/* Payments Management */}
      <Route path="payments" element={<AccommodationPayments />} />
    </Routes>
  );
};

export default AccommodationRoutes;
