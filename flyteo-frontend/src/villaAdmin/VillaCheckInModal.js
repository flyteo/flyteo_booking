import { useState } from "react";
import api from "../axios";

export default function VillaCheckInModal({ booking, onClose, onSuccess }) {
  const [amount, setAmount] = useState(booking.remainingAmount);

  const checkIn = async () => {
    await api.put(
      `/villa-admin/check-in/${booking.id}`,
      { collectedAmount: Number(amount) },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-96">
        <h2 className="text-xl font-heading mb-4">Villa Check-in</h2>

        <p className="text-sm mb-2">
          Guest: <b>{booking.user.name}</b>
        </p>

        <p className="text-sm mb-2">
          Pending Amount: ₹{booking.remainingAmount}
        </p>

        <input
          type="number"
          className="w-full p-2 border rounded mb-4"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={checkIn}
            className="bg-palmGreen text-white px-4 py-2 rounded"
          >
            Confirm Check-in
          </button>
        </div>
      </div>
    </div>
  );
}
