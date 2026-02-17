import { useEffect, useState } from "react";
import api from "../axios";
import HotelAdminSidebar from "./HotelAdminSidebar";
import CheckInModal from "./CheckInModal";

export default function HotelAdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (selectedHotel === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter((b) => b.hotelId === Number(selectedHotel))
      );
    }
  }, [selectedHotel, bookings]);

  const loadBookings = async () => {
    const res = await api.get("/hotel-admin/bookings");
    setBookings(res.data);
    setFilteredBookings(res.data);
  };

  const isToday = (date) => {
    const d = new Date(date);
    const today = new Date();
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  // 🏨 Get unique hotels from bookings
  const uniqueHotels = [
    ...new Map(
      bookings.map((b) => [b.hotelId, b.hotel])
    ).values()
  ];

  return (
    <div className="flex">
      <HotelAdminSidebar />

      <div className="ml-72 w-full max-w-5xl p-8">
        <h1 className="text-3xl font-heading text-palmGreen mb-6">
          Hotel Bookings
        </h1>

        {/* 🏨 Hotel Filter Dropdown */}
        {uniqueHotels.length > 1 && (
          <div className="mb-6">
            <select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
              className="border px-4 py-2 rounded"
            >
              <option value="all">All Hotels</option>
              {uniqueHotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="bg-white shadow rounded overflow-hidden">
          {filteredBookings.length === 0 && (
            <p className="p-6 text-gray-500">No bookings found.</p>
          )}

          {filteredBookings.map((b) => {
            const todayBooking = isToday(b.checkIn);
            const canManage =
              todayBooking &&
              (b.checkInStatus === "BOOKED" ||
                b.checkInStatus === "checked_in");

            return (
              <div
                key={b.id}
                className="flex justify-between items-center p-4 border-b"
              >
                <div>
                  {/* 👤 Customer Name */}
                  <p className="font-semibold">{b.user?.name}</p>

                  {/* 🏨 Hotel Name */}
                  <p className="text-sm text-palmGreen font-medium">
                    {b.hotel?.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    {b.roomType} • {b.roomCount} room(s)
                  </p>

                  <p className="text-sm text-gray-500">
                    Check-in: {formatDate(b.checkIn)}
                  </p>

                  <p className="text-xs mt-1">
                    Status:
                    <span
                      className={`ml-1 font-bold ${
                        b.checkInStatus === "BOOKED"
                          ? "text-yellow-600"
                          : b.checkInStatus === "checked_in"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {b.checkInStatus.replace("_", " ")}
                    </span>
                  </p>
                </div>

                <button
                  disabled={!canManage}
                  onClick={() => canManage && setSelected(b)}
                  className={`px-4 py-2 rounded text-white ${
                    canManage
                      ? "bg-palmGreen hover:opacity-90"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {canManage ? "Manage" : "View"}
                </button>
              </div>
            );
          })}
        </div>

        {selected && (
          <CheckInModal
            booking={selected}
            onClose={() => setSelected(null)}
            onUpdated={loadBookings}
          />
        )}
      </div>
    </div>
  );
}

