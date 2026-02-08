import { useNavigate ,useLocation} from "react-router-dom";
import {useState, useEffect } from "react";

export default function BottomTabBar({ activePath }) {
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

  const tab = (path) =>
     `flex flex-col items-center justify-center gap-1 cursor-pointer ${
    activePath === path ? "text-palmGreen" : "text-gray-400"}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="grid grid-cols-5 text-center text-xs py-2">

      {/* HOME */}
        <div onClick={() => nav("/home")} className={tab("/home")}>
          <HomeIcon active={activePath === "/home"} />
          <p>Home</p>
        </div>

        {/* OFFERS */}
        <div onClick={() => nav("/offers")} className={tab("/offers")}>
          <OfferIcon />
          <p>Offers</p>
        </div>

        {/* CAMPING */}
        <div onClick={() => nav("/campings")} className={tab("/campings")}>
          <CampingIcon />
          <p>Camping</p>
        </div>

        {/* BOOKINGS */}
        <div
          onClick={() => alert("Currently booking is not available. Coming soon…")}
          className={tab("/home")}
        >
          <BookingIcon />
          <p>Bookings</p>
        </div>

        {/* PROFILE */}
        <div onClick={() => nav("/")} className={tab("/")}>
          <ProfileIcon />
          <p>Profile</p>
        </div>

      </div>
    </div>
  );
}


export function HomeIcon({ active }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-6 h-6 ${active ? "scale-110" : ""}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="homeGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD39A" />
          <stop offset="100%" stopColor="#FFB347" />
        </linearGradient>
      </defs>
      <path
        d="M3 11L12 4l9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z"
        fill="url(#homeGlow)"
      />
    </svg>
  );
}

export function OfferIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <defs>
        <linearGradient id="percentGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE0B3" />
          <stop offset="100%" stopColor="#FFB347" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="11" fill="url(#percentGrad)" />
      <text
        x="12"
        y="15"
        textAnchor="middle"
        fontSize="9"
        fill="#fff"
        fontWeight="bold"
      >
        %
      </text>
    </svg>
  );
}

export function CampingIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M3 18L12 5l9 13H3z" fill="#FFA500" />
      <rect x="2" y="18" width="20" height="2" fill="#FF7A00" />
      <path d="M12 6v12" stroke="#fff" strokeWidth="1.8" />
    </svg>
  );
}

export function BookingIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <rect x="5" y="3" width="14" height="18" rx="2" fill="#FF8C00" />
      <rect x="8" y="7" width="8" height="2" fill="#fff" />
      <rect x="8" y="11" width="8" height="2" fill="#fff" />
      <rect x="8" y="15" width="6" height="2" fill="#fff" />
    </svg>
  );
}

export function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6">
      <circle cx="12" cy="8" r="4" fill="#FFB347" />
      <path
        d="M4 20c0-4 16-4 16 0"
        fill="#FFA500"
      />
    </svg>
  );
}
