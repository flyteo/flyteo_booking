import { useEffect, useState } from "react";
import api from "../axios";
import VillaAdminSidebar from "./VillaAdminSidebar";
import VillaCheckInModal from "./VillaCheckInModal";

export default function VillaAdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/villa-admin/bookings", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBookings(res.data);
  };
  const isToday = (dateStr) => {
  const today = new Date();
  const d = new Date(dateStr);

  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

const isPast = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);

  return d < today;
};


  return (
    <div className="flex">
      <VillaAdminSidebar />
<div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="text-2xl font-heading mb-6">Villa Bookings</h1>

      <div className="bg-white shadow rounded">
        {bookings.map(b => (
          <div
            key={b.id}
            className="border-b p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{b.user.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(b.checkIn).toDateString()} →{" "}
                {new Date(b.checkOut).toDateString()}
              </p>
              <p className="text-sm">
                Paid ₹{b.paidAmount} | Due ₹{b.remainingAmount}
              </p>
            </div>

          <div className="space-x-2">
  {/* CHECK-IN → ONLY TODAY */}
  {b.checkInStatus === "BOOKED" && isToday(b.checkIn) && (
    <button
      onClick={() => setSelected(b)}
      className="bg-palmGreen text-white px-4 py-2 rounded"
    >
      Check-in
    </button>
  )}

  {/* CHECK-OUT */}
  {b.checkInStatus === "checked_in" && (
    <button
      onClick={async () => {
        await api.put(
          `/villa-admin/check-out/${b.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        loadBookings();
      }}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Check-out
    </button>
  )}

  {/* FUTURE BOOKINGS */}
  {b.checkInStatus === "BOOKED" && !isToday(b.checkIn) && (
    <span className="text-sm text-gray-400">
      Upcoming
    </span>
  )}

  {/* PAST BOOKINGS */}
  {isPast(b.checkOut) && (
    <span className="text-sm text-gray-400">
      Completed
    </span>
  )}
</div>
          </div>
        ))}
      </div>

      {selected && (
        <VillaCheckInModal
          booking={selected}
          onClose={() => setSelected(null)}
          onSuccess={loadBookings}
        />
      )}
    </div>
    </div>
  );
}
