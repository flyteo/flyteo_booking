import { useEffect, useState } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get(
          "/bookings/my",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading bookings…</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">No bookings yet</h2>
        <p className="text-gray-500 mt-2">
          Start booking hotels or campings to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="font-heading text-3xl text-palmGreen mb-6">
        My Bookings
      </h1>

      <div className="space-y-6">
        {bookings.map((b) => {
          const item = b.type === "hotel" ? b.hotel : b.camping;

          return (
            <div
              key={b.id}
              className="bg-white shadow rounded-xl p-5 border"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    {item?.name || "Unknown"}
                  </h2>

                  <p className="text-sm text-gray-600">
                    📍 {item?.location || "-"}
                  </p>

                  <span className="inline-block mt-1 text-xs px-2 py-1 rounded bg-sand">
                    {b.type === "hotel" ? "Hotel Booking" : "Camping Booking"}
                  </span>
                </div>

                {/* STATUS */}
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    b.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {b.paymentStatus.toUpperCase()}
                </span>
              </div>

              {/* DETAILS */}
              <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <p>
                    <strong>Check-in:</strong>{" "}
                    {new Date(b.checkIn).toLocaleDateString()}
                  </p>

                  {b.checkOut && (
                    <p>
                      <strong>Check-out:</strong>{" "}
                      {new Date(b.checkOut).toLocaleDateString()}
                    </p>
                  )}

                  {b.type === "hotel" && (
                    <>
                      <p>
                        <strong>Room:</strong> {b.roomType} ({b.acType})
                      </p>
                      <p>
                        <strong>Guests:</strong> {b.guests}
                      </p>
                    </>
                  )}
                </div>

                <div className="text-right">
                  <button
  onClick={() =>
    window.open(
      `/ebill-booking/${b.id}`,
      "_blank"
    )
  }
  className="px-4 py-2 bg-palmGreen text-white rounded"
>
  Download Invoice
</button>

                  <p className="text-lg font-bold text-palmGreen">
                    ₹{b.price}
                  </p>
                  <p className="text-xs text-gray-500">Total Amount</p>

                  {/* PAY BUTTON */}
                  {b.paymentStatus !== "paid" && (
                    <button
                      onClick={() =>
                        nav(`/payment?bookingId=${b.id}&amount=${b.price}`)
                      }
                      className="mt-3 px-4 py-2 bg-rusticBrown text-white rounded"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>

              {/* FOOTER */}
              <div className="mt-4 text-xs text-gray-500">
                Booked on{" "}
                {new Date(b.createdAt).toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
