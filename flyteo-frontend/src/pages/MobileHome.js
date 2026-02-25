import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import h1 from "../assets/hotel_back.jpg";
import v1 from "../assets/villa_back.jpg";
import c1 from "../assets/camp_back.jpg";
import o1 from "../assets/offer1.jpg";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "swiper/css";

export default function MobileHome() {
  const nav = useNavigate();
  const location = useLocation();
  const [openDate, setOpenDate] = useState(false);


  const [destination, setDestination] = useState("Alibaug");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [popularCities, setPopularCities] = useState([]);

  const [locations, setLocations] = useState([]);

useEffect(() => {
  api.get("/hotels").then(res => {
    const cityMap = new Map();

    res.data.forEach(h => {
      if (!h.location) return;
      const normalized = h.location.trim().toLowerCase();

      if (!cityMap.has(normalized)) {
        const formatted =
          normalized.charAt(0).toUpperCase() +
          normalized.slice(1);
        cityMap.set(normalized, formatted);
      }
    });

    setLocations(Array.from(cityMap.values()));
  });
}, []);

const [openLocation, setOpenLocation] = useState(false);
const [searchTerm, setSearchTerm] = useState("");

  const [campings, setCampings] = useState([]);
  const [villas, setVillas] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [offers, setOffers] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    api.get("/hotels")
      .then(res => setHotels(res.data.slice(0, 8)));

    api.get("/offers")
      .then(res => setOffers(res.data));
    api.get("/campings").then((res) =>
                setCampings(res.data.slice(0, 6))
              );
     api.get("/villas").then((res) =>
                setVillas(res.data.slice(0, 6))
              );
  }, []);

  const [offer, setOffer] = useState([]);
const [coupons, setCoupons] = useState([]);
useEffect(() => {
  const loadOffers = async () => {
    try {
      const res = await api.get("/offers/home-offers");
      setOffer(res.data.offers);
      setCoupons(res.data.coupons);
    } catch (err) {
      console.error("Failed to load offers");
    }
  };

  loadOffers();
}, []);
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
const popularLocations = Array.from(
  new Map(
    [
      ...hotels.map(h => h.location),
      ...villas.map(v => v.location),
    ]
      .filter(Boolean)
      .map(loc => {
        const normalized = loc.trim().toLowerCase();

        // Proper Case for UI
        const formatted = normalized
          .split(" ")
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        return [normalized, formatted];
      })
  ).values()
).slice(0, 6);
useEffect(() => {
  api.get("/hotels")
    .then(res => {
      const hotelsData = res.data;
      setHotels(hotelsData.slice(0, 8));

       const cityMap = new Map();

      hotelsData.forEach(hotel => {
        if (!hotel.location) return;

        const normalized = hotel.location.trim().toLowerCase();

        // store only once
        if (!cityMap.has(normalized)) {
          const formatted =
            normalized.charAt(0).toUpperCase() +
            normalized.slice(1);

          cityMap.set(normalized, formatted);
        }
      });

      const uniqueCities = Array.from(cityMap.values());

      setPopularCities(uniqueCities.slice(0, 6)); // limit for UI
    });

}, []);


 const handleSearch = () => {
  if (!destination) {
    alert("Please enter a destination");
    return;
  }

  // prevent past dates
  const today = new Date().toISOString().split("T")[0];
  if (checkIn && checkIn < today) {
    alert("Check-in date cannot be in the past");
    return;
  }

  nav(
    `/search?location=${encodeURIComponent(destination)}&guests=${guests}` +
    (checkIn ? `&checkIn=${checkIn}` : "") +
    (checkOut ? `&checkOut=${checkOut}` : "")
  );
};

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* ================= COUPON STRIP ================= */}
{/* ================= IMAGE OFFERS / COUPONS ================= */}
<div className="px-4">
  <h2 className="text-lg font-bold mb-3 fade-up">
    🎉 Special Deals
  </h2>

  <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">

  {/* OFFERS */}
  {offer.map((o) => (
    <div
      key={`offer-${o.id}`}
      onClick={() => nav("/offers")}
      className="bg-stone-600 min-w-[260px] h-[110px] rounded-2xl overflow-hidden relative shadow-lg cursor-pointer active:scale-95 transition"
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
        <div className="text-xs text-rusticBrown font-semibold uppercase tracking-wide">
          {o.title}
        </div>

        <div>
          <p className="text-2xl text-palmGreen font-bold">
            Flat {o.discountPercent}% OFF
          </p>
          
        </div>
      </div>
    </div>
  ))}

  {/* COUPONS */}
  {coupons.map((coupon) => (
    <div
      key={`coupon-${coupon.id}`}
      onClick={() => nav("/offers")}
      className="bg-stone-600 min-w-[260px] h-[110px] rounded-2xl overflow-hidden relative shadow-lg cursor-pointer active:scale-95 transition"
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
        <div className="text-xs text-rusticBrown font-semibold uppercase tracking-wide">
          Special Coupon
        </div>

        <div>
          <p className="text-2xl text-palmGreen font-bold">
           Get {coupon.discountType === "percent"
              ? `${coupon.amount}% OFF`
              : `₹${coupon.amount} OFF`}
          </p>

          <p className="text-sm mt-1">
            Code:{" "}
            <span className="text-brandOrange font-bold">
              {coupon.code}
            </span>
          </p>
        </div>
      </div>
    </div>
  ))}

