import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/flyteo-logo.png";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Refresh navbar on route change
  useEffect(() => {
    const u = localStorage.getItem("user");
    setUser(u ? JSON.parse(u) : null);
    setMenuOpen(false); // close menu on route change
  }, [location]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    nav("/login");
  };

  // Hide navbar for admin users
  if (user?.role === "admin") return null;

  return (
    <header className="bg-sand shadow sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Flyteo" className="w-12 h-12" />
          <div className="hidden sm:block">
            <h1 className="font-heading text-xl text-palmGreen">
              FLYTEO.IN
            </h1>
            <p className="text-xs text-rusticBrown">
              Hotel · Camping · Villas
            </p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 font-body">
          <NavLinks user={user} logout={logout} />
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-3xl text-palmGreen"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex flex-col gap-4">

          {/* CLOSE */}
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
          <Link className={base} to="/about">About Us</Link>
          <Link className={base} to="/privacy-policy">Privacy Policy</Link>
          <Link className={base} to="/terms-condition">Terms & Conditions</Link>
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
