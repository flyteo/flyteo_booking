import { useState } from "react";
import api from "../axios";

export default function CheckInModal({ booking, onClose, onUpdated }) {
  const token = localStorage.getItem("token");

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const remaining = booking.remainingAmount || 0;
  const status = booking.checkInStatus;

  /* ==========================
     CHECK-IN
  ========================== */
  const handleCheckIn = async () => {
    if (remaining > 0 && (amount === "" || Number(amount) <= 0)) {
      setError("Please collect payment before check-in");
      return;
    }

    if (Number(amount) > remaining) {
      setError(`Maximum payable ₹${remaining}`);
      return;
    }

    try {
      setLoading(true);

      await api.put(
        `/hotel-admin/bookings/${booking.id}/check-in`,
        { collectedAmount: Number(amount) || 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdated();
      onClose();
    } catch {
      setError("Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  /* ==========================
     CHECK-OUT
  ========================== */
  const handleCheckOut = async () => {
    if (remaining > 0) {
      setError("Please clear pending amount before check-out");
      return;
    }

    try {
      setLoading(true);

      await api.put(
        `/hotel-admin/bookings/${booking.id}/check-out`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdated();
      onClose();
    } catch {
      setError("Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

        <h2 className="text-2xl font-heading text-palmGreen mb-4">
          Booking #{booking.id}
        </h2>

        {/* INFO */}
        <div className="text-sm text-gray-700 space-y-1">
          <p><b>Guest:</b> {booking.user?.name}</p>
          <p><b>Room:</b> {booking.roomType}</p>
          <p><b>Rooms:</b> {booking.roomCount}</p>
          <p><b>Total:</b> ₹{booking.totalAmount}</p>
          <p><b>Paid:</b> ₹{booking.paidAmount}</p>
          <p><b>Pending:</b> ₹{remaining}</p>
        </div>

        <hr className="my-4" />

        {/* PAYMENT INPUT */}
        {remaining > 0 && status !== "checked_out" && (
          <div>
            <label className="text-sm font-semibold">
              Collect Payment (₹)
            </label>
            <input
              type="number"
              min="1"
              max={remaining}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-700 p-2 rounded mt-1"
            />
          </div>
        )}

        {error && (
          <p className="text-red-600 text-sm mt-3">{error}</p>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>

          {status === "BOOKED" && (
            <button
              disabled={loading}
              onClick={handleCheckIn}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Processing..." : "Check-In"}
            </button>
          )}

          {status === "checked_in" && (
            <button
              disabled={loading}
              onClick={handleCheckOut}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Processing..." : "Check-Out"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
