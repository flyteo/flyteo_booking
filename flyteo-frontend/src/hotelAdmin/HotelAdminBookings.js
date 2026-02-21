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
  <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2f7] flex">

    {/* SIDEBAR */}
    <div className="md:block">
      <HotelAdminSidebar />
    </div>

    {/* MAIN CONTENT */}
    <div className="flex-1 md:ml-72 px-4 md:px-10 pt-16 md:pt-8 pb-10">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading text-palmGreen">
            Hotel Bookings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage today’s reservations — Powered by Flyteo
          </p>
        </div>
      </div>

      {/* FILTER */}
      {uniqueHotels.length > 1 && (
        <div className="mt-6">
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="w-full md:w-64 border border-gray-200 rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-palmGreen outline-none"
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

      {/* BOOKINGS LIST */}
      <div className="mt-6 space-y-4">

        {filteredBookings.length === 0 && (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            No bookings found.
          </div>
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
              className="
                bg-white
                rounded-2xl
                shadow-md
                hover:shadow-xl
                transition
                p-5
                flex flex-col md:flex-row
                md:items-center
                md:justify-between
              "
            >
              {/* LEFT INFO */}
              <div className="space-y-1">

                <p className="font-semibold text-gray-800 text-lg">
                  {b.user?.name}
                </p>

                <p className="text-sm text-palmGreen font-medium">
                  {b.hotel?.name}
                </p>

                <p className="text-sm text-gray-600">
                  {b.roomType} • {b.roomCount} room(s)
                </p>

                <p className="text-sm text-gray-500">
                  Check-in: {formatDate(b.checkIn)}
                </p>

                <div className="mt-1">
                  <span
                    className={`
                      inline-block
                      px-3 py-1
                      rounded-full
                      text-xs
                      font-semibold
                      ${
                        b.checkInStatus === "BOOKED"
                          ? "bg-yellow-100 text-yellow-700"
                          : b.checkInStatus === "checked_in"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }
                    `}
                  >
                    {b.checkInStatus.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* RIGHT ACTION */}
              <div className="mt-4 md:mt-0">
                <button
                  disabled={!canManage}
                  onClick={() => canManage && setSelected(b)}
                  className={`
                    w-full md:w-auto
                    px-6 py-2
                    rounded-xl
                    text-white
                    transition
                    ${
                      canManage
                        ? "bg-palmGreen hover:scale-105"
                        : "bg-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {canManage ? "Manage Booking" : "View Only"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
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

