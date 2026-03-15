import React from 'react'
import { useEffect, useState,useRef } from "react";
import api from "../axios";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import m1 from "../assets/mumbaiback.jpg";
import l1 from "../assets/lonaval.jpg"
import a1 from "../assets/alibaug.jpg"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import h1 from "../assets/backhero.jpg"

import "swiper/css";
import Contact from './Contact';
import AboutUs from './AboutUs';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import HomeBlogs from './HomeBlogs';

function DesktopHome() {

 
    const [hotels, setHotels] = useState([]);
      const [campings, setCampings] = useState([]);
      const [villas, setVillas] = useState([]);
    
      const [destination, setDestination] = useState("Alibaug");
      const [checkIn, setCheckIn] = useState("");
      const [checkOut, setCheckOut] = useState("");
      const [guests, setGuests] = useState(1);
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
const dropdownRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpenLocation(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


      const nav = useNavigate();
    const today = new Date().toISOString().split("T")[0];

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
        api.get("/hotels").then((res) =>
          setHotels(res.data.slice(0, 6))
        );
    
        api.get("/campings").then((res) =>
          setCampings(res.data.slice(0, 6))
        );

        api.get("/villas").then((res) =>
          setVillas(res.data.slice(0, 6))
        );
      }, []);
    const [offers, setOffers] = useState([]);
    
    useEffect(() => {
      api.get("/search/activeoffers")
           .then(res => setOffers(res.data))
            .catch(() => setOffers([])); // safety fallback
    }, []);
    const [coupons, setCoupons] = useState([]);
    
    useEffect(() => {
      api.get("/search/activecoupons")
           .then((res) => setCoupons(res.data));
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
    const locationBgMap = {
  Mumbai:m1,

  Lonavala:l1,

  Alibaug:a1,
};
      // Handle search
      // Handle search (HOME PAGE)
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
    <div className="max-w-7xl mx-auto px-4">
{/* TRUST BADGES SECTION */}
<div className="bg-white shadow-md py-4">
  <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-gray-700 font-medium">
    <div>✔ Verified Properties</div>
    <div>✔ Secure Payments</div>
    <div>✔ 24/7 Support</div>
    <div>✔ Best Price Guarantee</div>
  </div>
</div>
         {/* ---------------------------------------------------------------- */}
      {/* 1. HERO SECTION */}
      {/* ---------------------------------------------------------------- */}
<div className="relative h-[40vh] md:h-[60vh] lg:h-[55vh] w-full"
>

  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center scale-105"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" 
  />

  {/* Content */}
  <div className="relative z-10 flex flex-col justify-center items-center text-center text-white px-6 py-8">

   <h1 className="
  font-heading
  text-4xl md:text-6xl xl:text-7xl
  font-bold
  leading-tight
  tracking-wide
  drop-shadow-2xl
">
  Discover <span className="text-orange-500">Luxury</span> Escapes
</h1>

    <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl">
      Premium Hotels • Private Villas • Luxury Camping
    </p>
{/* ===== OFFER BADGE ===== */}
<div className="mb-6 flex justify-center">

  <div className="
    relative
    bg-gradient-to-r from-orange-500 to-amber-500
    text-white
    px-6 py-3
    rounded-full
    shadow-xl
    flex items-center gap-3
    text-sm md:text-base
    font-medium
    animate-pulse
  ">

    <span className="text-lg">🎉</span>

    <span>
      New User? Get <strong>5% OFF</strong> on Registration
    </span>

    {/* <span className="hidden md:inline">
      | Apply Coupon & Save More
    </span> */}

  </div>

</div>
    {/* PREMIUM SEARCH CARD */}
    <div className="w-full max-w-6xl">

      <div className="
        backdrop-blur-2xl bg-white/10
        border border-white/20
        shadow-[0_20px_60px_rgba(0,0,0,0.6)]
        rounded-3xl p-6 md:p-8
      ">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-end">

          {/* DESTINATION */}
          <div className="relative" ref={dropdownRef}>
            <label className="text-xs text-gray-200 mb-1 block">
              Destination
            </label>

            <input
              type="text"
              placeholder="Where are you going?"
              value={searchTerm || destination}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setOpenLocation(true);
              }}
              onFocus={() => setOpenLocation(true)}
              className="
                w-full bg-white rounded-xl px-4 py-3
                text-gray-600
                focus:ring-2 focus:ring-orange-500
                outline-none transition-all
                shadow-md hover:shadow-lg
              "
            />

            {/* Dropdown */}
            {openLocation && (
              <div className="absolute bottom-[120px] mt-2 w-full bg-white rounded-xl shadow-2xl z-40 p-3 max-h-60 overflow-y-auto">
                {locations
                  .filter(loc =>
                    loc.toLowerCase().includes(
                      (searchTerm || "").toLowerCase()
                    )
                  )
                  .map(loc => (
                    <div
                      key={loc}
                      onClick={() => {
                        setDestination(loc);
                        setSearchTerm("");
                        setOpenLocation(false);
                      }}
                      className="p-2 text-gray-700 rounded-lg hover:bg-orange-50 cursor-pointer transition"
                    >
                      📍 {loc}
                    </div>
                  ))}

                {locations.filter(loc =>
                  loc.toLowerCase().includes(
                    (searchTerm || "").toLowerCase()
                  )
                ).length === 0 && (
                  <div className="text-sm text-gray-700 p-2">
                    No locations found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CHECK-IN */}
          <div>
            <label className="text-xs text-gray-200 mb-1 block">
              Check In
            </label>

            <DatePicker
              selected={checkIn}
              onChange={(date) => {
                setCheckIn(date);
                if (checkOut && date > checkOut) setCheckOut(null);
              }}
              minDate={new Date()}
              placeholderText="Select date"
              className="
                w-full bg-white text-gray-700 rounded-xl px-4 py-3
                focus:ring-2 focus:ring-orange-500
                shadow-md hover:shadow-lg transition-all
              "
              dateFormat="dd/MM/yyyy"
            />
          </div>

          {/* CHECK-OUT */}
          <div>
            <label className="text-xs text-gray-200 mb-1 block">
              Check Out
            </label>

            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              minDate={checkIn || new Date()}
              placeholderText="Select date"
              disabled={!checkIn}
              className="
                w-full bg-white text-gray-700 rounded-xl px-4 py-3
                focus:ring-2 focus:ring-orange-500
                shadow-md hover:shadow-lg transition-all
                disabled:bg-gray-200
              "
              dateFormat="dd/MM/yyyy"
            />
          </div>

          {/* GUESTS */}
          <div>
            <label className="text-xs text-gray-200 mb-1 block">
              Guests
            </label>

            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="
                w-full bg-white rounded-xl px-4 py-3 text-gray-700
                focus:ring-2 focus:ring-orange-500
                shadow-md hover:shadow-lg transition-all
              "
            >
              {[1,2,3,4,5,6].map(g => (
                <option key={g}>{g} Guest{g > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>

          {/* SEARCH BUTTON */}
          <div>
            <button
              onClick={handleSearch}
              className="
                w-full py-3 rounded-xl font-semibold text-white
                bg-gradient-to-r from-orange-500 to-orange-600
                hover:from-orange-600 hover:to-orange-700
                shadow-lg hover:shadow-xl
                transition-all duration-300
                active:scale-95
              "
            >
              Search
            </button>
          </div>

        </div>
      </div>
    </div>

  </div>
</div>



{/* ================= NEW USER OFFER SECTION ================= */}
<div className="px-4 z-10 md:px-10 mt-10">

  <div className="
    relative overflow-hidden
    bg-gradient-to-r from-orange-500 to-amber-500
    rounded-3xl
    shadow-2xl
    p-6 md:p-10
    text-white
    flex flex-col md:flex-row
    items-center
    justify-between
    gap-6
  ">

    {/* Glow Background Effect */}
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />

    {/* LEFT CONTENT */}
    <div className="relative z-10">

      <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-xs font-semibold mb-3 tracking-wide">
        🎉 Limited Time Offer
      </div>

      <h2 className="text-2xl md:text-3xl font-heading font-bold">
        New User? Get 10% OFF
      </h2>

      <p className="mt-2 text-sm md:text-base text-white/90">
        Register today and enjoy exclusive discount on your first booking.
      </p>

    </div>

    {/* RIGHT CTA */}
    <div className="relative z-10">
      <button
        onClick={() => nav("/register")}
        className="
          bg-white text-orange-600
          font-semibold
          px-6 py-3
          rounded-xl
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

      {/* ---------------------------------------------------------------- */}
{/* ---------------------------------------------------------------- */}
{/* SPECIAL OFFERS & DEALS (Dynamic from Backend) */}
{/* ---------------------------------------------------------------- */}
{/* ================= OFFERS ZONE ================= */}
<div className="mt-10 bg-stone-700 py-4 px-2 md:px-6 rounded-3xl">

  {/* HEADER */}
  <div className="text-center text-white mb-12">
    <h2 className="text-4xl font-heading font-bold">
      Offers Zone
    </h2>
    <p className="mt-2 text-lg text-white/80">
      Discover the best of best deals right here!
    </p>
  </div>

  {offers.length === 0 ? (
    <p className="text-center text-white/70">
      No active offers right now.
    </p>
  ) : (

    <div className="relative">

      {/* HORIZONTAL SCROLL */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">

        {offers.map((offer) => (
          <div
            key={offer.id}
            className="
              min-w-[260px] md:min-w-[420px]
              bg-white
              rounded-3xl
              shadow-xl
              overflow-hidden
              hover:scale-105
              transition
              duration-300
              cursor-pointer
            "
          >

            {/* IMAGE */}
            <img
              src={offer.image || "/offer-default.jpg"}
              alt={offer.title}
              className="w-full h-32 object-cover"
            />

            {/* CONTENT */}
            <div className="p-5">

              <h3 className="text-xl font-bold text-gray-800">
                {offer.title}
              </h3>

              <p className="text-gray-600 mt-2 text-sm">
                {offer.description}
              </p>

              {offer.discount && (
                <div className="mt-2 text-2xl font-bold text-orange-500">
                  {offer.discount}% OFF
                </div>
              )}

              {offer.validTill && (
                <p className="text-xs text-gray-500 mt-2">
                  Valid till{" "}
                  {new Date(offer.validTill).toLocaleDateString("en-IN")}
                </p>
              )}

              <Link
                to="/offers"
                className="
                  mt-4 inline-block
                  bg-palmGreen
                  text-white
                  px-5 py-2
                  rounded-lg
                  text-sm
                  font-semibold
                  hover:bg-green-700
                  transition
                "
              >
                Explore →
              </Link>

            </div>
          </div>
        ))}

      </div>

    </div>
  )}

</div>



      {/* ---------------------------------------------------------------- */}
      {/* 2. FEATURED DESTINATIONS SECTION */}
      {/* ---------------------------------------------------------------- */}
     <div className="mt-10">
 <h2 className="text-4xl font-heading font-bold text-center mb-12">
  <span className="text-orange-500">Explore</span> Popular Destinations
</h2>


  <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
  {popularLocations.map((loc) => {
    const bgImage =
      locationBgMap[loc] || l1;

    return (
      <div
        key={loc}
        onClick={() => nav(`/search?location=${encodeURIComponent(loc)}`)}
        className="
          cursor-pointer
          relative
          min-w-[260px] md:min-w-[320px]
          h-48
          rounded-xl
          overflow-hidden
          shadow
          group
          active:scale-95
          transition
        "
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition" />

        {/* Text */}
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-lg font-bold">📍 {loc}</p>
          <p className="text-sm opacity-90 text-brandOrange">
            Hotels • Villas • Camping
          </p>
        </div>
      </div>
    );
  })}
</div>

</div>


      {/* ---------------------------------------------------------------- */}
      {/* 3. FEATURED HOTELS & CAMPSITES */}
      {/* ---------------------------------------------------------------- */}
     <div className="mt-10">
  <h2 className="text-4xl font-heading font-bold text-center mb-12">
  <span className="text-orange-500">Best</span> Stays in Mumbai
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
const reviewCount = h.reviews?.length || 0;

const avgRating =
  reviewCount > 0
    ? (
        h.reviews.reduce((sum, r) => sum + r.rating, 0) /
        reviewCount
      ).toFixed(1)
    : null;
      return (
        <SwiperSlide key={h.id}>
<div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-500">
            
            {/* IMAGE */}
            <div className="relative group">
              <img
                src={h.hotelimage?.[0]?.url || "/hotel.jpg"}
                alt={h.name}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* DISCOUNT */}
              {discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                  {discount}% OFF
                </div>
              )}

              {/* PRICE */}
              {finalPrice < originalPrice && (
                <p className="text-xl font-bold text-orange-500">
  ₹{finalPrice}
  <span className="text-sm text-gray-500 font-normal"> / night</span>
</p>

              )}
            </div>

            {/* BODY */}
            <div className="p-2">
              <h3 className="font-heading text-lg text-gray-800">
                {h.name}
              </h3>

              <p className="text-gray-500 mt-1 flex items-center gap-1">
                📍 {h.location || "Mumbai"}
              </p>

              {/* Rating */}
              <div className="mt-2 flex items-center text-yellow-500 text-sm">
                ⭐ <span className="text-gray-500 ml-2">({avgRating})</span>
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
                  <span className="px-3 py-1 bg-sand rounded-full">
                    +{h.hotelamenity.length - 3} more
                  </span>
                )} 
              </div>

              {/* BUTTON */}
              <Link
                to={`/hotels/${h.id}`}
                className="mt-5 block bg-palmGreen text-brand py-2 rounded-lg text-center font-medium hover:bg-green-700 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        </SwiperSlide>
      );
    })}
  </Swiper>
</div>

       {/* Camping SPots */}
<div className="mt-10">
  <h2 className="text-4xl font-heading font-bold text-center mb-12">
  <span className="text-orange-500">Adventure</span> Activities,Camping & Events
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
      // 🔥 Get today name
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
       const reviewCount = c.reviews?.length || 0;

const avgRating =
  reviewCount > 0
    ? (
        c.reviews.reduce((sum, r) => sum + r.rating, 0) /
        reviewCount
      ).toFixed(1)
    : null;
      return(
      <SwiperSlide key={c.id}>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition">
          
          <img
            src={c.campingimage?.[0]?.url || "/camping.jpg"}
            className="w-full h-48 rounded object-cover"
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
<div className="mt-3 flex items-center text-yellow-500 text-sm">
            ⭐ <span className="text-gray-500 ml-2">({avgRating})</span>
          </div>
          <p className="font-bold text-palmGreen mt-1">
            ₹{
                  todayPriceObj.adultPrice || "999"
                }
                <span className="text-xs text-gray-500">
                  {" "} / adult
                </span>

          </p>

          <Link
            to={`/campings/${c.id}`}
            className="mt-4 block bg-orange-700 text-white px-4 py-2 rounded text-center hover:bg-[#6b3f1d] transition"
          >
            View Details
          </Link>
        </div>
      </SwiperSlide>
   ) })}
  </Swiper>
