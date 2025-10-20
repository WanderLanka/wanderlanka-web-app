import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';
import { TripPlanningProvider } from './contexts/TripPlanningContext.jsx';
import { ChatProvider } from './contexts/ChatContext.jsx';
import { ChatWidget } from './components';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TripPlanningProvider>
      <ChatProvider>
        <Router>
          <ToastContainer 
            position="top-right" 
            autoClose={5000} 
            hideProgressBar={false} 
            newestOnTop={false} 
            closeOnClick 
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover 
          />
          <AppRoutes />
          <ChatWidget />
        </Router>
      </ChatProvider>
    </TripPlanningProvider>
  </StrictMode>,
)
