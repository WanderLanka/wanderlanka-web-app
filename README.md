# WanderLanka Web Application

A comprehensive tourism platform for Sri Lanka, built with React and Vite. The application provides role-based dashboards for different types of service providers including transport, accommodation, and tour guides.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

This application features:
- **Role-based authentication** (Admin, Transport, Accommodation providers)
- **Protected routing** with automatic redirects
- **Centralized API configuration** through axios
- **Modular component structure** organized by domain
- **Responsive design** with Tailwind CSS

## 📚 Documentation

### For Developers
- **[📋 Documentation Index](./src/docs/README.md)** - Complete documentation overview
- **[🏗️ Project Structure](./src/docs/PROJECT_STRUCTURE.md)** - Codebase organization
- **[🛣️ Routes System](./src/docs/ROUTES_SYSTEM.md)** - Routing architecture
- **[⚙️ API Configuration](./src/docs/API_CONFIGURATION.md)** - API setup and usage

### For Setup
- **[🔧 Environment Setup](./src/docs/ENVIRONMENT_SETUP.md)** - Development environment configuration

## 🔑 User Roles

- **Tourists** - Browse and book services
- **Transport Providers** - Manage vehicles and bookings
- **Accommodation Providers** - Manage hotels and rooms
- **Tour Guides** - Manage tour packages
- **System Administrators** - Oversee platform operations

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 4.1.13
- **HTTP Client**: Axios 1.10.0
- **Icons**: Lucide React
- **Development**: ESLint + Hot Reload

## 📝 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Read the [Project Structure](./src/docs/PROJECT_STRUCTURE.md) documentation
2. Follow the established patterns for components and routing
3. Update documentation when adding new features
4. Ensure all routes are properly protected with role-based access

## 📞 Support

For technical questions, refer to the documentation in `src/docs/` or review existing implementations in the codebase.
