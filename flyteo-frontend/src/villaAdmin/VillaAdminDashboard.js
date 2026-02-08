import { useEffect, useState } from "react";
import api from "../axios";
import VillaAdminSidebar from "./VillaAdminSidebar";

export default function VillaAdminDashboard() {
  const [villa, setVilla] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadVilla();
    loadBookings();
  }, []);

  const loadVilla = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/villa-admin/my-villa", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setVilla(res.data);
  };

  const loadBookings = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/villa-admin/bookings", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBookings(res.data);
  };

  const today = new Date().toDateString();

  if (!villa) return <p className="p-10">Loading...</p>;

  return (
    <div className="flex bg-gray-100">
       <div className="md:block">
                 <VillaAdminSidebar />
               </div>
      <div className="flex-1 md:ml-72 px-4 md:px-8">
      <h1 className="text-3xl font-heading text-palmGreen my-6">
        {villa.name} — Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-6">
        <Stat title="Total Bookings" value={bookings.length} />
        <Stat
          title="Today Check-ins"
          value={bookings.filter(
            b => new Date(b.checkIn).toDateString() === today
          ).length}
        />
        <Stat
          title="Today Check-outs"
          value={bookings.filter(
            b => new Date(b.checkOut).toDateString() === today
          ).length}
        />
        <Stat
          title="Upcoming"
          value={bookings.filter(
            b => new Date(b.checkIn) > new Date()
          ).length}
        />
      </div>
    </div>
    </div>
  );
}

const Stat = ({ title, value }) => (
  <div className="bg-white p-6 shadow rounded">
    <h2 className="text-lg">{title}</h2>
    <p className="text-3xl font-bold text-palmGreen">{value}</p>
  </div>
);
