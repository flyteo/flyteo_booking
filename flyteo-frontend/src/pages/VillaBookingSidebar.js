import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";

export default function VillaBookingSidebar({ villa }) {
  const nav = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const getFinalVillaBasePrice = () => {
  if (!checkIn) return villa.basePrice;

  const dayName = new Date(checkIn)
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  let price = villa.basePrice;

  // 🔹 Day-wise percentage
  const dayRule = villa.day_wise_percentage?.find(
    d => d.day === dayName
  );
 // 🔹 Villa discount (same as hotel logic)
  // if (villa.discount > 0) {
  //   price = price - (price * villa.discount) / 100;
  // }
  if (dayRule) {
    price = price - (price * dayRule?.percentage) / 100;
  }

  return Math.round(price);
};

const today = new Date().toISOString().split("T")[0];
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const s = new Date(checkIn);
    const e = new Date(checkOut);
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  const totalGuests = adults + children;
  const extraGuests = Math.max(
    totalGuests - villa.includedGuests,
    0
  );

  const totalPrice = useMemo(() => {
    if (!nights) return 0;
    return (
      getFinalVillaBasePrice() * nights +
      extraGuests * villa.extraGuestPrice * nights
    );
  }, [nights, extraGuests, villa]);

  const [showPopup, setShowPopup] = useState(false);
  const proceedBooking = () => {
    // setShowPopup(true);
    if (!checkIn || !checkOut) {
      alert("Please select dates");
      return;
    }

    nav(
      `/booking?villaId=${villa.id}` +
      `&checkIn=${checkIn}` +
      `&checkOut=${checkOut}` +
      `&adults=${adults}` +
      `&children=${children}` +
      `&price=${totalPrice}`
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">

      {/* PRICE */}
      <p className="text-gray-500 text-sm">Starting from</p>
      <p className="text-3xl font-bold text-palmGreen">
  ₹{getFinalVillaBasePrice()}
  <span className="text-base font-normal text-gray-500">
    /night
  </span>
</p>

{checkIn && (
  <p className="text-xs text-green-600 mt-1">
    Special price for{" "}
    {new Date(checkIn).toLocaleDateString("en-US", {
      weekday: "long"
    })}
  </p>
)}


      {/* DATES */}
      <div className="mt-4 space-y-3">
       <div className="space-y-2">
         <label className="text-sm font-semibold text-gray-700">
           Check-in
         </label>
       
         <div className="relative group">
           <CalendarDays className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition" />
       
           <DatePicker
             selected={checkIn}
             onChange={(date) => {
               setCheckIn(date);
               if (checkOut && date > checkOut) setCheckOut(null);
             }}
             minDate={new Date()}
             placeholderText="Select check-in date"
             popperClassName="premium-datepicker"
             calendarClassName="premium-calendar"
             className="
               w-full bg-white border border-gray-200 rounded-xl
               pl-10 pr-4 py-3 text-sm
               shadow-sm
               focus:outline-none
               focus:ring-2 focus:ring-orange-400
               focus:border-orange-400
               transition-all duration-300
               hover:shadow-md
             "
             dateFormat="dd/MM/yyyy"
             showPopperArrow={false}
           />
         </div>
       </div>
       
       
       {/* CHECK-OUT */}
       <div className="space-y-2">
         <label className="text-sm font-semibold text-gray-700">
           Check-out
         </label>
       
         <div className="relative group">
           <CalendarDays className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition" />
       
           <DatePicker
             selected={checkOut}
             onChange={(date) => setCheckOut(date)}
             minDate={checkIn || new Date()}
             placeholderText="Select check-out date"
             disabled={!checkIn}
             popperClassName="premium-datepicker"
             calendarClassName="premium-calendar"
             className="
               w-full bg-white border border-gray-200 rounded-xl
               pl-10 pr-4 py-3 text-sm
               shadow-sm
               focus:outline-none
               focus:ring-2 focus:ring-orange-400
               focus:border-orange-400
               transition-all duration-300
               hover:shadow-md
               disabled:bg-gray-100 disabled:cursor-not-allowed
             "
             dateFormat="dd/MM/yyyy"
             showPopperArrow={false}
           />
         </div>
       </div>
      </div>

      {/* GUESTS */}
      <div className="mt-4">
        <label className="font-medium">Guests</label>

        <div className="flex justify-between mt-2">
          <span>Adults</span>
          <input
            type="number"
            min="1"
            className="w-20 border rounded p-1 text-center"
            value={adults}
            onChange={e => setAdults(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-between mt-2">
          <span>Children</span>
          <input
            type="number"
            min="0"
            className="w-20 border rounded p-1 text-center"
            value={children}
            onChange={e => setChildren(Number(e.target.value))}
          />
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Includes {villa.includedGuests} guests. Extra guests ₹
          {villa.extraGuestPrice}/night each.
        </p>
      </div>

      {/* PRICE BREAKDOWN */}
      {nights > 0 && (
        <div className="mt-4 border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>₹{getFinalVillaBasePrice()} × {nights} nights</span>
            <span>₹{getFinalVillaBasePrice() * nights}</span>
          </div>

          {extraGuests > 0 && (
            <div className="flex justify-between text-red-600">
              <span>
                Extra guests ({extraGuests}) × ₹
                {villa.extraGuestPrice} × {nights}
              </span>
              <span>
                ₹{extraGuests * villa.extraGuestPrice * nights}
              </span>
            </div>
          )}

          <div className="flex justify-between font-bold text-lg text-palmGreen">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={proceedBooking}
        className="mt-5 w-full bg-rusticBrown text-white py-3 rounded-lg text-lg hover:opacity-90"
      >
        Reserve Villa
      </button>
      {showPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setShowPopup(false)}
        className="absolute top-3 right-3 text-gray-500 text-xl"
      >
        ✕
      </button>

      {/* ICON */}
      <div className="text-center">
        <div className="text-4xl mb-3">📞</div>

        <h2 className="font-heading text-xl text-gray-800">
          Booking Unavailable
        </h2>

        <p className="text-gray-600 mt-3">
          Currently online booking is not available.
        </p>

        <p className="text-gray-800 font-semibold mt-2">
          Contact for booking:
        </p>

        <a
          href="tel:8975995125"
          className="text-palmGreen font-bold text-lg mt-1 block"
        >
          📱 8975995125
        </a>

        {/* ACTION BUTTON */}
        <button
          onClick={() => setShowPopup(false)}
          className="mt-6 w-full bg-palmGreen text-white py-3 rounded-lg font-medium"
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