</div>
   { /*  Villas Spots */}
   <div className="mt-10">
    <h2 className="text-4xl font-heading font-bold text-center mb-12">
  <span className="text-orange-500">Luxury</span> Villas for Private Stay
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
const reviewCount = v.reviews?.length || 0;

const avgRating =
  reviewCount > 0
    ? (
        v.reviews.reduce((sum, r) => sum + r.rating, 0) /
        reviewCount
      ).toFixed(1)
    : null;
      return (
    <SwiperSlide key={v.id}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100">

        {/* IMAGE */}
        <div className="relative group">
          <img
            src={v.villaimage?.[0]?.url || "/villa.jpg"}
            alt={v.name}
            className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
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
          <div className="mt-2 text-sm text-gray-600">
            👨‍👩‍👧‍👦 Up to <b>{v.maxGuests}</b> guests
          </div>

          {/* HIGHLIGHTS */}
          <div className="mt-3 flex gap-2 text-xs flex-wrap">
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
            ⭐ <span className="text-gray-500 ml-2">({avgRating})</span>
          </div>

          {/* BUTTON */}
          <Link
            to={`/villas/${v.id}`}
            className="mt-5 block bg-palmGreen text-white py-2 rounded-lg text-center font-medium hover:bg-opacity-90 transition"
          >
            View Villa
          </Link>
        </div>
      </div>
    </SwiperSlide>
  );
    })}
