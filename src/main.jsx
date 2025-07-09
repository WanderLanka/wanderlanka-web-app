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
import HotelsPage from './HotelsPage.jsx'
import Rooms from './Rooms.jsx'
// HotelDetailsPage from './HotelDetailsPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Auth" element={<Auth />} />
        <Route path="/tourist" element={<div>Tourist Dashboard</div>} />

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
      </Route>
    </Route>

       
      </Routes>
    </Router>
  </StrictMode>,
)
