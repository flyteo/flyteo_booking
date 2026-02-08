import { Navigate } from "react-router-dom";

export default function ProtectedVillaAdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "villa-admin") return <Navigate to="/login" />;
  return children;
}
