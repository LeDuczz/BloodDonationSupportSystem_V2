import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoute = ({ allowedRoles, redirectTo = "/login" }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/404" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;