</div>
</div>

    {/* ================= NEW USER OFFER (MOBILE) ================= */}
{/* {!user && ( */}
  <div className="px-4 mt-6">

    <div className="
      relative overflow-hidden
      rounded-3xl
      p-5
      bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500
      text-white
      shadow-xl
      active:scale-95
      transition
    ">

      {/* Glow Effects */}
      <div className="absolute -top-8 -right-8 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-white/20 rounded-full blur-2xl" />

      <div className="relative z-10">

        {/* Small Badge */}
        <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          🎉 Welcome Offer
        </div>

        {/* Main Text */}
        <h3 className="text-xl font-heading font-bold leading-tight">
          Sign up today & unlock exclusive Flyteo discounts.
        </h3>


        {/* Coupon Code */}
        {/* <div className="mt-3 bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm font-semibold inline-block">
          Use Code: <span className="text-white font-bold">FLYTEO10</span>
        </div> */}

        {/* CTA Button */}
        <button
          onClick={() => nav("/register")}
          className="
            mt-4 w-full
            bg-white text-orange-600
            py-3 rounded-xl
            font-semibold
            shadow-lg
            hover:scale-105
            transition
          "
        >
          Sign Up & Save →
        </button>

      </div>

    </div>

  </div>

      {/* ================= HERO + SEARCH ================= */}
   {/* ================= PREMIUM COMPACT HERO ================= */}