</Swiper>

    </div>
      {/* ---------------------------------------------------------------- */}
{/* CUSTOMER REVIEWS */}
{/* ---------------------------------------------------------------- */}
{/* <div className="mt-10 py-16 bg-white shadow-inner rounded-xl">
  <h2 className="text-4xl font-heading font-bold text-center mb-12">
  What our<span className="text-orange-500"> Customer</span> Says
</h2>


  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">

    <div className="bg-sand p-6 rounded-xl shadow">
      <p className="text-gray-700 italic">
        “Amazing experience! The hotel was super clean and comfortable. Booking was easy.”
      </p>
      <h4 className="mt-4 font-heading text-lg text-palmGreen">— Priya Sharma</h4>
    </div>

    <div className="bg-sand p-6 rounded-xl shadow">
      <p className="text-gray-700 italic">
        “Camping with Flyteo was unforgettable. Great staff & safe environment!”
      </p>
      <h4 className="mt-4 font-heading text-lg text-palmGreen">— Rishi Patel</h4>
    </div>

    <div className="bg-sand p-6 rounded-xl shadow">
      <p className="text-gray-700 italic">
        “Best price guarantee is real! Got a luxury room at an amazing rate.”
      </p>
      <h4 className="mt-4 font-heading text-lg text-palmGreen">— Mehak Gupta</h4>
    </div>

  </div>
</div> */}

      {/* ---------------------------------------------------------------- */}
{/* BLOG / TRAVEL INSPIRATION */}
{/* ---------------------------------------------------------------- */}

