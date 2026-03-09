import { useEffect, useState } from "react";
import api from "../axios";
import { Link ,useSearchParams} from "react-router-dom";
import { calculateVillaPrice } from "../hooks/priceUtils";

function VillaCard({ villa }) {
  

// const getFinalRoomPrice = (villaPrice, taxes, discount, dayWisePricing, date = new Date()) => {
//   let price = villaPrice;

//   // 🟢 Day-wise percentage
//   const dayName = date
//     .toLocaleDateString("en-US", { weekday: "long" })
//     .toUpperCase();

//   const dayRule = dayWisePricing?.find(d => d.day === dayName);

//   if (dayRule) {
//     price = price - (price * dayRule?.percentage) / 100;
//   }

//   // 🟢 Hotel discount
//   if (discount > 0) {
//     price = price - (price * discount) / 100;
//   }

//   // 🟢 Add taxes at the end
//   price = price + (taxes || 0);

//   return Math.round(price);
// };

  return (
    <></>
  );
}


function Tag({ label }) {
  return (
    <span className="px-3 py-1 bg-sand rounded-full text-gray-600">
      {label}
    </span>
  );
}


export default function VillaList() {
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/villas")
      .then((res) => setVillas(res.data))
      .finally(() => setLoading(false));
  }, []);

const [searchParams, setSearchParams] = useSearchParams();
const [priceRange,setPriceRange] = useState(20000);
const destination = searchParams.get("location") || "";
const checkIn = searchParams.get("checkIn") || "";
const checkOut = searchParams.get("checkOut") || "";
const guests = searchParams.get("guests") || "1";

const [selectedAmenities, setSelectedAmenities] = useState([]);
const [openFilter, setOpenFilter] = useState(false);
const [openSearch,setOpenSearch] = useState(false);

const layout = villas.villalayout;
// 🔥 Calculate best discount for card badge
 const today = new Date().toISOString().split("T")[0];
const offerDiscount =
  villas.villaoffer?.length > 0
    ? Math.max(
        ...villas.villaoffer
          .map(v => v.offer)
          .filter(o =>
            o.isActive &&
            today >= new Date(o.validFrom) &&
            today <= new Date(o.validTo)
          )
          .map(o => o.discountPercent)
      )
    : 0;

const discountPercent = Math.max(
  villas.discount || 0,
  offerDiscount || 0
);

  const isMobile = window.innerWidth <= 768;
  const isDesktop = window.innerWidth > 1024;
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
const toggleAmenity = (amenity) => {

if (selectedAmenities.includes(amenity)) {

setSelectedAmenities(
selectedAmenities.filter(a=>a!==amenity)
);

} else {

setSelectedAmenities([...selectedAmenities, amenity]);

}

};
 const filteredVillas = villas
  .filter((v) => {

    // 🔎 Destination filter
    if (
      destination &&
      !v.location?.toLowerCase().includes(destination.toLowerCase())
    ) {
      return false;
    }

    // 💰 Calculate final price
    const price = calculateVillaPrice(
      v.basePrice,
      checkIn,
      v.day_wise_percentage,
      v.discount,
      v.taxes
    );

    // 💰 Price filter
    if (price > priceRange) return false;

    // 🏡 Amenities filter
    if (selectedAmenities.length > 0) {
      const hasAmenity = selectedAmenities.every((a) =>
        v.villalayout?.[a]
      );

      if (!hasAmenity) return false;
    }

    return true;
  })

  // 🔽 Sort lowest → highest price
  .sort((a, b) => {

    const priceA = calculateVillaPrice(
      a.basePrice,
      checkIn,
      a.day_wise_percentage,
      a.discount,
      a.taxes
    );

    const priceB = calculateVillaPrice(
      b.basePrice,
      checkIn,
      b.day_wise_percentage,
      b.discount,
      b.taxes
    );

    return priceA - priceB;

  });
  
 const basePrice = villas.basePrice || 0;

const finalPrice = calculateVillaPrice(
  villas.basePrice,
  checkIn,
  villas.day_wise_percentage,
  villas.discount,
  villas.taxes
)

