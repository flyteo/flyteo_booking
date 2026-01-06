import { Navigate } from "react-router-dom";

export default function ProtectedHotelAdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "hotel-admin") return <Navigate to="/login" />;
  return children;
}
