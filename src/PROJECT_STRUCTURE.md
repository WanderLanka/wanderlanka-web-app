# Wanderlanka Web App - Project Structure

## 📁 Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── AccommodationNavbar.jsx
│   ├── AdminNavBar.jsx
│   ├── TransportNavBar.jsx
│   ├── ProtectedRoute.jsx
│   └── index.js        # Barrel exports
├── pages/              # Route/Page components
│   ├── Auth.jsx
│   ├── Home.jsx
│   ├── AccommodationDashboard.jsx
│   ├── AccommodationPayments.jsx
│   ├── AdminComplains.jsx
│   ├── AdminDashboard.jsx
│   ├── AdminPayment.jsx
│   ├── AdminRequests.jsx
│   ├── Bookings.jsx
│   ├── HotelsPage.jsx
│   ├── Rooms.jsx
│   ├── TransportDashboard.jsx
│   ├── VehiclesPage.jsx
│   └── index.js        # Barrel exports
├── layouts/            # Layout components
│   ├── AccommodationLayout.jsx
│   ├── AdminLayout.jsx
│   ├── TransportLayout.jsx
│   └── index.js        # Barrel exports
├── services/           # API calls and business logic
│   ├── auth.js
│   ├── axiosConfig.js
│   └── index.js        # Barrel exports
├── styles/             # CSS files
│   ├── AccommodationNavbar.css
│   ├── AccommodationPayments.css
│   ├── AccomodationDashboard.css
│   ├── AdminComplains.css
│   ├── AdminDashboard.css
│   ├── AdminNavBar.css
│   ├── AdminPayment.css
│   ├── AdminRequests.css
│   ├── Auth.css
│   ├── Bookings.css
│   ├── HotelsPage.css
│   ├── Rooms.css
│   ├── TransportDashboard.css
│   ├── TransportNavbar.css
│   └── VehiclesPage.css
├── hooks/              # Custom React hooks (empty for now)
├── utils/              # Utility functions (empty for now)
├── index.css           # Main CSS file
└── main.jsx            # App entry point
```

## 📝 Import Guidelines

### Using Barrel Exports
You can now import multiple components from the same folder using barrel exports:

```jsx
// Instead of multiple imports
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';

// Use barrel exports
import { Home, Auth } from './pages';
```

### CSS Imports
CSS files are now organized in the `styles/` folder:

```jsx
// In components folder
import '../styles/ComponentName.css';

// In pages folder  
import '../styles/PageName.css';
```

### Service Imports
Service files like API configurations are in the `services/` folder:

```jsx
import api from '../services/axiosConfig';
import { getRoleFromToken } from '../services/auth';
```

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 📋 Benefits of This Structure

- **Modularity**: Easy to find and maintain specific types of files
- **Scalability**: Clear separation of concerns for future growth
- **Reusability**: Components can be easily reused across pages
- **Import Organization**: Cleaner imports with barrel exports
- **Team Collaboration**: Consistent structure for multiple developers
