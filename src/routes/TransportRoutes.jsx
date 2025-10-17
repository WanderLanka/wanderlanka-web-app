import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  TransportDashboard,
  VehiclesPage
} from '../pages';
import AddNewTransport from '../pages/transport/AddNewTransport';

const TransportRoutes = () => {
  return (
    <Routes>
      {/* Transport Dashboard - Default */}
      <Route index element={<TransportDashboard />} />
      
      {/* Vehicles Management */}
      <Route path="vehicles" element={<VehiclesPage />} />
      <Route path="add-new" element={<AddNewTransport />} />
    </Routes>
  );
};

export default TransportRoutes;
