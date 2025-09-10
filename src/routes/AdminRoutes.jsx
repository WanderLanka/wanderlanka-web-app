import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  AdminDashboard,
  AdminPayment,
  AdminRequests,
  AdminComplains
} from '../pages';

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Admin Dashboard - Default */}
      <Route index element={<AdminDashboard />} />
      
      {/* Admin Payment Management */}
      <Route path="payment" element={<AdminPayment />} />
      
      {/* Admin Requests Management */}
      <Route path="requests" element={<AdminRequests />} />
      
      {/* Admin Complaints Management */}
      <Route path="complains" element={<AdminComplains />} />
    </Routes>
  );
};

export default AdminRoutes;
