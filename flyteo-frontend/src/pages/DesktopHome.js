import React from 'react'
import { useEffect, useState,useRef } from "react";
import api from "../axios";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import "swiper/css";
import Contact from './Contact';
import AboutUs from './AboutUs';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

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
  Mumbai:
    "https://www.oberoihotels.com/-/media/oberoi-hotel/the-oberoi-mumbai/mumbai-1-8-24/overview/banner/desktop1920x980/banner3_.jpg",

  Lonavala:
    "https://www.trawell.in/blog/wp-content/uploads/2024/07/lonavala-main-730x410.jpg",

  Alibaug:
    "https://images.unsplash.com/photo-1600696749815-3a5c2c8f1c0e?auto=format&fit=crop&w=1200&q=80",
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
    <div className="max-w-7xl mx-auto px-6">

         {/* ---------------------------------------------------------------- */}
      {/* 1. HERO SECTION */}
      {/* ---------------------------------------------------------------- */}
    {/* HERO SECTION */}
<div
  className="relative h-[65vh] w-full overflow-hidden"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1501117716987-c8e1ecb2105b?auto=format&fit=crop&w=1600&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

<div className="relative h-full flex flex-col justify-center items-center text-white text-center px-6">
    <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight">
      Discover Luxury Stays
    </h1>

    <p className="mt-4 text-lg md:text-2xl text-gray-200">
      Hotels • Villas • Camping Experiences
    </p>

    {/* SEARCH GLASS CARD */}
    <div className="mt-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl w-full max-w-5xl">

      <div className="grid md:grid-cols-5 gap-4 text-black">

        {/* <input
          type="text"
          placeholder="Where are you going?"
          className="p-3 rounded-lg border focus:ring-2 focus:ring-orange-400"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        /> */}
         {/* DESTINATION SELECT (DESKTOP) */}
<div className="relative" ref={dropdownRef}>

  {/* INPUT FIELD (Now Editable) */}
  <input
    type="text"
    placeholder="Where are you going?"
    value={searchTerm || destination}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setOpenLocation(true);
    }}
    onFocus={() => setOpenLocation(true)}
    className="p-3 rounded-lg border w-full focus:ring-2 focus:ring-orange-400 outline-none"
  />

  {/* DROPDOWN */}
  {openLocation && (
    <div className="
      absolute
      top-23
      left-0
      w-full
      mt-2
      bg-white
      shadow-2xl
      rounded-xl
      z-50
      p-3
      animate-fadeIn
    ">

      <div className="max-h-60 overflow-y-auto space-y-1">

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
              className="p-2 rounded-lg hover:bg-orange-50 cursor-pointer transition"
            >
              📍 {loc}
            </div>
          ))}

        {/* If no result */}
        {locations.filter(loc =>
          loc.toLowerCase().includes(
            (searchTerm || "").toLowerCase()
          )
        ).length === 0 && (
          <div className="text-sm text-gray-400 p-2">
            No locations found
          </div>
        )}

      </div>
    </div>
  )}