// ❌ original price before any discount (for strike-through)
  if (loading) {
    return <div className="p-10 text-center">Loading villas…</div>;
  }
  return (
<div className="bg-gray-50 min-h-screen">

{/* ================= MOBILE HEADER ================= */}

{isMobile && (
<div className="sticky top-0 z-40 bg-white px-4 py-3 shadow flex justify-between items-center">

<div>
<h1 className="font-heading text-lg text-palmGreen">
Luxury Villas
</h1>
<p className="text-xs text-gray-500">
{filteredVillas.length} villas found
</p>
</div>

    {/* Compact Search Row */}
    <div
      onClick={() => setOpenSearch(true)}
      className="border rounded-xl px-4 py-2 text-sm text-gray-600"
    >
      {destination || "Select destination"} • {guests} Guest
    </div>
<button
onClick={() => setOpenFilter(true)}
className="bg-palmGreen text-white px-4 py-2 rounded-xl text-sm"
>
Filters
</button>

</div>
)}

{/* ================= MOBILE FILTER POPUP ================= */}

{isMobile && openFilter && (
<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">

<div className="bg-white w-[90%] rounded-2xl p-6">

<h3 className="text-lg font-semibold mb-4">Filters</h3>

{/* Price */}

<p className="font-medium mb-2">Price Range</p>

<input
type="range"
min="1000"
max="20000"
value={priceRange}
onChange={(e) => setPriceRange(e.target.value)}
className="w-full"
/>

<p className="text-sm mb-4">Up to ₹{priceRange}</p>

{/* Amenities */}

<p className="font-medium mb-2">Features</p>

<label className="block text-sm">
<input
type="checkbox"
onChange={() => toggleAmenity("privatePool")}
className="mr-2"
/>
Private Pool
</label>

<label className="block text-sm">
<input
type="checkbox"
onChange={() => toggleAmenity("garden")}
className="mr-2"
/>
Garden
</label>

<label className="block text-sm">
<input
type="checkbox"
onChange={() => toggleAmenity("parkingSlots")}
className="mr-2"
/>
Parking
</label>

<button
onClick={() => setOpenFilter(false)}
className="mt-6 w-full bg-palmGreen text-white py-2 rounded-xl"
>
Apply Filters
</button>

</div>

</div>
)}
{isMobile && openSearch && (
  <>
<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">

<div className="bg-white w-[90%] rounded-2xl p-6">
  
<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
<input
    type="text"
    placeholder="Destination"
    value={destination}
    onChange={(e) => {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        location: e.target.value
      });
    }}
    className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-palmGreen outline-none"
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
onClick={()=>setOpenSearch(false)}
className="bg-palmGreen text-white rounded-xl px-4 py-2"
>
Search
</button>
  
  </div></div>
</div>
</>
)
}
{/* ================= DESKTOP HEADER ================= */}

{isDesktop && (
<div className="bg-white shadow-sm">

<div className="container max-auto px-2 py-2">

<h1 className="font-heading text-4xl text-palmGreen">
Luxury Villas
</h1>

<p className="text-gray-600 mt-2">
Handpicked private villas for premium stays
</p>

</div>

{/* SEARCH BAR */}

<div className="bg-white shadow-md rounded-2xl p-4 mx-4 mb-2">

<div className="grid grid-cols-5 gap-4">
<input
    type="text"
    placeholder="Destination"
    value={destination}
    onChange={(e) => {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        location: e.target.value
      });
    }}
    className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-palmGreen outline-none"
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
onClick={handleSearch}
className="bg-palmGreen text-white rounded-xl px-4 py-2"
>
Search
</button>

</div>

</div>

</div>
)}

{/* ================= MAIN LAYOUT ================= */}

<div className="flex gap-6 px-4 md:px-8 py-8">

{/* ===== LEFT FILTER (DESKTOP) ===== */}

<div className="hidden md:block w-72 bg-white p-6 rounded-2xl shadow-md h-fit sticky top-24">

<h3 className="text-lg font-semibold mb-4">Filters</h3>

{/* Price */}

<p className="font-medium mb-2">Price Range</p>

<input
type="range"
min="1000"
max="20000"
value={priceRange}
onChange={(e)=>setPriceRange(e.target.value)}
className="w-full"
/>

<p className="text-sm mb-6">Up to ₹{priceRange}</p>

{/* Amenities */}

<p className="font-medium mb-2">Villa Features</p>

<label className="block text-sm">
<input
type="checkbox"
onChange={()=>toggleAmenity("privatePool")}
className="mr-2"
/>
Private Pool
</label>

<label className="block text-sm">
<input
type="checkbox"
onChange={()=>toggleAmenity("garden")}
className="mr-2"
/>
Garden
</label>

<label className="block text-sm">
<input
type="checkbox"
onChange={()=>toggleAmenity("parkingSlots")}
className="mr-2"
/>
Parking
</label>

</div>

{/* ===== RIGHT VILLA LIST ===== */}

<div className="flex-1">

<p className="text-sm text-gray-500 mb-6">
{filteredVillas.length} villas found
</p>

<div className="space-y-6">

