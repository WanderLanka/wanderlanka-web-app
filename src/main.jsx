import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.jsx'
import Auth from './Auth.jsx'

import ProtectedRoute from './ProtectedRoute.jsx'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate // ✅ Make sure to import this
} from 'react-router-dom';
import TransportLayout from './TransportLayout.jsx'
import TransportDashboard from './TransportDashboard.jsx'
import VehiclesPage from './VehiclesPage.jsx'
import AccommodationLayout from './AccommodationLayout.jsx'
import AccommodationDashboard from './AccommodationDashboard.jsx'
import AccommodationPayments from './AccommodationPayments.jsx'
import HotelsPage from './HotelsPage.jsx'
import Rooms from './Rooms.jsx'
import Bookings from './Bookings.jsx'
import AdminLayout from './AdminLayout.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import AdminPayment from './AdminPayment.jsx'
import AdminRequests from './AdminRequests.jsx'
import AdminComplains from './AdminComplains.jsx'
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
