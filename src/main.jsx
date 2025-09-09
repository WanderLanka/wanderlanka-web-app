import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Import from organized folders
import { 
  Home, 
  Auth,
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
  AdminComplains
} from './pages';

import { ProtectedRoute } from './components';

import {
  TransportLayout,
  AccommodationLayout,
  AdminLayout
} from './layouts';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
// import TransportDetailsPage from './TransportDetailsPage.jsx'
// HotelDetailsPage from './HotelDetailsPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
      

     <Route element={<ProtectedRoute allowedRoles={["transport"]} />}>
        <Route path="/transport" element={<TransportLayout/>} >
           <Route index element={<TransportDashboard />} />
           <Route path="vehicles" element={<VehiclesPage/>} />
        </Route>
      </Route>

    <Route element={<ProtectedRoute allowedRoles={["accommodation"]} />}>
      <Route path="/accommodation" element={<AccommodationLayout />}>
        <Route index element={<AccommodationDashboard />} />
        <Route path="hotels" element={<HotelsPage />} />
        <Route path="hotels/:hotelid" element={<Rooms/>}/>
        <Route path="bookings" element={<Bookings/>}/>
        <Route path="payments" element={<AccommodationPayments/>}/>
      </Route>
    </Route>

    <Route element={<ProtectedRoute allowedRoles={["Sysadmin"]} />}>
      <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard/>} />
      <Route path="payment" element={<AdminPayment/>} />
      <Route path="requests" element={<AdminRequests/>} />
      <Route path="complains" element={<AdminComplains/>}/>

      </Route>
    </Route>

       
      </Routes>
    </Router>
  </StrictMode>,
)
