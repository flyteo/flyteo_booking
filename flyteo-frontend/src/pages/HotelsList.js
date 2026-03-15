import { useEffect, useState } from "react";
import api from "../axios";
import { Link, useNavigate ,useSearchParams} from "react-router-dom";
import {filterAndSortStays} from "../hooks/filterStays";
import {calculateRoomPrice} from "../hooks/priceUtils";
import DestinationSearch from "../layouts/DestinationSearch";

export default function HotelsList() {
  const nav = useNavigate();
  const [hotels, setHotels] = useState([]);

const [searchParams, setSearchParams] = useSearchParams();

const destination = searchParams.get("location") || "";
const checkIn = searchParams.get("checkIn") || "";
const checkOut = searchParams.get("checkOut") || "";
const guests = searchParams.get("guests") || "1";
      // ================= FILTER STATES =================

const [priceRange, setPriceRange] = useState(25000);
const [rating, setRating] = useState(0);
const [selectedAmenities, setSelectedAmenities] = useState([]);
const [openFilter, setOpenFilter] = useState(false);
const [openSearch,setOpenSearch]=useState(false);

useEffect(() => {
    api.get("/hotels")
      .then((res) => setHotels(res.data));
  }, []);
const allAmenities = [
  ...new Map(
    hotels
      .flatMap((h) => h.hotelamenity || [])
      .map((a) => [a.amenityId, a.amenity])
  ).values(),
];

  const handleAmenityFilter = (e) => {
  const value = Number(e.target.value);

  if (e.target.checked) {
    setSelectedAmenities([...selectedAmenities, value]);
  } else {
    setSelectedAmenities(
      selectedAmenities.filter((id) => id !== value)
    );
  }
};
 const today = new Date().toISOString().split("T")[0];

const isMobile = window.innerWidth <= 768;
// const getFinalRoomPrice = (
//   roomPrice,
//   taxes,
//   discount,
//   dayWisePricing,
//   checkIn
// ) => {
//   let price = roomPrice;

//   const date = checkIn ? new Date(checkIn) : new Date();

//   const dayName = date
//     .toLocaleDateString("en-US", { weekday: "long" })
//     .toLowerCase();

//   const dayRule = dayWisePricing?.find(
//     (d) => d.day?.toLowerCase() === dayName
//   );

//   if (dayRule) {
//     price = price - (price * dayRule.percentage) / 100;
//   }

//   if (discount > 0) {
//     price = price - (price * discount) / 100;
//   }

//   price = price + (taxes || 0);

//   return Math.round(price);
// };

const handleSearch = () => {
  if (!destination) {
    alert("Please enter destination");
    return;
  }

  setSearchParams({
    location: destination,
    checkIn,
    checkOut,
    guests
  });
};
const filteredHotels = filterAndSortStays({
  stays: hotels,

  destination,

  priceRange,
  rating,
  selectedAmenities,

   getPrice: (h) => {
    const basePrice = h.room?.[0]?.price || 0;

    return calculateRoomPrice({
      basePrice,
      checkIn,
      dayWisePricing: h.day_wise_percentage,
      hotelDiscount: h.discount,
      taxes: h.taxes
    });
  }
});
  return (
    <div className="py-4">

      {/* ================= MOBILE TOP SECTION ================= */}
{isMobile && (
  <div className="sticky top-0 z-40 bg-white px-4 py-3 shadow space-y-3">

    {/* Result Count */}
    <div className="flex justify-between items-center">
      <p className="text-xs text-gray-500">
        {filteredHotels.length} properties found
      </p>

      {/* Filter Button */}
      <button
        onClick={() => setOpenFilter(true)}
        className="bg-palmGreen text-white text-xs px-4 py-1.5 rounded-full shadow"
      >
        Filters
      </button>
    </div>

    {/* Compact Search Row */}
    <div
      onClick={() => setOpenSearch(true)}
      className="border rounded-xl px-4 py-2 text-sm text-gray-600"
    >
      {destination || "Select destination"} • {guests} Guest
    </div>

  </div>
)}
{/* ================= SEARCH SECTION ================= */}
{!isMobile && (
<div className="bg-white shadow-md rounded-2xl p-4 md:p-6 mx-4 md:mx-8 mt-6">

  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

   {/* DESTINATION */}
 <DestinationSearch
 type="hotel"
  destination={destination}
  setDestination={(value) =>
    setSearchParams({
      ...Object.fromEntries(searchParams),
      location: value
    })
  }/>

  {/* CHECK-IN */}
  <input
    type="date"
    value={checkIn}
    min={today}
    onChange={(e) => {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        checkIn: e.target.value
      });
    }}
    className="border rounded-xl px-4 py-2"
  />

  {/* CHECK-OUT */}
  <input
    type="date"
    value={checkOut}
    min={checkIn || today}
    onChange={(e) => {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        checkOut: e.target.value
      });
    }}
    className="border rounded-xl px-4 py-2"
  />

  {/* GUESTS */}
  <select
    value={guests}
    onChange={(e) => {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        guests: e.target.value
      });
    }}
    className="border rounded-xl px-4 py-2"
  >
    {[1,2,3,4,5,6].map(g => (
      <option key={g} value={g}>
        {g} Guest{g > 1 ? "s" : ""}
      </option>
    ))}
  </select>

  {/* SEARCH BUTTON */}
  <button
    onClick={handleSearch}
    className="bg-palmGreen text-white rounded-xl px-4 py-2 font-semibold hover:bg-green-800 transition"
  >
    Search
  </button>

