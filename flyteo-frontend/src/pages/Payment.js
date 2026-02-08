import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../axios";

export default function Payment() {
  const [params] = useSearchParams();
  const nav = useNavigate();

  const bookingId = params.get("bookingId");
  const total = Number(params.get("total"));
  const payNow = Number(params.get("payNow"));
  const remaining = Number(params.get("remaining"));

  const [amount, setAmount] = useState(payNow || total);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await api.post(
        "/bookings/collect-payment",
        {
          bookingId,
          amount
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Payment successful (dummy)");
      nav("/my-bookings");
    } catch (err) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 mt-10 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Total Amount</span>
          <span>₹{total}</span>
        </div>

        <div className="flex justify-between">
          <span>Pay Now</span>
          <span>₹{payNow || total}</span>
        </div>

        {remaining > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Pay at Hotel</span>
            <span>₹{remaining}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <label className="font-medium">Amount to Pay</label>
        <input
          type="number"
          className="w-full border p-2 rounded mt-1"
          value={amount}
          min={1}
          max={total}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <button
        disabled={loading}
        onClick={handlePayment}
        className="w-full bg-palmGreen text-white py-2 rounded mt-4"
      >
        {loading ? "Processing..." : "Confirm Payment"}
      </button>
    </div>
  );
}
