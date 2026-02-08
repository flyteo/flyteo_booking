import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function RoleRedirect() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/home" replace />;
  }

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;

    case "hotel-admin":
      return <Navigate to="/hotel-admin/dashboard" replace />;

    case "villa-admin":
      return <Navigate to="/villa-admin/dashboard" replace />;

    default:
      return <Navigate to="/home" replace />;
  }
}
