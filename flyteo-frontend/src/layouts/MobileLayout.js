import { Outlet, useLocation } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import useIsMobile from "../hooks/useIsmobile";
import Navbar from "../components/Navbar";

export default function MobileLayout() {
  const isMobile = useIsMobile();
  const location = useLocation();

  const hideTabs =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/admin")  ||
    location.pathname.startsWith("/villa-admin") ||
    location.pathname.startsWith("/hotel-admin")

  if (!isMobile) return <Outlet />;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-100">

      {/* TOP NAVBAR (MOBILE) */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main className="pt-8 pb-20 w-full">
        <Outlet />
      </main>

      {/* BOTTOM TAB BAR */}
      {!hideTabs && (
        <BottomTabBar activePath={location.pathname} />
      )}
    </div>
  );
}