<div className="mt-10">
 <HomeBlogs/>
</div>
{/* 4. WHY CHOOSE US (TRUST SECTION) */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-10 py-16 bg-white rounded-xl shadow-inner shadow-lg">
       <h2 className="text-4xl font-heading font-bold text-center mb-12">
  Why Choose<span className="text-orange-500"> Flyteo?</span> 
</h2>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="font-heading text-xl text-palmGreen">Verified Properties</h3>
            <p className="mt-2 text-gray-600">
              Every hotel & campsite is manually verified.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="font-heading text-xl text-palmGreen">Best Price Guarantee</h3>
            <p className="mt-2 text-gray-600">
              We match top platforms to ensure the best deal.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="font-heading text-xl text-palmGreen">Secure Online Payments</h3>
            <p className="mt-2 text-gray-600">
              100% safe & encrypted payment system.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="font-heading text-xl text-palmGreen">Easy Cancellation</h3>
            <p className="mt-2 text-gray-600">
              Flexible cancellation on eligible bookings.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="font-heading text-xl text-palmGreen">24/7 Support</h3>
            <p className="mt-2 text-gray-600">
              Our support team is available anytime.
            </p>
          </div>

        </div>
      </div>
<AboutUs/>
<Contact/>
{/* ---------------------------------------------------------------- */}
{/* FOOTER */}
{/* ---------------------------------------------------------------- */}
<footer className="bg-gray-50 border-t border-gray-200 text-gray-700">

  <div className="max-w-7xl mx-auto px-6 py-10">

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

      {/* BRAND */}
      <div>
        <h3 className="text-xl font-heading text-palmGreen mb-2">
          Flyteo.in
        </h3>

        <p className="text-sm leading-relaxed">
          Discover Hotels, Villas & Camping destinations across India.
          Your trusted partner for memorable travel stays.
        </p>

        <div className="mt-3 text-sm space-y-1">
          <p>📍 Mumbai, India</p>
          <p>📞 +91 8975995125</p>
        </div>
      </div>


      {/* EXPLORE */}
      <div>
        <h4 className="font-semibold mb-3 text-gray-900">
          Explore
        </h4>

        <ul className="space-y-2 text-sm">
          <li><Link to="/hotels" className="hover:text-palmGreen">Hotels</Link></li>
          <li><Link to="/villas" className="hover:text-palmGreen">Villas</Link></li>
          <li><Link to="/campings" className="hover:text-palmGreen">Camping</Link></li>
          <li><Link to="/blogs" className="hover:text-palmGreen">Travel Blogs</Link></li>
        </ul>
      </div>


      {/* COMPANY */}
      <div>
        <h4 className="font-semibold mb-3 text-gray-900">
          Company
        </h4>

        <ul className="space-y-2 text-sm">
          <li><Link to="/about" className="hover:text-palmGreen">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-palmGreen">Contact</Link></li>
          <li><Link to="/terms-condition" className="hover:text-palmGreen">Terms & Conditions</Link></li>
          <li><Link to="/privacy-policy" className="hover:text-palmGreen">Privacy Policy</Link></li>
        </ul>
      </div>


      {/* SOCIAL */}
      <div>
        <h4 className="font-semibold mb-3 text-gray-900">
          Follow Us
        </h4>

        <div className="flex gap-4 text-xl text-gray-600">
          <a href="https://wa.me/918975995125" className="hover:text-green-600">
            <FaWhatsapp/>
          </a>

          <a href="https://www.facebook.com/flyteo.in" className="hover:text-blue-600">
            <FaFacebook/>
          </a>

          <a href="https://www.instagram.com/flyteo.in" className="hover:text-pink-500">
            <FaInstagram/>
          </a>
        </div>
      </div>

    </div>


    {/* BOTTOM COPYRIGHT */}

    <div className="border-t border-gray-200 mt-8 pt-4 text-sm flex flex-col md:flex-row justify-between items-center">

      <p>
        © 2025 Flyteo.in — All Rights Reserved
      </p>

      <p className="mt-2 md:mt-0 text-gray-500">
        Made with ❤️ for travelers
      </p>

    </div>

  </div>

</footer>
    </div>
  )
}

export default DesktopHome