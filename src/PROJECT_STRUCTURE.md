# Wanderlanka Web App - Project Structure

## 📁 Folder Structure

```
src/
├── components/          # Reusable UI components (using Tailwind CSS)
│   ├── AccommodationNavbar.jsx
│   ├── AdminNavBar.jsx
│   ├── TransportNavBar.jsx
│   ├── ProtectedRoute.jsx
│   ├── Button.jsx      # Styled with Tailwind CSS
│   ├── Card.jsx        # Styled with Tailwind CSS
│   └── index.js        # Barrel exports
├── pages/              # Route/Page components (using Tailwind CSS)
│   ├── Auth.jsx
│   ├── Home.jsx
│   ├── LandingPage.jsx # Styled with Tailwind CSS
│   ├── NotFound.jsx    # Styled with Tailwind CSS
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
├── styles/             # Legacy CSS files
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
├── index.css           # Main CSS file with Tailwind imports
└── main.jsx            # App entry point
```

## 🎨 Styling Approach

### Tailwind CSS Integration
The project now uses **Tailwind CSS** for styling modern components:

- **LandingPage**: Fully styled with Tailwind CSS classes
- **Button Component**: Custom button with multiple variants using Tailwind
- **Card Component**: Flexible card component with Tailwind styling  
- **NotFound Page**: 404 error page with Tailwind styling

### Tailwind Configuration
Custom colors and utilities defined in `tailwind.config.js`:
```js
colors: {
  wanderlanka: {
    blue: '#2c5aa0',
    darkblue: '#1e3d6f', 
    coral: '#ff6b6b',
    lightcoral: '#ff5252',
  }
}
```

### Legacy CSS
Existing components still use traditional CSS files in the `styles/` folder. These will be gradually migrated to Tailwind CSS.

## 📝 Import Guidelines

### Using Tailwind Classes
```jsx
// Tailwind CSS example
<div className="bg-wanderlanka-blue text-white px-6 py-3 rounded-full">
  WanderLanka Button
</div>
```

### Using New Components
```jsx
// Import modern components
import { Button, Card } from '../components';

// Usage
<Button variant="primary" size="large">Click Me</Button>
<Card hover={true} padding="large">Card Content</Card>
```

### Using Barrel Exports
```jsx
// Import multiple components from the same folder
import { LandingPage, NotFound, Auth } from './pages';
```

### Legacy CSS Imports
```jsx
// For components still using CSS files
import '../styles/ComponentName.css';
```

### Service Imports
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

- **Modern Styling**: Tailwind CSS for rapid, responsive design
- **Component Reusability**: Flexible Button and Card components
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Consistent Design System**: Custom color palette and utilities
- **Modularity**: Easy to find and maintain specific types of files
- **Scalability**: Clear separation of concerns for future growth
- **Import Organization**: Cleaner imports with barrel exports
- **Team Collaboration**: Consistent structure for multiple developers

## 🎯 Future Migration

Legacy components will be gradually migrated from CSS to Tailwind CSS for:
- Better performance
- Smaller bundle sizes  
- Consistent design system
- Easier maintenance
