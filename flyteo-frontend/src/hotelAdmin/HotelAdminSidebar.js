import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function HotelAdminSidebar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);

  if (!user || user.role !== "hotel-admin") return null;

  const logout = () => {
    localStorage.clear();
    window.location.href = "/"; // Force full reload to clear state
  };

  const MenuItem = ({ to, label }) => (
    <Link
      to={to}
      className={`block px-4 py-2 rounded ${
        pathname === to
          ? "bg-palmGreen text-white"
          : "hover:bg-gray-100"
      }`}
      onClick={() => setOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-palmGreen text-white px-3 py-2 rounded"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow p-6 z-40 transform transition-transform
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="font-heading text-2xl text-palmGreen mb-6">
          Hotel Admin
        </h2>

        <nav className="space-y-2 text-lg">
          <MenuItem to="/hotel-admin/dashboard" label="Dashboard" />
          <MenuItem to="/hotel-admin/check-in" label="Bookings" />
          <MenuItem to="/hotel-admin/rooms" label="Room Availability" />

          <button
            onClick={logout}
            className="mt-6 w-full bg-red-600 text-white py-2 rounded"
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  );
}
