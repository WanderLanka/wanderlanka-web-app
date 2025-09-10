# WanderLanka Web App - Project Structure

## Overview

This document outlines the structure and organization of the WanderLanka web application, a React-based platform for tourism services in Sri Lanka.

## Root Directory Structure

```
wanderlanka-web-app/
├── public/                     # Static assets
├── src/                        # Source code
├── .env.example               # Environment variables template
├── .env.development           # Development environment (gitignored)
├── .env.production            # Production environment (gitignored)
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML template
├── README.md                  # Project README
└── ENVIRONMENT_SETUP.md       # Environment setup guide
```

## Source Code Structure (`src/`)

```
src/
├── components/                 # Reusable UI components
│   ├── landing/               # Landing page components
│   ├── navigation/            # Navigation components
│   │   ├── admin/             # Admin navigation
│   │   ├── transport/         # Transport navigation
│   │   └── accommodation/     # Accommodation navigation
│   ├── ProtectedRoute.jsx     # Route protection component
│   └── index.js               # Component exports
├── pages/                     # Page components
│   ├── admin/                 # Admin dashboard pages
│   ├── transport/             # Transport provider pages
│   ├── accommodation/         # Accommodation provider pages
│   ├── auth/                  # Authentication pages
│   ├── user/                  # User-specific pages
│   ├── LandingPage.jsx        # Main landing page
│   ├── Home.jsx               # Home page
│   ├── NotFound.jsx           # 404 error page
│   └── index.js               # Page exports
├── routes/                    # Routing configuration
│   ├── AppRoutes.jsx          # Main routes
│   ├── AdminRoutes.jsx        # Admin routes
│   ├── TransportRoutes.jsx    # Transport routes
│   ├── AccommodationRoutes.jsx # Accommodation routes
│   ├── PublicRoutes.jsx       # Public routes
│   └── index.js               # Route exports
├── layouts/                   # Layout components
│   ├── AdminLayout.jsx        # Admin layout
│   ├── TransportLayout.jsx    # Transport layout
│   └── AccommodationLayout.jsx # Accommodation layout
├── services/                  # API and service utilities
│   ├── api.js                 # API service methods
│   ├── auth.js                # Authentication utilities
│   ├── axiosConfig.js         # Axios configuration
│   ├── config.ts              # Service configurations
│   ├── storage.ts             # Storage utilities
│   └── index.js               # Service exports
├── config/                    # Application configuration
│   └── config.js              # Centralized config
├── docs/                      # Documentation
│   ├── API_CONFIGURATION.md   # API setup guide
│   ├── ROUTES_SYSTEM.md       # Routing documentation
│   └── PROJECT_STRUCTURE.md   # This file
├── assets/                    # Static assets
│   ├── images/                # Image files
│   └── fonts/                 # Font files
├── hooks/                     # Custom React hooks
├── utils/                     # Utility functions
├── types/                     # TypeScript type definitions
├── constants/                 # Application constants
├── context/                   # React context providers
├── main.jsx                   # Application entry point
└── index.css                  # Global styles
```

## Component Organization

### 1. Pages (`src/pages/`)
Page components represent full screens/views in the application.

#### Admin Pages
- **AdminDashboard.jsx** - Main admin dashboard
- **AdminPayment.jsx** - Payment management
- **AdminRequests.jsx** - User requests
- **AdminComplains.jsx** - Complaint management

#### Transport Pages
- **TransportDashboard.jsx** - Transport provider dashboard
- **VehiclesPage.jsx** - Vehicle management

#### Accommodation Pages
- **AccommodationDashboard.jsx** - Accommodation dashboard
- **HotelsPage.jsx** - Hotel management
- **Rooms.jsx** - Room management
- **AccommodationPayments.jsx** - Payment management

#### Authentication Pages
- **Auth.jsx** - Login and registration

### 2. Components (`src/components/`)
Reusable UI components organized by feature/domain.

