import { useEffect, useState } from "react";
import axios from "../axios";
import HotelAdminSidebar from "./HotelAdminSidebar";

export default function HotelAdminDashboard() {
  const [hotel, setHotel] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [available, setAvailable] = useState(0);
  const [booked, setBooked] = useState(0);

  useEffect(() => {
    loadHotel();
    loadBookings();
  }, []);

  const loadHotel = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "/hotel-admin/my-hotel",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setHotel(res.data);

    // calculate rooms
    let total = 0;
    res.data.rooms.forEach((r) => {
      total += r.totalRooms;
    });

    setAvailable(total); // will update after bookings load
  };

  const loadBookings = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "/hotel-admin/bookings",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setBookings(res.data);

    // booked rooms
    let bookedCount = res.data.length;
    setBooked(bookedCount);
    setAvailable((prev) => prev - bookedCount);
  };

  if (!hotel) return <p className="p-10 text-center text-xl">Loading…</p>;

  return (
    <div className="p-8 ml-72">
        <HotelAdminSidebar/>
      <h1 className="text-3xl font-heading text-palmGreen">
        {hotel.name} — Hotel Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mt-8">

        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl">Total Rooms</h2>
          <p className="text-3xl font-bold">
            {hotel.rooms.reduce((sum, r) => sum + r.totalRooms, 0)}
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl">Booked Rooms</h2>
          <p className="text-3xl font-bold">{booked}</p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl">Available Rooms</h2>
          <p className="text-3xl font-bold text-green-600">{available}</p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-xl">Today's Bookings</h2>
          <p className="text-3xl font-bold">
            {bookings.filter(
              (b) => new Date(b.date).toDateString() === new Date().toDateString()
            ).length}
          </p>
        </div>

      </div>


      {/* Booking list */}
      <h2 className="text-2xl font-heading mt-10 mb-3">Recent Bookings</h2>

      <div className="bg-white shadow p-4 rounded">
        {bookings.length === 0 && <p>No bookings found.</p>}

        {bookings.map((b, i) => (
          <div key={i} className="border-b py-3">
            <p>
              <strong>User:</strong> {b.userName}
            </p>
            <p>
              <strong>Room Type:</strong> {b.roomType}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(b.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
