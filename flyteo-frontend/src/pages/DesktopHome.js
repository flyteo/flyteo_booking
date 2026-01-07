import React from 'react'
import { useEffect, useState } from "react";
import api from "../axios";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import Contact from './Contact';
import AboutUs from './AboutUs';

function DesktopHome() {

    const [hotels, setHotels] = useState([]);
      const [campings, setCampings] = useState([]);
      const [villas, setVillas] = useState([]);
    
      const [destination, setDestination] = useState("Mumbai");
      const [checkIn, setCheckIn] = useState("");
      const [checkOut, setCheckOut] = useState("");
      const [guests, setGuests] = useState(1);
    
      const nav = useNavigate();
    const today = new Date().toISOString().split("T")[0];

const popularLocations = [...new Set([
  ...hotels.map(h => h.location),
  ...villas.map(v => v.location)
])].slice(0, 6);

    
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
    <div>

         {/* ---------------------------------------------------------------- */}
      {/* 1. HERO SECTION */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative w-full h-[70vh] bg-cover bg-center rounded-xl shadow-lg"
        style={{
          backgroundImage:
            "url('https://www.oberoihotels.com/-/media/oberoi-hotel/the-oberoi-mumbai/mumbai-1-8-24/overview/banner/desktop1920x980/banner3_.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl"></div>

        <div className="relative z-10 text-white flex flex-col justify-center items-center h-full px-6 text-center">
          
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

          
          <h1 className="font-heading text-4xl md:text-6xl mb-4">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg md:text-2xl mb-6">
            Hotels & Campsites with Comfort, Adventure & Best Prices
          </p>

          {/* SEARCH BAR */}
          <div className="bg-white rounded-xl shadow-xl p-4 grid grid-cols-1 md:grid-cols-5 gap-3 w-full max-w-4xl text-black">

            <input
              type="text"
              placeholder="Destination (e.g., Mumbai)"
              className="p-3 border-4 border-green-200 border-x-green-500 rounded"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />

            <input
               type="date"
                min={today}
                value={checkIn}
              className="p-3 border-4 border-green-200 border-x-green-500 rounded"
              onChange={(e) => setCheckIn(e.target.value)}
            />

            <input
              type="date"
              min={checkIn || today}
              className="p-3 border-4 border-green-200 border-x-green-500 rounded"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />

            <select
              className="p-3 border-4 border-green-200 border-x-green-500 rounded"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6].map((g) => (
                <option key={g}>{g} Guest{g > 1 ? "s" : ""}</option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              className="bg-palmGreen text-white rounded text-lg font-semibold"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {/* ---------------------------------------------------------------- */}
{/* ---------------------------------------------------------------- */}
{/* SPECIAL OFFERS & DEALS (Dynamic from Backend) */}
{/* ---------------------------------------------------------------- */}
<div className="mt-20">
  <h2 className="font-heading text-3xl mb-6 text-palmGreen text-center">
    Special Offers & Deals
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
  <h2 className="font-heading text-3xl mb-6 text-palmGreen text-center">
    Popular Destinations
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {popularLocations.map((loc) => {
      const bgImage =
        locationBgMap[loc] ||
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80";

      return (
        <div
          key={loc}
          onClick={() => nav(`/search?location=${loc}`)}
          className="cursor-pointer relative h-48 rounded-xl overflow-hidden shadow group"
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
            <p className="text-sm opacity-90">
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
  <h2 className="font-heading text-3xl mb-6 text-palmGreen text-center">
    Best Stays in Mumbai
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

      return (
        <SwiperSlide key={h.id}>
          <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 border border-gray-100">
            
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
                  <span className="px-3 py-1 bg-sand rounded-full">
                    +{h.hotelamenity.length - 3} more
                  </span>
                )} 
              </div>

              {/* BUTTON */}
              <Link
                to={`/hotels/${h.id}`}
                className="mt-5 block bg-palmGreen text-white py-2 rounded-lg text-center font-medium hover:bg-green-700 transition"
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
  <h2 className="font-heading text-3xl mb-6 text-palmGreen text-center">
    Camping Spots
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
    {campings.map((c) => (
      <SwiperSlide key={c.id}>
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition">
          
          <img
            src={c.campingimage?.[0]?.url || "/camping.jpg"}
            className="w-full h-48 rounded object-cover"
            alt={c.name}
          />

          <h3 className="font-heading text-xl mt-3">
            {c.name}
          </h3>

          <p className="font-bold text-palmGreen mt-1">
            ₹{
                  c.campingpricing?.[0]?.adultPrice || "999"
                }
                <span className="text-xs text-gray-500">
                  {" "} / adult
                </span>
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
   { /*  Villas Spots */}
   <div className="mt-12">
    <h2 className="font-heading text-3xl mb-6 text-palmGreen text-center">
  Luxury Villas for Private Stays
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
  {villas.map((v) => (
    <SwiperSlide key={v.id}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100">

        {/* IMAGE */}
        <div className="relative group">
          <img
            src={v.villaimage?.[0]?.url || "/villa.jpg"}
            alt={v.name}
            className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
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
      {/* ---------------------------------------------------------------- */}
{/* CUSTOMER REVIEWS */}
{/* ---------------------------------------------------------------- */}
<div className="mt-20 py-16 bg-white shadow-inner rounded-xl">
  <h2 className="font-heading text-3xl text-center text-rusticBrown mb-10">
    What Our Customers Say
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
        <h2 className="font-heading text-3xl mb-6 text-center text-rusticBrown">
          Why Choose Flyteo?
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
  <h2 className="font-heading text-3xl text-center text-palmGreen mb-8">
    Travel Inspiration & Guides
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
<footer className="mt-14 bg-black text-white py-8">
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">

    {/* ABOUT */}
    <div>
      <h3 className="text-xl font-heading mb-3 text-palmGreen">Flyteo.in</h3>
      <p className="text-gray-300">
        Your trusted partner for Hotels & Camping bookings in Mumbai and beyond.
      </p>
    </div>

    {/* QUICK LINKS */}
    <div>
      <h4 className="font-heading text-lg mb-3">Quick Links</h4>
      <ul className="space-y-2 text-gray-300">
        <li><Link to="/hotels">Hotels</Link></li>
        <li><Link to="/campings">Camping</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </div>

    {/* SUPPORT */}
    <div>
      <h4 className="font-heading text-lg mb-3">Support</h4>
      <ul className="space-y-2 text-gray-300">
        <li>FAQ</li>
        <li><Link to="/cancellation-policy">Cancellation Policy</Link></li>
        <li><Link to="/terms-condition">Terms & Conditions</Link></li>
        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
      </ul>
    </div>

    {/* SOCIAL */}
    <div>
      <h4 className="font-heading text-lg mb-3">Follow Us</h4>
      <div className="flex gap-4 text-xl">
        <a href="#" className="hover:text-palmGreen">🌐</a>
        <a href="#" className="hover:text-palmGreen">📘</a>
        <a href="#" className="hover:text-palmGreen">📸</a>
        <a href="#" className="hover:text-palmGreen">🐦</a>
      </div>

      <p className="text-gray-400 mt-4 text-sm">© 2025 Flyteo.in — All Rights Reserved</p>
    </div>

  </div>
</footer>
    </div>
  )
}

export default DesktopHome