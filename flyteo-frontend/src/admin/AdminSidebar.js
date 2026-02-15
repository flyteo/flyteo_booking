import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext"
import api from "../axios"

export default function AdminSidebar() {
  const nav = useNavigate();
const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();

if (loading) return null;

if (!user || user.role !== "admin") return null;

 const logout = async () => {
  try {
    await api.post("/auth/logout"); // clears cookies
  } catch (err) {
    console.error("Logout failed", err);
  }

  window.location.href = "/home";
};
  
  return (
    <>
     {/* ================= MOBILE TOGGLE BUTTON ================= */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-palmGreen text-white px-3 py-2 rounded-lg shadow"
      >
        ☰
      </button>

      {/* ================= OVERLAY (MOBILE) ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}
   <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white shadow-xl p-6 z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
    <div className="w-64 bg-white shadow-xl h-screen fixed left-0 top-0 p-6">
      <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl text-palmGreen">
            Admin Panel
          </h2>

          {/* CLOSE BUTTON (MOBILE) */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

      <nav className="space-y-4 text-base">
        <NavLink
          to="/admin/dashboard"
          label="Dashboard"
          close={setOpen}
        />

        <NavLink
          to="/admin/hotels"
          label="Manage Hotels"
          close={setOpen}
        />

        <NavLink
          to="/admin/hotels/add"
          label="Add Hotel"
          close={setOpen}
        />

        <NavLink
          to="/admin/camping"
          label="Manage Camping"
          close={setOpen}
        />

        <NavLink
          to="/admin/camping/add"
          label="Add Camping"
          close={setOpen}
        />
        <NavLink
          to="/admin/villas"
          label="Manage Villas"
          close={setOpen}
        />


        <NavLink
          to="/admin/villas/add"
          label="Add Villa"
          close={setOpen}
        />
         <NavLink
          to="/admin/offers"
          label="Manage Offers"
          close={setOpen}
        />

  <NavLink
          to="/admin/coupons"
          label="Manage Coupons"
          close={setOpen}
        />
  <NavLink
          to="/admin/charts"
          label="Analytics"
          close={setOpen}
        />
        <NavLink
          to="/admin/room-availability"
          label="Room Availability"
          close={setOpen}
        />
        <NavLink
          to="/admin/villa-availability"
          label="Villa Availability"
          close={setOpen}
          />
          <NavLink 
          to="/admin/camping-availability"
          label="Camping Availability"
          close={setOpen} />

        <button
          onClick={logout}
         className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </nav>
      </div>
    </div>
 </>  );
}
function NavLink({ to, label, close }) {
  return (
    <Link
      to={to}
      onClick={() => close(false)}
      className="block text-rusticBrown hover:text-palmGreen"
    >
      {label}
    </Link>
  );
}