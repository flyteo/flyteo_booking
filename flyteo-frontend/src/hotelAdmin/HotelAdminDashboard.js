import { useEffect, useState } from "react";
import api from "../axios";
import HotelAdminSidebar from "./HotelAdminSidebar";

export default function HotelAdminDashboard() {
  const [hotel, setHotel] = useState(null);
  const [occupancy, setOccupancy] = useState([]);
  const [bookings, setBookings] = useState([]);
  

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadHotel();
    loadOccupancy();
    loadBookings();
  }, []);

  const loadHotel = async () => {
    const res = await api.get("/hotel-admin/my-hotel");
    setHotel(res.data);
  };

  const loadOccupancy = async () => {
    const res = await api.get(
      `/occupancy/calendar?from=${today}&to=${today}`
    );
    setOccupancy(res.data[0]?.rooms || []);
  };

  const loadBookings = async () => {
    const res = await api.get("/hotel-admin/bookings");
    setBookings(res.data);
  };

  if (!hotel) {
    return <p className="p-10 text-center text-xl">Loading…</p>;
  }

  const totalRooms = occupancy.reduce((sum, r) => sum + r.total, 0);
  const bookedRooms = occupancy.reduce((sum, r) => sum + r.booked, 0);
  const blockedRooms = occupancy.reduce((sum, r) => sum + r.blocked, 0);
  const availableRooms = occupancy.reduce((sum, r) => sum + r.available, 0);

  const todaysBookings = bookings.filter(
    (b) =>
      new Date(b.checkIn) <= new Date(today) &&
      new Date(b.checkOut) > new Date(today)
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
           <div className="md:block">
           <HotelAdminSidebar />
         </div>

      <div className="flex-1 md:ml-72 px-4 md:px-8">
        <h1 className="text-3xl font-heading text-palmGreen">
          {hotel.name} — Dashboard
        </h1>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <Stat title="Total Rooms" value={totalRooms} />
          <Stat title="Booked Today" value={bookedRooms} />
          <Stat title="Blocked Today" value={blockedRooms} />
          <Stat
            title="Available Today"
            value={availableRooms}
            highlight
          />
        </div>

        {/* RECENT BOOKINGS */}
        <h2 className="text-2xl font-heading mt-10 mb-3">
          Active Bookings (Today)
        </h2>

        <div className="bg-white shadow p-4 rounded">
          {todaysBookings.length === 0 && (
            <p>No active bookings today.</p>
          )}

          {todaysBookings.map((b) => (
            <div key={b.id} className="border-b py-3">
              <p>
                <strong>Guest:</strong> {b.user?.name}
              </p>
              <p>
                <strong>Rooms:</strong> {b.roomType} × {b.roomCount}
              </p>
              <p>
                <strong>Stay:</strong>{" "}
                {new Date(b.checkIn).toLocaleDateString()} →{" "}
                {new Date(b.checkOut).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="font-semibold">
                  {b.checkInStatus || "Not Checked In"}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Small stat card */
function Stat({ title, value, highlight }) {
  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-xl">{title}</h2>
      <p
        className={`text-3xl font-bold ${
          highlight ? "text-green-600" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
