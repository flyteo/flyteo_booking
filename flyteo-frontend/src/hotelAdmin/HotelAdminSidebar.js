import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../axios"

export default function HotelAdminSidebar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

 const { user, loading } = useAuth();

if (loading) return null;

if (!user || user.role !== "hotel-admin") return null;

  const logout = async () => {
  try {
    await api.post("/auth/logout"); // clears cookies
  } catch (err) {
    console.error("Logout failed", err);
  }

  window.location.href = "/home";
};


  const MenuItem = ({ to, label }) => (
  <Link
    to={to}
    className={`block px-4 py-3 rounded-lg transition ${
      pathname === to
        ? "bg-palmGreen text-white shadow"
        : "hover:bg-gray-100 text-gray-700"
    }`}
    onClick={() => setOpen(false)}
  >
    {label}
  </Link>
);

return (
  <>
    {/* 🔹 MOBILE TOP BAR */}
    <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white shadow flex items-center justify-between px-4 z-50">
      
      <button
        onClick={() => setOpen(true)}
        className="text-2xl text-palmGreen"
      >
        ☰
      </button>

      <h2 className="font-heading text-lg text-palmGreen">
        Hotel Admin
      </h2>

      <div className="w-6" /> {/* spacer */}
    </div>

    {/* 🔹 OVERLAY */}
    {open && (
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        onClick={() => setOpen(false)}
      />
    )}

    {/* 🔹 SIDEBAR */}
    <div
      className={`
        fixed top-0 left-0 h-screen w-72 bg-white shadow-2xl p-6 z-50
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:z-30
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-heading text-2xl text-palmGreen">
          Hotel Admin
        </h2>

        {/* Close Button (Mobile) */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden text-xl"
        >
          ✕
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-6">
        Hotel Management Panel
      </p>

      {/* Navigation */}
      <nav className="space-y-2 text-base">
        <MenuItem to="/hotel-admin/dashboard" label="Dashboard" />
        <MenuItem to="/hotel-admin/check-in" label="Bookings" />
        <MenuItem to="/hotel-admin/rooms" label="Room Availability" />

        <button
          onClick={logout}
          className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
        >
          Logout
        </button>
      </nav>
    </div>
  </>
);
}
