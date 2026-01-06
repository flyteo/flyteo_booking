import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Payment() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);

  const bookingId = query.get("bookingId");
  const amount = query.get("amount");

  const [booking, setBooking] = useState(null);

  // Fetch booking details
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5000/api/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.find((b) => b._id === bookingId);
        setBooking(data);
      })
      .catch(() => navigate("/login"));
  }, [bookingId, navigate]);

  // Handle Payment
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      // Mark booking as paid
      await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/pay`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Payment Successful!");
      navigate("/");
    } catch (err) {
      alert("Payment failed!");
    }
  };

  if (!booking) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="font-heading text-3xl text-palmGreen mb-6 text-center">
        Secure Payment
      </h1>

      <div className="bg-sand p-4 rounded border">
        <p className="text-lg">
          <span className="font-bold">Booking ID:</span> {bookingId}
        </p>
        <p className="text-lg">
          <span className="font-bold">Type:</span>{" "}
          {booking.type === "hotel" ? "Hotel Booking" : "Camping Booking"}
        </p>
        <p className="text-lg">
          <span className="font-bold">Amount:</span> ₹{amount}
        </p>
        <p className="text-lg">
          <span className="font-bold">Check-in:</span>{" "}
          {booking.startDate?.substring(0, 10)}
        </p>

        {booking.type === "hotel" && (
          <p className="text-lg">
            <span className="font-bold">Check-out:</span>{" "}
            {booking.endDate?.substring(0, 10)}
          </p>
        )}
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-rusticBrown text-white py-3 rounded text-lg mt-6"
      >
        Pay Now
      </button>

      <p className="text-center text-sm mt-4 text-gray-600">
        This is a demo payment. You can integrate Razorpay later.
      </p>
    </div>
  );
}
