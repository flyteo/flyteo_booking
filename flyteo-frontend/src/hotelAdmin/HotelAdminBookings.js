import { useEffect, useState } from "react";
import api from "../axios";
import HotelAdminSidebar from "./HotelAdminSidebar";
import CheckInModal from "./CheckInModal";

export default function HotelAdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/hotel-admin/bookings", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBookings(res.data);
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

  return (
    <div className="flex">
      <HotelAdminSidebar />

      <div className="ml-72 w-full max-w-4xl p-8">
        <h1 className="text-3xl font-heading text-palmGreen mb-6">
          Hotel Bookings
        </h1>

        <div className="bg-white shadow rounded overflow-hidden">
          {bookings.length === 0 && (
            <p className="p-6 text-gray-500">No bookings found.</p>
          )}

          {bookings.map((b) => {
            const todayBooking = isToday(b.checkIn);
            const canManage =
              todayBooking && (b.checkInStatus === "BOOKED" || b.checkInStatus === "checked_in");

            return (
              <div
                key={b.id}
                className="flex justify-between items-center p-4 border-b"
              >
                <div>
                  <p className="font-semibold">{b.user?.name}</p>

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
