import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/flyteo-logo.png";
import { FaWhatsapp } from "react-icons/fa";
import { MdLocalPhone } from "react-icons/md";
import  { useAuth }  from "../context/AuthContext";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

   // 🚨 wait until auth is restored
  if (loading) return null;

  // 🚫 hide navbar for admin dashboards
  if (
    user &&
    (user.role === "admin" ||
      user.role === "hotel-admin" ||
      user.role === "villa-admin")
  ) {
    return null;
  }


  return (
  <header className="bg-sand shadow sticky top-0 z-50">
  {/* ================= MOBILE NAVBAR ================= */}
  <div className="md:hidden px-4 py-3 flex items-center justify-between relative">

    {/* LEFT: MENU TOGGLE */}
    <button
      className="text-3xl text-palmGreen"
      onClick={() => setMenuOpen(true)}
      aria-label="Open menu"
    >
      ☰
    </button>

    {/* CENTER: LOGO + NAME */}
    <Link
      to="/home"
      className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
    >
      <img
        src={logo}
        alt="Flyteo"
        className="w-9 h-9 object-contain"
      />
      <span className="font-heading text-lg text-palmGreen">
        Flyteo.in
      </span>
    </Link>

    {/* RIGHT: WHATSAPP + CALL */}
    <div className="flex items-center gap-3">
      <a
        href="https://wa.me/918975995125"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-600 text-2xl"
        aria-label="WhatsApp"
      >
        <FaWhatsapp/>
      </a>

      <a
        href="tel:+918975995125"
        className="text-blue-600 text-2xl"
        aria-label="Call"
      >
        <MdLocalPhone/>
      </a>
    </div>
  </div>

  {/* ================= DESKTOP NAVBAR (UNCHANGED) ================= */}
  <div className="hidden md:flex container mx-auto px-6 py-4 items-center justify-between">

    {/* LEFT: LOGO */}
    <Link to="/home" className="flex items-center gap-3">
      <img src={logo} alt="Flyteo" className="w-12 h-12" />
      <div>
        <h1 className="font-heading text-xl text-palmGreen">
          FLYTEO.IN
        </h1>
        <p className="text-xs text-rusticBrown">
          Hotel · Camping · Villas
        </p>
      </div>
    </Link>

    {/* RIGHT: DESKTOP LINKS */}
    <nav className="flex items-center gap-6 font-body">
      <NavLinks user={user} logout={logout} />
    </nav>
  </div>

  {/* ================= MOBILE DRAWER ================= */}
  {menuOpen && (
    <div
      className="fixed inset-0 bg-black/40 z-40"
      onClick={() => setMenuOpen(false)}
    />
  )}

  <div
    className={`fixed top-0 right-0 w-72 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300
    ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
  >
    <div className="p-6 flex flex-col gap-4">
      <button
        className="self-end text-2xl"
        onClick={() => setMenuOpen(false)}
      >
        ✕
      </button>

      <NavLinks user={user} logout={logout} mobile />
    </div>
  </div>
</header>


  );
}

/* ----------------- NAV LINKS ----------------- */

function NavLinks({ user, logout, mobile }) {
  const base =
    "block text-lg md:text-base py-2 md:py-0";

  return (
    <>
      <Link className={base} to="/">Home</Link>
      <Link className={base} to="/hotels">Hotels</Link>
      <Link className={base} to="/campings">Camping</Link>
      <Link className={base} to="/villas">Villas</Link>

      {/* MOBILE-ONLY STATIC PAGES */}
      {mobile && (
        <>
          <hr className="my-3" />
          <Link className={base} to="/aboutus">About Us</Link>
          <Link className={base} to="/privacy-policy">Privacy Policy</Link>
          <Link className={base} to="/terms-condition">Terms & Conditions</Link>
           <Link className={base} to="/cancellation-policy">Cancellation Policy</Link>
          <Link className={base} to="/contact">Contact Us</Link>
        </>
      )}
      

      {user ? (
        <>
          {user.role === "user" && (
            <Link className={base} to="/my-bookings">
              My Bookings
            </Link>
          )}

          {user.role === "hotel-admin" && (
            <Link
              className={`${base} font-semibold text-palmGreen`}
              to="/hotel-admin/dashboard"
            >
              Hotel Admin
            </Link>
          )}
           {user.role === "villa-admin" && (
            <Link
              className={`${base} font-semibold text-palmGreen`}
              to="/villa-admin/dashboard"
            >
              Villa Admin
            </Link>
          )}

          <button
            onClick={logout}
            className={`mt-4 md:mt-0 ${
              mobile ? "w-full" : ""
            } bg-red-600 text-white px-4 py-2 rounded`}
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          to="/login"
          className={`mt-4 md:mt-0 ${
            mobile ? "w-full text-center" : ""
          } bg-rusticBrown px-4 py-2 text-white rounded`}
        >
          Login
        </Link>
      )}
    </>
  );
}