#### Landing Components
- **HeroSection.jsx** - Hero section
- **DestinationsSection.jsx** - Destinations showcase
- **ExperiencesSection.jsx** - Experience highlights
- **TestimonialsSection.jsx** - User testimonials
- **Footer.jsx** - Site footer
- **Navbar.jsx** - Landing page navigation

#### Navigation Components
Domain-specific navigation components:
- **AdminNavBar.jsx** - Admin navigation
- **TransportNavBar.jsx** - Transport navigation
- **AccommodationNavBar.jsx** - Accommodation navigation

### 3. Services (`src/services/`)
API and external service integration.

#### Core Services
- **axiosConfig.js** - HTTP client configuration
- **api.js** - API endpoint methods
- **auth.js** - Authentication utilities

### 4. Routes (`src/routes/`)
React Router configuration organized by domain.

## Configuration Files

### Environment Configuration
- **`.env.example`** - Template for environment variables
- **`.env.development`** - Development environment settings
- **`.env.production`** - Production environment settings

### Build Configuration
- **`vite.config.js`** - Vite bundler configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`postcss.config.js`** - PostCSS processing
- **`eslint.config.js`** - Code linting rules

## Key Features

### 1. Role-Based Access Control
- Different dashboards for different user types
- Protected routes with role verification
- Automatic redirects based on user role

### 2. Modular Architecture
- Domain-specific route organization
- Reusable component structure
- Centralized service management

### 3. Development Tools
- Hot reload with Vite
- Tailwind CSS for styling
- ESLint for code quality
- Environment-based configuration

## Technology Stack

### Frontend Framework
- **React 19.1.0** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server

### Styling
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **PostCSS** - CSS processing

### HTTP Client
- **Axios 1.10.0** - Promise-based HTTP client
- **Custom interceptors** - Request/response handling

### Development Tools
- **ESLint** - Code linting
- **Lucide React** - Icon library

## Naming Conventions

### Files and Directories
- **PascalCase** for React components (`AdminDashboard.jsx`)
- **camelCase** for utilities and services (`axiosConfig.js`)
- **kebab-case** for assets and configs (`tailwind.config.js`)
- **UPPERCASE** for documentation (`README.md`)

### Components
- **Descriptive names** reflecting functionality
- **Domain prefixes** for clarity (`AdminNavBar`, `TransportDashboard`)
- **Consistent suffixes** (`Page`, `Layout`, `Modal`)

## Development Workflow

### 1. Adding New Features
1. Create page component in appropriate domain folder
2. Add routes to relevant route file
3. Create/update navigation components
4. Add API services if needed
5. Update documentation

### 2. Styling Guidelines
- Use Tailwind utility classes
- Create custom components for reusable patterns
- Maintain consistent spacing and color schemes
- Responsive design first

### 3. State Management
- Local state for component-specific data
- Context for shared application state
- Services for API state management

## Build and Deployment

### Development
```bash
npm run dev          # Start development server
npm run lint         # Run ESLint
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

## Documentation Standards

### Code Documentation
- JSDoc comments for complex functions
- README files for major features
- Inline comments for business logic

### API Documentation
- Endpoint documentation in service files
- Request/response examples
- Error handling guidelines

## Security Considerations

### Environment Variables
- Sensitive data in environment files
- Git ignore for actual environment files
- Example templates for team setup

### Authentication
- Token-based authentication
- Role-based access control
- Automatic token refresh handling

## Future Enhancements

### Planned Features
1. **TypeScript Migration** - Gradual migration to TypeScript
2. **Testing Suite** - Unit and integration tests
3. **PWA Features** - Offline capability
4. **Internationalization** - Multi-language support
5. **Performance Optimization** - Code splitting and lazy loading

### Scalability Considerations
- Micro-frontend architecture possibility
- Component library extraction
- API versioning support
- Caching strategies

---

This structure provides a solid foundation for the WanderLanka web application while maintaining flexibility for future growth and enhancements.