</div>

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
                pl-4 pr-2 py-3 text-sm
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
                pl-4 pr-2 py-3 text-sm
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

        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="p-3 rounded-lg border"
        >
          {[1,2,3,4,5,6].map(g => (
            <option key={g}>{g} Guest{g > 1 ? "s" : ""}</option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold"
        >
          Search
        </button>

      </div>
    </div>

  </div>
</div>
<div className="bg-white shadow py-6">
  <div className="max-w-6xl mx-auto grid grid-cols-4 text-center text-sm text-gray-600">
    <div>✔ Verified Properties</div>
    <div>✔ Secure Payments</div>
    <div>✔ 24/7 Support</div>
    <div>✔ Best Price Guarantee</div>
  </div>
</div>


      {/* ---------------------------------------------------------------- */}
{/* ---------------------------------------------------------------- */}
{/* SPECIAL OFFERS & DEALS (Dynamic from Backend) */}
{/* ---------------------------------------------------------------- */}
<div className="mt-20">
  <h2 className="text-4xl font-heading font-bold text-center mb-12">
  <span className="text-orange-500">Special</span> Offers & Deals
</h2>


  {offers.length === 0 ? (
    <p className="text-center text-gray-600">No active offers right now.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      {offers.map((offer) => (
        <div
          key={offer.id}
          className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group cursor-pointer"
        >
          {/* IMAGE */}
          {/* <img
            src={offer.image || "https://via.placeholder.com/600x400"}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          /> */}

          {/* DISCOUNT BADGE */}
          {offer.discount && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow">
              {offer.discount}% OFF
            </div>
          )}

          {/* CONTENT */}
          <div className="p-5">
            <img
  src={offer.image || "/offer-default.jpg"}
  className="w-full h-40 object-cover rounded"
/>

            <h3 className="font-heading text-xl text-gray-800">
              {offer.title}
            </h3>

            <p className="text-gray-600 mt-2">{offer.description}</p>

            {/* VALIDITY */}
            {offer.validTill && (
              <p className="text-sm text-gray-500 mt-2">
                Valid till:{" "}
                {new Date(offer.validTill).toLocaleDateString("en-IN")}
              </p>
            )}

            {/* OFFER TYPE */}
            <span className="inline-block mt-3 px-3 py-1 bg-sand rounded-full text-xs text-gray-600">
              {offer.offerType?.toUpperCase() || "ALL"}
            </span>

            {/* BUTTON */}
            <button className="mt-4 w-full bg-palmGreen text-white py-2 rounded-lg font-medium hover:bg-green-700 transition">
             <Link to="/hotels"> Explore Offer</Link>
            </button>
          </div>
        </div>
      ))}

    </div>
  )}
</div>



      {/* ---------------------------------------------------------------- */}
      {/* 2. FEATURED DESTINATIONS SECTION */}
      {/* ---------------------------------------------------------------- */}
     <div className="mt-16">
 <h2 className="text-4xl font-heading font-bold text-center mb-12">
  <span className="text-orange-500">Explore</span> Popular Destinations
</h2>


  <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
  {popularLocations.map((loc) => {
    const bgImage =
      locationBgMap[loc] ||
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80";

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
     <div className="mt-16">
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
                <p className="text-2xl font-bold text-orange-500">
  ₹{finalPrice}
  <span className="text-sm text-gray-500 font-normal"> / night</span>
</p>

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
<div className="mt-12">
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
   <div className="mt-12">
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
            ⭐⭐⭐⭐⭐ <span className="text-gray-500 ml-2">(4.9)</span>
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
<div className="mt-20 py-16 bg-white shadow-inner rounded-xl">
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
</div>


      {/* ---------------------------------------------------------------- */}
      {/* 4. WHY CHOOSE US (TRUST SECTION) */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-20 py-16 bg-white rounded-xl shadow-inner shadow-lg">
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
      {/* ---------------------------------------------------------------- */}
{/* BLOG / TRAVEL INSPIRATION */}
{/* ---------------------------------------------------------------- */}
<div className="mt-20">
 <h2 className="text-4xl font-heading font-bold text-center mb-12">
  <span className="text-orange-500">Travel</span> Inspiration & Guides
</h2>


  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    <div className="bg-white rounded-xl shadow overflow-hidden">
      <img
        src="https://t4.ftcdn.net/jpg/02/99/03/35/360_F_299033508_CMsvdMpHqsmvpFw2dpfN9MkMqiivAa1D.jpg"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-heading text-xl">Top 5 Camping Tips for Beginners</h3>
        <p className="text-gray-600 mt-2">Make your first camping trip safe & fun.</p>
        <button className="mt-3 text-palmGreen font-semibold">Read More →</button>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow overflow-hidden">
      <img
        src="https://media.cnn.com/api/v1/images/stellar/prod/170421155806-mumbai.jpg?q=w_2832,h_2052,x_0,y_0,c_fill"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-heading text-xl">Best Hotels in Mumbai (2024)</h3>
        <p className="text-gray-600 mt-2">Our expert picks for comfort & value.</p>
        <button className="mt-3 text-palmGreen font-semibold">Read More →</button>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow overflow-hidden">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIVy1EBaM8UAzqyfiy5t-K3BvH7DvxSbJEqQ&s"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-heading text-xl">Weekend Getaways Near Mumbai</h3>
        <p className="text-gray-600 mt-2">Top places for quick refreshing trips.</p>
        <button className="mt-3 text-palmGreen font-semibold">Read More →</button>
      </div>
    </div>

  </div>
</div>
<AboutUs/>
<Contact/>
{/* ---------------------------------------------------------------- */}
{/* FOOTER */}
{/* ---------------------------------------------------------------- */}
<footer className="bg-gradient-to-r from-orange-500 to-yellow-400 text-gray-300 py-14">
{/* <div className="h-1 bg-gradient-to-r from-orange-500 to-yellow-400 mb-10" /> */}

  <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">

    {/* ABOUT */}
    <div>
      <h3 className="text-xl font-heading mb-3 text-palmGreen">Flyteo.in</h3>
      <p className="text-stone-800">
        Your trusted partner for Hotels & Camping bookings in Mumbai and beyond.
      </p>
    </div>

    {/* QUICK LINKS */}
    <div>
      <h4 className="font-heading  text-lg text-palmGreen mb-3">Quick Links</h4>
      <ul className="space-y-2 underline decoration-solid text-stone-800">
        <li><Link to="/hotels">Hotels</Link></li>
        <li><Link to="/campings">Camping</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </div>

    {/* SUPPORT */}
    <div>
      <h4 className="font-heading text-lg text-palmGreen mb-3">Support</h4>
      <ul className="space-y-2 underline decoration-solid text-stone-800">
        <li>FAQ</li>
        <li><Link to="/cancellation-policy">Cancellation Policy</Link></li>
        <li><Link to="/terms-condition">Terms & Conditions</Link></li>
        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
      </ul>
    </div>

    {/* SOCIAL */}
    <div>
      <h4 className="font-heading text-lg mb-3 text-palmGreen">Follow Us</h4>
      <div className="flex gap-4 text-xl">
        <a href="https://wa.me/918975995125" className="hover:text-palmGreen"><FaWhatsapp/></a>
        <a href="https://www.facebook.com/flyteo.in" className="hover:text-palmGreen"><FaFacebook/></a>
        <a href="https://www.instagram.com/flyteo.in?igsh=OGd6OWV5ZWVndTZv" className="hover:text-palmGreen"><FaInstagram/></a>
        {/* <a href="#" className="hover:text-palmGreen">🐦</a> */}
      </div>

      <p className="text-stone-700 mt-4 text-sm">© 2025 Flyteo.in — All Rights Reserved</p>
    </div>

  </div>
</footer>
    </div>
  )
}

export default DesktopHome