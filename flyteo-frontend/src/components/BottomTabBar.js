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
    activePath === path ? "text-palmGreen" : "text-gray-400";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="grid grid-cols-5 text-center text-xs py-2">

        <div onClick={() => nav("/")} className={tab("/")}>
          🏠
          <p>Home</p>
        </div>

        <div onClick={() => nav("/offers")} className={tab("/offers")}>
          🔍
          <p>Offers</p>
        </div>

        <div onClick={() => nav("/campings")} className={tab("/campings")}>
          ⛺
          <p>Camping</p>
        </div>

        <div onClick={() => alert("Currently not available Coming Soon...")} className={tab("/mybooking")}>
          📖
          <p>Bookings</p>
        </div>

        <div onClick={() => nav("/login")} className={tab("/login")}>
          👤
          <p>Profile</p>
        </div>

      </div>
    </div>
  );
}