<div className="relative px-4 pt-4 pb-4">

  {/* Soft Luxury Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] rounded-b-[30px]" />

  <div className="relative z-10">

    {/* Title */}
    <h1 className="text-xl font-heading font-bold text-gray-800">
      Find Your Perfect Stay
    </h1>
    <p className="text-xs text-gray-500 mt-1">
      Hotels • Villas • Camping
    </p>

    {/* SMALL PREMIUM SEARCH CARD */}
    <div className="mt-2 bg-white rounded-2xl shadow-xl p-4 space-y-3">

      {/* Destination */}
      <div
    onClick={() => setOpenLocation(true)}
     className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
  >
    {destination || "Select destination"}
  </div>
      {/* <input
        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
        placeholder="Where are you going?"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      /> */}
       {openLocation && (
    <div className="fixed inset-0 bg-black/40 z-40">
      
      <div className="absolute top-0 left-0 right-0 bg-white rounded-t-3xl p-5 z-50">

        {/* Close */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Select Destination</h3>
          <button onClick={() => setOpenLocation(false)}>✕</button>
        </div>

        {/* Search Field */}
        <input
          type="text"
          placeholder="Search city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-xl p-3 mb-4"
        />

        {/* Locations List */}
        <div className="max-h-60 overflow-y-auto space-y-2">
          {locations
            .filter(loc =>
              loc.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(loc => (
              <div
                key={loc}
                onClick={() => {
                  setDestination(loc);
                  setOpenLocation(false);
                  setSearchTerm("");
                }}
                className="p-3 rounded-xl hover:bg-orange-50 cursor-pointer"
              >
                 {loc}
              </div>
            ))}
        </div>

      </div>
    </div>
  )}

      {/* Dates */}
      {/* Stay Dates Field */}
<div
  onClick={() => setOpenDate(true)}
  className="w-full border border-gray-200 rounded-lg p-3 text-sm cursor-pointer bg-white hover:border-orange-400 transition"
>
  {checkIn && checkOut
    ? `${checkIn.toLocaleDateString()} → ${checkOut.toLocaleDateString()}`
    : "Select stay dates"}
</div>

{/* DATE MODAL */}
{openDate && (
  <div className="fixed inset-0 z-50">

    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setOpenDate(false)}
    />

    {/* Bottom Sheet */}
    <div className="
      absolute top-0 left-0 right-0
      bg-white
      rounded-t-3xl
      p-5
      animate-slideUp
      shadow-2xl
    ">

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Select Dates</h3>
        <button onClick={() => setOpenDate(false)}>✕</button>
      </div>

      <DatePicker
        selected={checkIn}
        onChange={(dates) => {
          const [start, end] = dates;
          setCheckIn(start);
          setCheckOut(end);
        }}
        startDate={checkIn}
        endDate={checkOut}
        selectsRange
        inline
        minDate={new Date()}
        maxDate={
    new Date(
      new Date().setMonth(new Date().getMonth() + 2)
    )
  }  // ✅ next 2 months
      />

      <button
        onClick={() => setOpenDate(false)}
        className="mt-4 w-full bg-orange-500 text-white py-3 rounded-xl font-semibold"
      >
        Apply Dates
      </button>

    </div>
  </div>
)}

      {/* Guests */}
      <select
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
      >
        {[1,2,3,4,5,6].map(g => (
          <option key={g}>{g} Guest{g > 1 ? "s" : ""}</option>
        ))}
      </select>

      {/* Button */}
      <button
        onClick={handleSearch}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition"
      >
        Search Stays
      </button>

    </div>
  </div>
</div>



    {/* ================= EXPLORE BY CATEGORY ================= */}
 <div className="pb-8 rounded-b-3xl">

<button
  onClick={() => nav("/campings")}
  className="mt-2 bg-white text-brandOrange px-6 py-2 rounded-full font-semibold"
>
  Explore flyteo camping , events & activities
</button>
</div>
     {/* ================= EXPLORE BY TYPE ================= */}
<div className="px-4 fade-up">
  {/* <h2 className="text-lg font-bold mb-4">
    Explore Categories
  </h2> */}
  <h2 className="text-2xl font-heading font-bold text-center mb-4">
  <span className="text-orange-500">Explore</span> Categories
</h2>

  <div className="grid grid-cols-3 gap-4">

    {[
      { name: "Hotels", img: h1, path: "/hotels" },
      { name: "Camping", img: c1, path: "/campings" },
      { name: "Villas", img: v1, path: "/villas" },
    ].map((item, i) => (
      <div
        key={i}
        onClick={() => nav(item.path)}
        className="relative h-20 rounded-2xl overflow-hidden shadow-lg active:scale-95 transition"
      >
        <img src={item.img} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <p className="text-white font-semibold">{item.name}</p>
        </div>
      </div>
    ))}

  </div>
</div>



      {/* ================= POPULAR DESTINATIONS ================= */}
<div className="mt-2 px-2">
 <h2 className="text-2xl font-heading font-bold text-center mb-8">
  Popular <span className="text-orange-500">Destinations</span>
</h2>

  {/* HORIZONTAL SCROLL ONLY */}
  <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">

    {popularLocations.map((city) => (
      <div
        key={city}
        onClick={() =>
          nav(`/search?location=${encodeURIComponent(city)}`)
        }
        className="
          min-w-[110px]
          bg-[#308b6a8c]
          rounded-xl
          p-4
          shadow
          flex flex-col items-center justify-center
          active:scale-95
          transition
          cursor-pointer
        "
      >
        {/* ICON */}
        <svg
          width="42"
          height="42"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="flyteoPro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE3C2" />
              <stop offset="100%" stopColor="#FFA94D" />
            </linearGradient>
          </defs>

          <path
            d="M12 2.5c-3.9 0-7 2.9-7 6.7C5 14.6 12 21.5 12 21.5s7-6.9 7-12.3c0-3.8-3.1-6.7-7-6.7z"
            fill="url(#flyteoPro)"
          />

          <rect
            x="6.2"
            y="8.3"
            width="11.6"
            height="4.6"
            rx="2.3"
            fill="#FFFFFF"
            opacity="0.95"
          />

          <text
            x="12"
            y="11.4"
            textAnchor="middle"
            fontSize="2.85"
            fontWeight="800"
            fill="#FF8C00"
            letterSpacing="0.3"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            FLYTEO
          </text>
        </svg>

        {/* CITY NAME */}
        <p className="text-sm mt-2 font-medium whitespace-nowrap">
          {city}
        </p>
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
  <div className="mt-2 px-2">
       <h2 className="text-2xl font-heading font-bold text-center mb-8">
  <span className="text-orange-500">Recommended </span>For You
</h2>

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
             const basePrice = h.room?.[0]?.price || 0;

const finalPrice = getFinalRoomPrice(
  basePrice,
  h.taxes,
  h.discount,
  h.dayWisePricing
);

// ❌ original price before any discount (for strike-through)
const originalPrice = Math.round(basePrice + (h.taxes || 0));
       
             return (
               <SwiperSlide key={h.id}>
                 <div className="bg-white rounded-3xl shadow-lg overflow-hidden active:scale-95 transition duration-300">

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
                     {finalPrice < originalPrice && (
                       <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-sm font-semibold text-palmGreen shadow">
                         ₹{finalPrice}/night
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
      { /*  Villas Spots */}
   <div className="mt-2 px-2">
    <h2 className="text-2xl font-heading font-bold text-center mb-8">
  <span className="text-orange-500">Luxury Villas </span>For Private Stay
</h2>
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
  {villas.map((v) => {
             const discount = v.discount || 30;
             const basePrice = v.basePrice || 0;

const finalPrice = getFinalRoomPrice(
  basePrice,
  v.taxes,
  v.discount,
  v.dayWisePricing
);

// ❌ original price before any discount (for strike-through)
const originalPrice = Math.round(basePrice + (v.taxes || 0));
       
             return (
    <SwiperSlide key={v.id}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100">

        {/* IMAGE */}
        <div className="relative group">
          <img
            src={v.villaimage?.[0]?.url || "/villa.jpg"}
            alt={v.name}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
          />
 {discount > 0 && (
                       <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                         {discount}% OFF
                       </div>
                     )}
          {/* ENTIRE VILLA BADGE */}
          <div className="absolute top-3 left-3 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
            Entire Villa
          </div>

          {/* PRICE */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-sm font-semibold text-palmGreen shadow">
            ₹{finalPrice}/night
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
  )})}
</Swiper>

    </div>
 {/* Camping SPots */}
<div className="mt-2 px-2">
  <h2 className="text-2xl font-heading font-bold text-center mb-8">
  <span className="text-orange-500">Adventure </span>activities,camping & events
</h2>
  
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
    {campings.map((c) => {
      const today = new Date().toLocaleDateString("en-US", {
          weekday: "long"
        });
      
        // 🔥 Find today's price
        const todayPriceObj = c.campingpricing?.find(
          p => p.day === today
        );
      
        const todayPrice = todayPriceObj?.adultPrice || 0;
      
        // 🔥 Get max adult price
        const maxPrice = Math.max(
          ...(c.campingpricing?.map(p => p.adultPrice) || [0])
        );
      
        // 🔥 Calculate discount %
        const discountPercent =
          maxPrice > todayPrice
            ? Math.round(((maxPrice - todayPrice) / maxPrice) * 100)
            : 0;
      return (
      <SwiperSlide key={c.id}>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition">
          
          <img
            src={c.campingimage?.[0]?.url || "/camping.jpg"}
            className="w-full h-32 rounded object-cover"
            alt={c.name}
          />
{discountPercent > 0 && (
                       <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                         {discountPercent}% OFF
                       </div>
                     )}
          <h3 className="font-heading text-xl mt-3">
            {c.name}
          </h3>

          <p className="font-bold text-palmGreen mt-1">
            ₹{
                  todayPriceObj.adultPrice || "999"
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
)})}
  </Swiper>
</div>
   {/* ================= MOBILE FOOTER ================= */}
<div className="mt-4 bg-gradient-to-b from-[#f8f8f8] to-[#ffffff] px-6 py-8 rounded-t-3xl shadow-inner">
 {/* SOCIAL ICONS */}
  <div className="flex justify-center gap-6 mt-6 text-2xl">

    {/* WHATSAPP */}
    <a
      href="https://wa.me/918975995125"
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-500 hover:scale-110 transition"
    >
      <FaWhatsapp />
    </a>

    {/* INSTAGRAM */}
    <a
      href="https://www.instagram.com/flyteo.in"
      target="_blank"
      rel="noopener noreferrer"
      className="text-pink-500 hover:scale-110 transition"
    >
      <FaInstagram />
    </a>

    {/* FACEBOOK */}
    <a
      href="https://www.facebook.com/flyteo.in"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:scale-110 transition"
    >
      <FaFacebook />
    </a>

    {/* EMAIL */}
    <a
      href="mailto:flyteoofficial@gmail.com"
      className="text-gray-700 hover:scale-110 transition"
    >
      <MdEmail />
    </a>

  </div>
  {/* BRAND NAME */}
  {/* <h3 className="text-center font-heading text-lg text-palmGreen">
    Flyteo.in
  </h3> */}

  <p className="text-center text-lg text-gray-500 mt-1">
    Hotels • Villas • Camping • Experiences
  </p>

 

  {/* COPYRIGHT */}
  <div className="mt-2 text-center text-xs text-gray-400">
    © 2025 Flyteo.in — All Rights Reserved
  </div>

</div>

      {/* ================= RECOMMENDED HOTELS ================= */}
    

      {/* ================= BOTTOM TAB BAR ================= */}
      {/* <BottomTabBar activePath={location.pathname} /> */}

    </div>
  );
}

/* ====================================================== */
/* ================= BOTTOM TAB BAR ===================== */
/* ====================================================== */