</div>
</div>
)}
{isMobile && openSearch && (
  <>
  <div className="fixed inset-0 bg-black/40 z-40" />
  
<div className="fixed inset-0 flex items-center justify-center z-50">
  
  <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-6">
<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
    {/* DESTINATION */}
 <DestinationSearch
 type="hotel"
  destination={destination}
  setDestination={(value) =>
    setSearchParams({
      ...Object.fromEntries(searchParams),
      location: value
    })
  }
/>

  {/* CHECK-IN */}
  <input
    type="date"
    value={checkIn}
    min={today}
    onChange={(e) => {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        checkIn: e.target.value
      });
    }}
    className="border rounded-xl px-4 py-2"
  />

  {/* CHECK-OUT */}
  <input
    type="date"
    value={checkOut}
    min={checkIn || today}
    onChange={(e) => {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        checkOut: e.target.value
      });
    }}
    className="border rounded-xl px-4 py-2"
  />

  {/* GUESTS */}
  <select
    value={guests}
    onChange={(e) => {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        guests: e.target.value
      });
    }}
    className="border rounded-xl px-4 py-2"
  >
    {[1,2,3,4,5,6].map(g => (
      <option key={g} value={g}>
        {g} Guest{g > 1 ? "s" : ""}
      </option>
    ))}
  </select>
<button
      onClick={() => setOpenSearch(false)}
      className="w-full bg-palmGreen text-white py-2 rounded-lg"
    >
      Search
    </button>
</div>
    </div>
  </div>
  
  </>
)}
      {/* VERTICAL SCROLLABLE LIST */}
      {/* ================= MAIN CONTENT ================= */}
