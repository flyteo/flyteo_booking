import { useEffect, useState } from "react";
import api from "../axios";
import { Link } from "react-router-dom";

export default function HotelsList() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    api.get("/hotels")
      .then((res) => setHotels(res.data));
  }, []);


const isMobile = window.innerWidth <= 768;
const getFinalRoomPrice = (roomPrice, taxes, discount, dayWisePricing, date = new Date()) => {
  let price = roomPrice;

  // 🟢 Day-wise percentage
  const dayName = date
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  const dayRule = dayWisePricing?.find(d => d.day === dayName);

  if (dayRule) {
    price = price - (price * dayRule.percentage) / 100;
  }

  // 🟢 Hotel discount
  if (discount > 0) {
    price = price - (price * discount) / 100;
  }

  // 🟢 Add taxes at the end
  price = price + (taxes || 0);

  return Math.round(price);
};



  return (
    <div className="py-4">

      {isMobile && (
  <div className="sticky top-0 z-40 bg-white px-4 py-3 shadow">
    <p className="text-xs text-gray-500">
      {hotels.length} properties found
    </p>
  </div>
)}


      {/* VERTICAL SCROLLABLE LIST */}
      <div className="px-4 md:px-6 py-10 space-y-6">

        {hotels.map((h) => {
         const basePrice = h.room?.[0]?.price || 0;

const finalPrice = getFinalRoomPrice(
  basePrice,
  h.taxes,
  h.discount,
  h.dayWisePricing
);

// ❌ original price before any discount (for strike-through)
const originalPrice = Math.round(basePrice + (h.taxes || 0));


          return isMobile ? (
    /* ================= MOBILE CARD ================= */
    <Link
      key={h.id}
      to={`/hotels/${h.id}`}
      className="block bg-white rounded-xl shadow mb-4 overflow-hidden"
    >
      {/* IMAGE */}
      <div className="relative h-40">
        <img
          src={h.hotelimage?.[0]?.url || "/hotel.jpg"}
          className="w-full h-full object-cover"
        />

        {h.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            {h.discount}% OFF
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3">
        <h2 className="font-heading text-base text-gray-800 line-clamp-2">
          {h.name}
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          📍 {h.location}
        </p>

        {/* RATING */}
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs">
            ⭐ 4.3
          </span>
          <span className="text-gray-400 text-xs">(2300)</span>
        </div>
{/* PRICE */}
        <div className="flex justify-between items-end mt-3">
          <div>
           {finalPrice < originalPrice && (
      <p className="text-[15px] text-gray-500 line-through">
        ₹{originalPrice}
      </p>
    )}

    <p className="text-palmGreen font-bold text-[20px]">
      ₹{finalPrice}
    </p>
            <p className="text-[11px] text-gray-500">per night</p>
          </div>
        {/* AMENITIES */}
        <div className="flex gap-2 mt-2 text-xs text-gray-600 flex-wrap">
          {h.hotelamenity?.slice(0, 3).map((a) => (
            <span key={a.amenityId} className="bg-sand px-2 py-1 rounded">
              {a.amenity.name}
            </span>
          ))}
        </div>


          <span className="text-sm text-palmGreen font-semibold">
            View →
          </span>
        </div>
      </div>
    </Link>
  ) : (
           <div
  key={h.id}
  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 
             border border-gray-200 p-4 flex gap-4"
>
  {/* IMAGE */}
  <div className="relative min-w-[160px] h-[160px]">
    <img
      src={h.hotelimage?.[0]?.url || "/hotel.jpg"}
      alt={h.name}
      className="w-full h-full object-cover rounded-xl"
    />

    {/* DISCOUNT BADGE */}
    {h.discount > 0 && (
      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
        {h.discount}% OFF
      </span>
    )}
  </div>

  {/* RIGHT SECTION */}
  <div className="flex-1 flex flex-col justify-between relative">

    {/* PRICE - top right */}
    <div className="absolute top-0 right-0 text-right">
      {finalPrice < originalPrice && (
    <p className="text-gray-400 text-xs line-through">
      ₹{originalPrice}
    </p>
  )}

  <p className="text-palmGreen font-bold text-lg">
    ₹{finalPrice}
  </p>
      <p className="text-gray-500 text-[11px]">per night</p>
    </div>

    {/* HOTEL NAME + LOCATION */}
    <div className="pr-20"> {/* prevents price overlap */}
      <h2 className="font-heading text-xl text-gray-800">{h.name}</h2>

      <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
        📍 {h.location}
      </p>

      {/* RATING */}
      <div className="mt-2 flex items-center gap-2">
        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
          ⭐ 4.3
        </span>
        <span className="text-gray-500 text-xs">(2300 Reviews)</span>
      </div>

      {/* AMENITIES */}
<div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-700">
  {h.hotelamenity?.slice(0, 4).map((a) => (
    <span
      key={a.amenityId}
      className="bg-sand px-3 py-1 rounded shadow-sm"
    >
      {a.amenity.name}
    </span>
  ))}

  {h.hotelamenity?.length > 4 && (
    <span className="bg-sand px-3 py-1 rounded shadow-sm">
      +{h.hotelamenity.length - 4}
    </span>
  )}
</div>

    </div>

    {/* VIEW DETAILS BUTTON */}
    <div className="flex justify-end mt-4">
      <Link
        to={`/hotels/${h.id}`}
        className="bg-palmGreen text-white px-5 py-2 rounded-lg text-sm font-medium 
                   hover:bg-green-800 transition"
      >
        View Details
      </Link>
    </div>

  </div>
</div>

          );
        })}

      </div>

    </div>
  );
}