{filteredVillas.map((villa)=>{
  const finalPrice = calculateVillaPrice(
    villa.basePrice,
    checkIn,
    villa.day_wise_percentage,
    villa.discount,
    villa.taxes
  )
  const originalPrice=Math.round(villa.basePrice + (villa.taxes || 0));
return isMobile ? (
<Link
  key={villa.id}
  to={`/villas/${villa.id}`}
  className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
>

  {/* IMAGE */}
  <div className="relative h-44">

    <img
      src={villa.villaimage?.[0]?.url || "/villa.jpg"}
      className="w-full h-full object-cover"
      alt={villa.name}
    />

    {/* GRADIENT OVERLAY */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

    {/* ENTIRE VILLA BADGE */}
    <span className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
      Entire Villa
    </span>

    {/* DISCOUNT */}
    {villa.discount > 0 && (
      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-lg font-semibold">
        {villa.discount}% OFF
      </span>
    )}

    {/* PRICE BADGE */}
    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-palmGreen">
      ₹{finalPrice}
      <span className="text-xs text-gray-500"> / night</span>
    </div>

  </div>

  {/* CONTENT */}
  <div className="p-4">

    {/* NAME */}
    <h2 className="font-heading text-base text-gray-800 line-clamp-1">
      {villa.name}
    </h2>

    {/* LOCATION */}
    <p className="text-xs text-gray-500 mt-1">
      📍 {villa.location}
    </p>

    {/* RATING */}
    <div className="flex items-center gap-2 mt-2">
      <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">
        ⭐ 4.6
      </span>
      <span className="text-gray-400 text-xs">(120 reviews)</span>
    </div>

    {/* FEATURES */}
    <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-600">

      <span className="bg-sand px-2 py-1 rounded">
        👨‍👩‍👧‍👦 {villa.maxGuests} Guests
      </span>

      {villa.villalayout?.bedrooms && (
        <span className="bg-sand px-2 py-1 rounded">
          🛏 {villa.villalayout.bedrooms} BR
        </span>
      )}

      {villa.villalayout?.privatePool && (
        <span className="bg-sand px-2 py-1 rounded">
          🏊 Pool
        </span>
      )}

      {villa.villalayout?.garden && (
        <span className="bg-sand px-2 py-1 rounded">
          🌴 Garden
        </span>
      )}

    </div>

    {/* PRICE SECTION */}
    <div className="flex justify-between items-center mt-4">

      <div>
        {finalPrice < originalPrice && (
          <p className="text-xs text-gray-400 line-through">
            ₹{originalPrice}
          </p>
        )}

        <p className="text-palmGreen font-bold text-lg">
          ₹{finalPrice}
        </p>
      </div>

      <span className="text-sm font-semibold text-palmGreen">
        View →
      </span>

    </div>

  </div>
</Link>

) : (
      /* ================= DESKTOP CARD (UNCHANGED) ================= */

 <div className="flex-1">
  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 overflow-hidden flex gap-6 p-4">

  {/* IMAGE */}
  <div className="relative w-[280px] h-[200px] flex-shrink-0">

    <img
      src={villa.villaimage?.[0]?.url || "/villa.jpg"}
      alt={villa.name}
      className="w-full h-full object-cover rounded-xl"
    />

    {/* GRADIENT */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl"></div>

    {/* DISCOUNT */}
    {discountPercent > 0 && (
      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
        {discountPercent}% OFF
      </span>
    )}

    {/* ENTIRE VILLA BADGE */}
    <span className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
      Entire Villa
    </span>

    {/* PRICE BADGE */}
    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-palmGreen shadow">
      ₹{finalPrice} / night
    </div>

  </div>


  {/* RIGHT CONTENT */}
  <div className="flex-1 flex flex-col justify-between">

    {/* TOP INFO */}
    <div>

      <h2 className="font-heading text-2xl text-gray-800">
        {villa.name}
      </h2>

      <p className="text-gray-500 mt-1 text-sm">
        📍 {villa.location}
      </p>

      {/* RATING */}
      <div className="flex items-center gap-2 mt-2">
        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
          ⭐ 4.6
        </span>
        <span className="text-gray-400 text-xs">(120 reviews)</span>
      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-600 mt-3 text-sm line-clamp-2">
        {villa.description}
      </p>


      {/* FEATURES */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs">

        <span className="bg-sand px-3 py-1 rounded">
          👨‍👩‍👧‍👦 {villa.maxGuests} Guests
        </span>

        {layout?.bedrooms && (
          <span className="bg-sand px-3 py-1 rounded">
            🛏 {layout.bedrooms} Bedrooms
          </span>
        )}

        {layout?.bathrooms && (
          <span className="bg-sand px-3 py-1 rounded">
            🚿 {layout.bathrooms} Bathrooms
          </span>
        )}

        {layout?.privatePool && (
          <span className="bg-sand px-3 py-1 rounded">
            🏊 Private Pool
          </span>
        )}

        {layout?.garden && (
          <span className="bg-sand px-3 py-1 rounded">
            🌴 Garden
          </span>
        )}

      </div>

    </div>


    {/* BOTTOM SECTION */}
    <div className="flex justify-between items-center mt-6 border-t pt-4">

      {/* PRICE */}
      <div>

        <p className="text-sm text-gray-500">
          Starting from
        </p>

        {finalPrice < originalPrice && (
          <p className="text-gray-400 text-sm line-through">
            ₹{originalPrice}
          </p>
        )}

        <p className="text-2xl font-bold text-palmGreen">
          ₹{finalPrice}
          <span className="text-sm text-gray-500 font-normal">
            {" "} / night
          </span>
        </p>

      </div>

      {/* BUTTONS */}
      <div className="flex gap-3">

        <Link
          to={`/villas/${villa.id}`}
          className="bg-palmGreen text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
        >
          View Details
        </Link>

        <Link
          to={`/villas/${villa.id}`}
          className="border border-palmGreen text-palmGreen px-6 py-3 rounded-lg font-medium hover:bg-palmGreen hover:text-white transition"
        >
          Book Now
        </Link>

      </div>

    </div>

  </div>
</div>
    </div>
    )
})}

</div>

</div>

</div>

</div>
);
}
