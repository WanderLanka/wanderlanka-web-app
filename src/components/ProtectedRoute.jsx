import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  
  // Get role from stored user data instead of decoding token
  let role = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      role = user.role;
    }
  } catch (error) {
    console.error("Error parsing stored user data:", error);
  }

  if (!token || !role || !allowedRoles.includes(role)) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
