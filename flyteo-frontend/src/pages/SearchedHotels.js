import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../axios";
import { Link } from "react-router-dom";
import { calculateHotelPrice, calculateVillaPriceInSearch } from "../hooks/priceUtils";

export default function SearchedHotels() {
  const [params] = useSearchParams();
  const location = params.get("location");
  const checkIn = params.get("checkIn");
  const guests = params.get("guests") || 1;

  const [data, setData] = useState({ hotels: [], villas: [] });

  useEffect(() => {
    api
      .get("/search", {
        params: { location,checkIn, guests }
      })
      .then(res => setData(res.data));
  }, [location, checkIn, guests]);

const sortedHotels = [...data.hotels].sort((a, b) => {
  const priceA = calculateHotelPrice(a, checkIn);
  const priceB = calculateHotelPrice(b, checkIn);

  return priceA - priceB;
});
  const sortedVillas = [...data.villas].sort((a, b) => {
  const priceA = calculateVillaPriceInSearch(a, checkIn);
  const priceB = calculateVillaPriceInSearch(b, checkIn);

  return priceA - priceB;
});
const isMobile = window.innerWidth <= 768;

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold mb-6">
        Results in {location}
      </h1>
  <div className="px-4 md:px-6 py-10 space-y-6">
      {/* HOTELS */}
      {data.hotels.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-3">Hotels</h2>
          <div className="">
            {sortedHotels.map((h) => {
                const basePrice = h.room?.[0]?.price || 0;

                const finalPrice = calculateHotelPrice(h, checkIn);

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
        </>
      )}

      {/* VILLAS */}
    {data.villas.length > 0 && (
  <>
    <h2 className="text-xl md:text-2xl font-heading mt-10 mb-5 text-palmGreen">
      Luxury Villas
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {sortedVillas.map((v) => {
        const layout = v.villalayout;
const finalPrice = calculateVillaPriceInSearch(v, checkIn);
        return (
          <Link
            key={v.id}
            to={`/villas/${v.id}`}
            className="group bg-white rounded-2xl shadow hover:shadow-2xl transition overflow-hidden border border-gray-100"
          >

            {/* IMAGE */}
            <div className="relative overflow-hidden">
              <img
                src={v.villaimage?.[0]?.url || "/villa.jpg"}
                className="h-48 md:h-56 w-full object-cover group-hover:scale-105 transition duration-500"
                alt={v.name}
              />

              {/* BADGE */}
              <div className="absolute top-3 left-3 bg-black/80 text-white px-3 py-1 rounded-full text-xs">
                Entire Villa
              </div>

              {/* PRICE FLOAT */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-sm font-semibold text-palmGreen shadow">
                ₹{v.basePrice} / night
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-4">

              {/* NAME */}
              <h3 className="font-heading text-lg md:text-xl text-gray-800 line-clamp-1">
                {v.name}
              </h3>

              {/* LOCATION */}
              <p className="text-gray-500 text-sm mt-1">
                📍 {v.location}
              </p>

              {/* CAPACITY */}
              <div className="mt-3 text-sm text-gray-600">
                👨‍👩‍👧‍👦 Up to <b>{v.maxGuests}</b> guests
              </div>

              {/* HIGHLIGHTS */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">

                {layout?.bedrooms && (
                  <span className="px-3 py-1 bg-sand rounded-full">
                    🛏 {layout.bedrooms} Bedrooms
                  </span>
                )}

                {layout?.bathrooms && (
                  <span className="px-3 py-1 bg-sand rounded-full">
                    🚿 {layout.bathrooms} Bathrooms
                  </span>
                )}

                {layout?.privatePool && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                    🏊 Private Pool
                  </span>
                )}

                {layout?.garden && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full">
                    🌴 Garden
                  </span>
                )}
              </div>

              {/* RATING (Static for now) */}
              <div className="mt-4 flex items-center text-yellow-500 text-sm">
                ⭐⭐⭐⭐⭐
                <span className="text-gray-500 ml-2">(4.8)</span>
              </div>

              {/* BUTTON */}
              <div className="mt-4 bg-palmGreen text-white py-2 rounded-lg text-center text-sm font-medium group-hover:bg-green-700 transition">
                View Villa →
              </div>

            </div>
          </Link>
        );
      })}

    </div>
  </>
)}


      {data.hotels.length === 0 && data.villas.length === 0 && (
        <p className="text-gray-500 mt-10">
          No stays found for this location.
        </p>
      )}
      </div>
    </div>
  );
}
