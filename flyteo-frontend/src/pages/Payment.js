import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../axios";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = params.get("order_id");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get(`/payment/status/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchStatus();
  }, [orderId]);

  if (loading) {
    return (
      <div className="text-center p-10">
        <h2 className="text-xl">Processing Payment...</h2>
      </div>
    );
  }

  if (!order || order.status !== "PAID") {
    return (
      <div className="text-center p-10">
        <h2 className="text-xl text-red-500">
          Payment not confirmed yet.
        </h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  const booking = order.booking;

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 mt-8 rounded">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        🎉 Payment Successful!
      </h1>

      <p><strong>Booking ID:</strong> {booking.id}</p>
      <p><strong>Name:</strong> {booking.fullname}</p>
      <p><strong>Mobile:</strong> {booking.mobileno}</p>
      <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
      <p><strong>Paid:</strong> ₹{booking.paidAmount}</p>

      {booking.remainingAmount > 0 && (
        <p className="text-orange-500">
          Remaining at Property: ₹{booking.remainingAmount}
        </p>
      )}

      <button
        onClick={() => navigate("/my-bookings")}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        View My Bookings
      </button>
    </div>
  );
}
