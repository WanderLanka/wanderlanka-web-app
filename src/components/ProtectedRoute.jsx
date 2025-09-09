import { Navigate, Outlet } from "react-router-dom";
import { getRoleFromToken } from "../services/auth.js";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = getRoleFromToken();

  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
