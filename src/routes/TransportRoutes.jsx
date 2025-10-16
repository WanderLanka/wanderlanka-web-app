import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  TransportDashboard,
  VehiclesPage
} from '../pages';

const TransportRoutes = () => {
  return (
    <Routes>
      {/* Transport Dashboard - Default */}
      <Route index element={<TransportDashboard />} />
      
      {/* Vehicles Management */}
      <Route path="vehicles" element={<VehiclesPage />} />
    </Routes>
  );
};

export default TransportRoutes;
