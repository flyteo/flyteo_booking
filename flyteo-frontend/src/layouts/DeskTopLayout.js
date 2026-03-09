import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import useIsMobile from "../hooks/useIsmobile";

export default function DeskTopLayout() {
  const isMobile = useIsMobile();

  if (isMobile) return <Outlet />;

  return (
    <div className="bg-sand min-h-screen">
      <Navbar />
      <div className="pt-24">
        <Outlet />
      </div>
    </div>
  );
}
