import { Link, useNavigate } from "react-router-dom";

export default function HotelAdminSidebar() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "hotel-admin") return null;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/login");
  };

  return (
    <div className="w-64 bg-white shadow h-screen fixed left-0 top-0 p-6">

      <h2 className="font-heading text-2xl text-palmGreen mb-6">
        Hotel Admin
      </h2>

      <nav className="space-y-4 text-lg">

        <Link to="/hotel-admin/dashboard">Dashboard</Link>
        <Link to="/hotel-admin/rooms">Rooms</Link>
        <Link to="/hotel-admin/bookings">Bookings</Link>
        <Link to="/hotel-admin/profile">Hotel Profile</Link>

        <button
          onClick={logout}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded"
        >
          Logout
        </button>

      </nav>
    </div>
  );
}
