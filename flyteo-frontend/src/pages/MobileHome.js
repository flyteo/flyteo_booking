import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "../axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";


import "swiper/css";

export default function MobileHome() {
  const nav = useNavigate();
  const location = useLocation();

  const [destination, setDestination] = useState("Mumbai");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [popularCities, setPopularCities] = useState([]);

  const [campings, setCampings] = useState([]);
  const [villas, setVillas] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [offers, setOffers] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    axios.get("/api/hotels")
      .then(res => setHotels(res.data.slice(0, 8)));

    axios.get("/api/offers")
      .then(res => setOffers(res.data));
    axios.get("/api/campings").then((res) =>
                setCampings(res.data.slice(0, 6))
              );
     axios.get("/api/villas").then((res) =>
                setVillas(res.data.slice(0, 6))
              );
  }, []);
useEffect(() => {
  axios.get("/api/hotels")
    .then(res => {
      const hotelsData = res.data;
      setHotels(hotelsData.slice(0, 8));

      // 👉 Extract unique city names
      const cities = [
        ...new Set(
          hotelsData
            .map(h => h.location)
            .filter(Boolean)
        )
      ];

      setPopularCities(cities.slice(0, 6)); // limit for UI
    });

}, []);

  const handleSearch = () => {
    nav(`/hotels?destination=${destination}&checkIn=${checkIn}&checkOut=${checkOut}&guests=1`);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      
      <div className="pb-8 rounded-b-3xl">
 <p className="mt-3 text-sm opacity-90">
  🌲 Camping available in 
  <span className="font-semibold"> Alibaug, Lonavala, Igatpuri</span>
</p>

<button
  onClick={() => nav("/campings")}
  className="mt-4 bg-white text-palmGreen px-6 py-2 rounded-full font-semibold"
>
  Explore Camping
</button>
</div>
      {/* ================= HERO + SEARCH ================= */}
      <div className="bg-[#546570] px-4 pt-6 pb-8 rounded-3xl text-white">
       
        <h1 className="text-xl font-heading">Find your perfect stay</h1>
        <p className="text-sm opacity-90">Hotels · Camping · Villas</p>

        <div className="bg-white text-black rounded-xl shadow-lg mt-4 p-4 space-y-3">

          <input
            className="w-full border-4 border-green-200 border-x-green-500 rounded-lg p-3"
            placeholder="Enter destination"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          {/* DATES */}
<div className="flex gap-2">
  <input
    type="date"
    className="w-1/2 border-4 border-green-200 border-x-green-500 rounded-lg p-3 text-sm"
    value={today}
    onChange={(e) => setCheckIn(e.target.value)}
  />

  <input
    type="date"
    className="w-1/2 border-4 border-green-200 border-x-green-500 rounded-lg p-3 text-sm"
    value={checkIn || today}
    onChange={(e) => setCheckOut(e.target.value)}
  />
</div>

{/* GUESTS */}
<select
  className="w-full border-4 border-green-200 border-x-green-500 rounded-lg p-3 text-sm"
  value={guests}
  onChange={(e) => setGuests(e.target.value)}
>
  {[1, 2, 3, 4, 5, 6].map((g) => (
    <option key={g} value={g}>
      {g} Guest{g > 1 ? "s" : ""}
    </option>
  ))}
</select>

{/* SEARCH BUTTON */}

          <button
            onClick={handleSearch}
            className="w-full bg-palmGreen text-white py-3 rounded-lg font-semibold text-base active:scale-95 transition"
          >
            Search
          </button>
        </div>
      </div>

     {/* ================= EXPLORE BY TYPE ================= */}
<div className="mt-6 px-2">
  <h2 className="font-heading text-lg mb-3">
    Explore By Category
  </h2>

  <div className="grid grid-cols-3 gap-4 text-center">

    {/* HOTELS */}
    <div
      onClick={() =>
        nav(`/hotels?destination=${encodeURIComponent(destination)}`)
      }
      className="bg-white rounded-xl p-4 shadow"
    >
      🏨
      <p className="mt-1 text-sm">Hotels</p>
    </div>

    {/* CAMPING */}
    <div
      onClick={() =>
        nav(`/campings?destination=${encodeURIComponent(destination)}`)
      }
      className="bg-white rounded-xl p-4 shadow"
    >
      ⛺
      <p className="mt-1 text-sm">Camping</p>
    </div>

    {/* VILLAS */}
    <div
      onClick={() =>
        nav(`/villas?destination=${encodeURIComponent(destination)}`)
      }
      className="bg-white rounded-xl p-4 shadow"
    >
      🏡
      <p className="mt-1 text-sm">Villas</p>
    </div>

  </div>
</div>


      {/* ================= POPULAR DESTINATIONS ================= */}
<div className="mt-6 px-2">
  <h2 className="font-heading text-lg mb-3">
    Popular Destinations
  </h2>

  <div className="grid grid-cols-3 gap-4 text-center">

    {popularCities.map((city) => (
      <div
        key={city}
        onClick={() =>
          nav(`/hotels?destination=${encodeURIComponent(city)}`)
        }
        className="bg-white rounded-xl p-4 shadow active:scale-95 transition"
      >
        <div className="text-2xl">📍</div>
        <p className="text-sm mt-2 font-medium">{city}</p>
      </div>
    ))}

  </div>
</div>


      {/* ================= OFFERS ================= */}
      {offers.length > 0 && (
        <div className="mt-6 px-2">
          <h2 className="font-heading text-lg mb-3">Top Offers</h2>

          <div className="flex gap-4 overflow-x-auto pb-3">
            {offers.map(o => (
              <div
                key={o.id}
                className="min-w-[260px] bg-white rounded-xl shadow"
              >
                <img
                  src={o.image || "/offer-default.jpg"}
                  className="h-32 w-full object-cover rounded-t-xl"
                />
                <div className="p-3">
                  <h3 className="font-semibold">{o.title}</h3>
                  <p className="text-xs text-gray-600">{o.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      { /*  Villas Spots */}
   <div className="mt-6 px-2">
    <h2 className="font-heading text-lg mb-3">Luxury Villas for Private Stays</h2>
<Swiper
  modules={[Navigation, Autoplay]}
  autoplay={{ delay: 4000, disableOnInteraction: false }}
  spaceBetween={26}
  slidesPerView={1.1}
  breakpoints={{
    640: { slidesPerView: 1.3 },
    768: { slidesPerView: 2.1 },
    1024: { slidesPerView: 3 }
  }}
  className="px-4"
>
  {villas.map((v) => (
    <SwiperSlide key={v.id}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100">

        {/* IMAGE */}
        <div className="relative group">
          <img
            src={v.villaimage?.[0]?.url || "/villa.jpg"}
            alt={v.name}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* ENTIRE VILLA BADGE */}
          <div className="absolute top-3 left-3 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
            Entire Villa
          </div>

          {/* PRICE */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-sm font-semibold text-palmGreen shadow">
            ₹{v.basePrice}/night
          </div>
        </div>

        {/* BODY */}
        <div className="p-5">
          <h3 className="font-heading text-lg text-gray-800">
            {v.name}
          </h3>

          <p className="text-gray-500 mt-1 flex items-center gap-1">
            📍 {v.location}
          </p>

          {/* CAPACITY */}
          <div className="mt-1 text-sm text-gray-600">
            👨‍👩‍👧‍👦 Up to <b>{v.maxGuests}</b> guests
          </div>

          {/* HIGHLIGHTS */}
          <div className="mt-2 flex gap-1 text-xs flex-wrap">
            {v.villalayout?.privatePool && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                🏊 Private Pool
              </span>
            )}
            {v.villalayout?.garden && (
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full">
                🌴 Garden
              </span>
            )}
            {v.villalayout?.parkingSlots && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                🚗 Parking
              </span>
            )}
          </div>

          {/* RATING (OPTIONAL STATIC) */}
          <div className="mt-3 flex items-center text-yellow-500 text-sm">
            ⭐⭐⭐⭐⭐ <span className="text-gray-500 ml-2">(4.9)</span>
          </div>

          {/* BUTTON */}
          <Link
            to={`/villas/${v.id}`}
            className="mt-5 block bg-rusticBrown text-white py-2 rounded-lg text-center font-medium hover:bg-opacity-90 transition"
          >
            View Villa
          </Link>
        </div>
      </div>
    </SwiperSlide>
  ))}
</Swiper>

    </div>
 {/* Camping SPots */}
<div className="mt-6 px-2">
  <h2 className="font-heading text-lg mb-3">Camping Spots</h2>

  <Swiper
    modules={[Navigation, Autoplay]}
    navigation
    autoplay={{
      delay: 4000,
      disableOnInteraction: false
    }}
    spaceBetween={24}
    slidesPerView={1.1}
    breakpoints={{
      640: { slidesPerView: 1.4 },
      768: { slidesPerView: 2.2 },
      1024: { slidesPerView: 3 }
    }}
    className="px-4"
  >
    {campings.map((c) => (
      <SwiperSlide key={c.id}>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition">
          
          <img
            src={c.campingimage?.[0]?.url || "/camping.jpg"}
            className="w-full h-32 rounded object-cover"
            alt={c.name}
          />

          <h3 className="font-heading text-xl mt-3">
            {c.name}
          </h3>

          <p className="font-bold text-palmGreen mt-1">
            ₹{
                  c.campingpricing?.[0]?.adultPrice || "999"
                } / night
          </p>

          <Link
            to={`/campings/${c.id}`}
            className="mt-4 block bg-rusticBrown text-white px-4 py-2 rounded text-center hover:bg-[#6b3f1d] transition"
          >
            View Details
          </Link>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>
   
      {/* ================= RECOMMENDED HOTELS ================= */}
      <div className="mt-6 px-2">
        <h2 className="font-heading text-lg mb-3">Recommended for You</h2>

        <Swiper
           modules={[Navigation, Autoplay]}
           // navigation
           autoplay={{
             delay: 3500,
             disableOnInteraction: false
           }}
           spaceBetween={24}
           slidesPerView={1.1}
           breakpoints={{
             640: { slidesPerView: 1.3 },
             768: { slidesPerView: 2.2 },
             1024: { slidesPerView: 3.2 }
           }}
           className="px-4"
         >
           {hotels.map((h) => {
             const discount = h.discount || 30;
       
             return (
               <SwiperSlide key={h.id}>
                 <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 border border-gray-100">
                   <Link
                       to={`/hotels/${h.id}`}
                     >
                   {/* IMAGE */}
                   <div className="relative group">
                     <img
                       src={h.hotelimage?.[0]?.url || "/hotel.jpg"}
                       alt={h.name}
                       className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                     />
       
                     {/* DISCOUNT */}
                     {discount > 0 && (
                       <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                         {discount}% OFF
                       </div>
                     )}
       
                     {/* PRICE */}
                     {h.room?.[0]?.price && (
                       <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-sm font-semibold text-palmGreen shadow">
                         ₹{h.room[0].price}/night
                       </div>
                     )}
                   </div>
       
                   {/* BODY */}
                   <div className="p-5">
                     <h3 className="font-heading text-lg text-gray-800">
                       {h.name}
                     </h3>
       
                     <p className="text-gray-500 mt-1 flex items-center gap-1">
                       📍 {h.location || "Mumbai"}
                     </p>
       
                     {/* Rating */}
                     <div className="mt-2 flex items-center text-yellow-500 text-sm">
                       ⭐⭐⭐⭐⭐ <span className="text-gray-500 ml-2">(4.8)</span>
                     </div>
       
                     {/* Amenities */}
                     <div className="mt-3 flex gap-2 text-gray-500 text-xs flex-wrap">
                        {h.hotelamenity?.slice(0, 3).map((a) => (
                         <span
             key={a.amenityId} className="px-3 py-1 bg-sand rounded-full">
                           {a.amenity.name}
                         </span>
                       ))}
                       {h.hotelamenity?.length > 3 && (
                         <span className="px-2 py-1 bg-sand rounded-full">
                           +{h.hotelamenity.length - 3} more
                         </span>
                       )} 
                     </div>
       
                     {/* BUTTON */}
                     <Link
                       
                       className="mt-3 block bg-palmGreen text-white py-2 rounded-lg text-center font-medium hover:bg-green-700 transition"
                     >
                       Book Now →
                     </Link>
                   </div>
                   </Link>
                 </div>
               </SwiperSlide>
             );
           })}
         </Swiper>
      </div>

      {/* ================= BOTTOM TAB BAR ================= */}
      {/* <BottomTabBar activePath={location.pathname} /> */}

    </div>
  );
}

/* ====================================================== */
/* ================= BOTTOM TAB BAR ===================== */
/* ====================================================== */

