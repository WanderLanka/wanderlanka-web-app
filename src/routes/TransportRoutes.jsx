import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  TransportDashboard,
  VehiclesPage,
  TransportTrips
} from '../pages';
import AddNewTransport from '../pages/transport/AddNewTransport';
import Drivers from '../pages/transport/Drivers';

const TransportRoutes = () => {
  return (
    <Routes>
      {/* Transport Dashboard - Default */}
      <Route index element={<TransportDashboard />} />
      
      {/* Vehicles Management */}
      <Route path="vehicles" element={<VehiclesPage />} />
      <Route path="add-new" element={<AddNewTransport />} />
      
      {/* Operations */}
      <Route path="trips" element={<TransportTrips />} />
      
      {/* Personnel Management */}
      <Route path="drivers" element={<Drivers />} />
      
    </Routes>
  );
};

export default TransportRoutes;
