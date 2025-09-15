import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  TravelerDashboard,
} from '../pages';

const TravelerRoutes = () => {
  return (
    <Routes>
      {/* Transport Dashboard - Default */}
      <Route index element={<TravelerDashboard />} />
    
    </Routes>
  );
};

export default TravelerRoutes;
