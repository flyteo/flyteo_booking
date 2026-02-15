import { Link, useNavigate ,useLocation} from "react-router-dom";
import {useState} from "react"
import api from "../axios";
import { useAuth } from "../context/AuthContext";

export default function VillaAdminSidebar() {
  const nav = useNavigate();
   const { pathname } = useLocation();
   const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();

if (loading) return null;

if (!user || user.role !== "villa-admin") return null;
  


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
     <button
        className="md:hidden fixed top-4 left-4 z-50 bg-palmGreen text-white px-3 py-2 rounded"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>
    <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow p-6 z-40 transform transition-transform
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
      <h2 className="font-heading text-2xl text-palmGreen mb-6">
        Villa Admin
      </h2>

      <nav className="space-y-2 text-lg">
        <MenuItem to="/villa-admin/dashboard" label="Dashboard" />
          <MenuItem to="/villa-admin/bookings" label="Bookings" />
          <MenuItem to="/villa-admin/calendar" label="Villa Availability" />

        <button
          onClick={logout}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded"
        >
          Logout
        </button>
      </nav>
    </div>
</>  );
}
