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
  <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2f7] flex">

    {/* SIDEBAR */}
    <div className="md:block">
      <HotelAdminSidebar />
    </div>

    {/* MAIN CONTENT */}
    <div className="flex-1 md:ml-72 px-4 md:px-10 py-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading text-palmGreen">
            {hotel.name} Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Powered by <span className="font-semibold text-rusticBrown">Flyteo Hotel Panel</span>
          </p>
        </div>

        <div className="mt-4 md:mt-0 text-sm text-gray-500">
          Today: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

        <DashboardCard
          title="Total Rooms"
          value={totalRooms}
          color="bg-blue-100 text-blue-700"
        />

        <DashboardCard
          title="Booked Today"
          value={bookedRooms}
          color="bg-green-100 text-green-700"
        />

        <DashboardCard
          title="Blocked Today"
          value={blockedRooms}
          color="bg-yellow-100 text-yellow-700"
        />

        <DashboardCard
          title="Available"
          value={availableRooms}
          color="bg-orange-100 text-orange-600"
          highlight
        />
      </div>

      {/* BOOKINGS SECTION */}
      <div className="mt-10">

        <h2 className="text-xl md:text-2xl font-heading mb-4">
          Active Bookings Today
        </h2>

        <div className="space-y-4">
          {todaysBookings.length === 0 && (
            <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
              No active bookings today.
            </div>
          )}

          {todaysBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-5 flex flex-col md:flex-row md:justify-between md:items-center"
            >
              <div className="space-y-1">
                <p className="font-semibold text-gray-800">
                  {b.user?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {b.roomType} × {b.roomCount}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(b.checkIn).toLocaleDateString()} →{" "}
                  {new Date(b.checkOut).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-3 md:mt-0">
                <span className={`
                  px-4 py-1 rounded-full text-xs font-semibold
                  ${b.checkInStatus === "Checked In"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"}
                `}>
                  {b.checkInStatus || "Not Checked In"}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  </div>
);
}

/* Small stat card */
function DashboardCard({ title, value, color, highlight }) {
  return (
    <div
      className={`
        rounded-2xl p-5 shadow-md hover:shadow-xl transition
        bg-white border border-gray-100
        ${highlight ? "ring-2 ring-orange-400" : ""}
      `}
    >
      <p className="text-xs text-gray-500 uppercase tracking-wide">
        {title}
      </p>
      <p className={`text-2xl font-bold mt-2 ${color}`}>
        {value}
      </p>
    </div>
  );
}

