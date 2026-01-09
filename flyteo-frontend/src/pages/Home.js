import { useEffect, useState } from "react";
import { lazy, Suspense } from "react";
import PageLoader from "./PageLoader";
import useIsMobile from "../hooks/useIsmobile";

const MobileHome = lazy(() => import("./MobileHome"));
const DesktopHome = lazy(() => import("./DesktopHome"));

export default function Home() {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

 return (
    <Suspense fallback={<PageLoader />}>
      {isMobile ? <MobileHome /> : <DesktopHome />}
    </Suspense>
  );
}