<div className="flex gap-6 px-4 md:px-8 py-8">
{/* ================= MOBILE FILTER DRAWER ================= */}
{isMobile && openFilter && (
<>
<div
  className="fixed inset-0 bg-black/40 z-40"
  onClick={() => setOpenFilter(false)}
/>

<div className="fixed inset-0 flex items-center justify-center z-50">

  <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">

    <h3 className="text-lg font-semibold mb-4">
      Filters
    </h3>

    {/* Price */}
    <div className="mb-4">
      <p className="text-sm font-medium mb-2">Price</p>
      <input
        type="range"
        min="500"
        max="10000"
        value={priceRange}
        onChange={(e) => setPriceRange(e.target.value)}
        className="w-full"
      />
      <p className="text-xs text-gray-500">
        Up to ₹{priceRange}
      </p>
    </div>

    {/* Star category */}
    <div className="mb-4">
      <p className="text-sm font-medium mb-2">
        Hotel Category
      </p>

      {[5,4,3,2,1].map(star => (
        <button
          key={star}
          onClick={() => setRating(star)}
          className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100"
        >
          {Array.from({ length: star }).map((_,i)=>(
            <span key={i} className="text-yellow-400">★</span>
          ))}
        </button>
      ))}

    </div>
<div>
      <p className="font-medium mb-2">Amenities</p>
      {allAmenities.map((a) => (
        <label key={a.id} className="block text-sm mb-1">
          <input
            type="checkbox"
            value={a.id}
            onChange={handleAmenityFilter}
            className="mr-2"
          />
          {a.name}
        </label>
      ))}
    </div>
    <button
      onClick={() => setOpenFilter(false)}
      className="w-full bg-palmGreen text-white py-2 rounded-lg"
    >
      Apply Filters
    </button>

  </div>

</div>
</>
)}
  {/* ================= LEFT FILTER SECTION ================= */}
  <div className="hidden md:block w-72 bg-white p-6 rounded-2xl shadow-md h-fit sticky top-24">

    <h3 className="text-lg font-semibold mb-4">Filters</h3>

    {/* Price */}
    <div className="mb-6">
      <p className="font-medium mb-2">Price Range</p>
      <input
        type="range"
        min="500"
        max="10000"
        value={priceRange}
        onChange={(e) => setPriceRange(e.target.value)}
        className="w-full"
      />
      <p className="text-sm mt-1">Up to ₹{priceRange}</p>
    </div>

    {/* Rating */}
    <div className="mb-6">
      <div className="mb-6">
  <p className="font-medium mb-3">Hotel Category</p>

  <div className="space-y-2">

    {/* All */}
    <button
      onClick={() => setRating(0)}
      className={`w-full text-left px-3 py-2 rounded-lg transition ${
        rating === 0 ? "bg-palmGreen text-white" : "hover:bg-gray-100"
      }`}
    >
      All Categories
    </button>

    {[5, 4, 3, 2, 1].map((star) => (
      <button
        key={star}
        onClick={() => setRating(star)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
          rating === star
            ? "bg-palmGreen text-white"
            : "hover:bg-gray-100"
        }`}
      >
        {/* Left side stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: star }).map((_, i) => (
            <span key={i} className="text-yellow-400 text-lg">
              ★
            </span>
          ))}
        </div>

        {/* Right text */}
        <span className="text-sm">
          & above
        </span>
      </button>
    ))}

  </div>
</div>
    </div>

    {/* Amenities */}
    <div>
      <p className="font-medium mb-2">Amenities</p>
      {allAmenities.map((a) => (
        <label key={a.id} className="block text-sm mb-1">
          <input
            type="checkbox"
            value={a.id}
            onChange={handleAmenityFilter}
            className="mr-2"
          />
          {a.name}
        </label>
      ))}
    </div>

  </div>

  {/* ================= RIGHT HOTEL LIST ================= */}
  <div className="flex-1">

    {/* Properties Count */}
    <div className="mb-6">
      <p className="text-sm text-gray-500">
        {filteredHotels.length} properties found
      </p>
    </div>

    {/* HOTEL CARDS */}
    <div className="space-y-6">

      {filteredHotels.map((h) => {
        const basePrice = h.room?.[0]?.price || 0;
       const finalPrice = calculateRoomPrice({
  basePrice,
  checkIn,
  dayWisePricing: h.day_wise_percentage || [],
  hotelDiscount: h.discount,
  taxes: h.taxes
});
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
         <div
            key={h.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition border p-4 flex flex-col md:flex-row gap-4"
          >

            {/* IMAGE */}
            <div className="relative md:min-w-[180px] md:w-[180px] h-[200px] md:h-[160px]">
              <img
                src={h.hotelimage?.[0]?.url || "/hotel.jpg"}
                className="w-full h-full object-cover rounded-xl"
              />
              {h.discount > 0 && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  {h.discount}% OFF
                </span>
              )}
            </div>

            {/* DETAILS */}
            <div className="flex-1 flex flex-col justify-between relative">

              {/* PRICE */}
              <div className="flex md:absolute md:top-0 md:right-0 items-center md:block text-right mt-2 md:mt-0">
                {finalPrice < originalPrice && (
                  <p className="text-gray-400 text-xs line-through">
                    ₹{originalPrice}
                  </p>
                )}
                <p className="text-xl font-bold text-palmGreen">
          ₹{finalPrice}
          <span className="text-sm text-gray-500 font-normal">
            {" "} / night
          </span>
        </p>
              </div>

              {/* INFO */}
              <div className="pr-24">
                <h2 className="font-heading text-xl">{h.name}</h2>
                <p className="text-gray-600 text-sm mt-1">
                  📍 {h.location}
                </p>
{/* RATING */}
<div className="mt-2 flex items-center gap-2">

  {avgRating ? (
    <>
      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
        ⭐ {avgRating}
      </span>

      <span className="text-gray-500 text-xs">
        ({reviewCount} reviews)
      </span>
    </>
  ) : (
    <span className="text-gray-400 text-xs">
      No reviews yet
    </span>
  )}

</div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {h.hotelamenity?.slice(0,4).map((a) => (
                    <span
                      key={a.amenityId}
                      className="bg-sand px-3 py-1 rounded"
                    >
                      {a.amenity.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex justify-end mt-4">
                <Link
                  to={`/hotels/${h.id}`}
                  className="bg-palmGreen text-white px-5 py-2 rounded-lg hover:bg-green-800 transition"
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
</div>

    </div>
  );
}
