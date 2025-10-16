# Routes Directory

This directory contains the routing configuration for the WanderLanka web application.

## Files

- **AppRoutes.jsx** - Main routing component
- **AdminRoutes.jsx** - Admin dashboard routes
- **TransportRoutes.jsx** - Transport provider routes
- **AccommodationRoutes.jsx** - Accommodation provider routes
- **PublicRoutes.jsx** - Public/unauthenticated routes
- **index.js** - Route exports

## Documentation

For comprehensive routing documentation, see:
**[Routes System Documentation](../docs/ROUTES_SYSTEM.md)**

## Quick Reference

### Adding New Routes

1. **Public Routes**: Add to `PublicRoutes.jsx`
2. **Protected Routes**: Add to the appropriate domain file
3. **New Role Section**: Create new routes file and update `AppRoutes.jsx`

### Route Protection

All protected routes must be wrapped with `ProtectedRoute` component and specify allowed roles.

```jsx
<Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
  </Route>
</Route>
```