import { useEffect, useState } from "react";
import axios from "../axios";
import { Link } from "react-router-dom";




function VillaCard({ villa }) {
  const layout = villa.villalayout;
// 🔥 Calculate best discount for card badge
const today = new Date();

const offerDiscount =
  villa.villaoffer?.length > 0
    ? Math.max(
        ...villa.villaoffer
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
  villa.discount || 0,
  offerDiscount || 0
);

  return (
    <div className="rounded-2xl hover:shadow-2xl transition overflow-hidden flex flex-col md:flex-row">

      {/* IMAGE */}
      <div className="md:w-1/4 relative">
        <img
          src={villa.villaimage?.[0]?.url || "/villa.jpg"}
          alt={villa.name}
          className="w-full h-32 md:h-full object-cover"
        />
 {/* 🔥 DISCOUNT BADGE */}
  {discountPercent > 0 && (
    <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
      {discountPercent}% OFF
    </div>
  )}
        {/* PRICE BADGE */}
        {/* <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-sm font-semibold text-palmGreen shadow">
          ₹{villa.basePrice} / night
        </div> */}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="font-heading text-2xl text-gray-800">
            {villa.name}
          </h2>

          <p className="text-gray-500 mt-1 flex items-center gap-1">
            📍 {villa.location}
          </p>

          <p className="text-gray-600 mt-3 line-clamp-3">
            {villa.description}
          </p>

          {/* HIGHLIGHTS */}
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Tag label={`${villa.maxGuests} Guests`} />
            {layout?.bedrooms && <Tag label={`${layout.bedrooms} Bedrooms`} />}
            {layout?.bathrooms && <Tag label={`${layout.bathrooms} Bathrooms`} />}
            {layout?.privatePool && <Tag label="Private Pool" /> }
            {layout?.garden && <Tag label="Garden" /> }
          </div>
        </div>

      
       {/* CTA */}
<div className="mt-6 border-t pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

  {/* PRICE */}
  <div>
    <p className="text-sm text-gray-500">Starting from</p>
    <p className="text-2xl font-bold text-palmGreen">
      ₹{villa.basePrice}
      <span className="text-sm font-normal text-gray-500"> / night</span>
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

  const isMobile = window.innerWidth <= 768;
  const isDesktop = window.innerWidth > 1024;

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/villas")
      .then((res) => setVillas(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading villas…</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HEADER */}
      {isMobile && (
  <div className="sticky top-0 z-40 bg-white px-4 py-3 shadow">
    <h1 className="font-heading text-lg text-palmGreen">
      Luxury Villas
    </h1>
    <p className="text-xs text-gray-500">
      {villas.length} villas found
    </p>
  </div>
)}
{isDesktop && (
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <h1 className="font-heading text-4xl text-palmGreen">
            Luxury Villas
          </h1>
          <p className="text-gray-600 mt-2">
            Handpicked private villas for premium stays
          </p>
        </div>
      </div>)}

      {/* LIST */}
      <div className="px-4 py-6 space-y-4">
  {villas.map((villa) =>
    isMobile ? (
      <Link
        key={villa.id}
        to={`/villas/${villa.id}`}
        className="block bg-white rounded-xl shadow overflow-hidden"
      >
        {/* IMAGE */}
        <div className="relative h-40">
          <img
            src={villa.villaimage?.[0]?.url || "/villa.jpg"}
            className="w-full h-full object-cover"
            alt={villa.name}
          />

          {/* DISCOUNT */}
          {villa.discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
              {villa.discountPercent}% OFF
            </span>
          )}

          {/* ENTIRE VILLA BADGE */}
          <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Entire Villa
          </span>
        </div>

        {/* CONTENT */}
        <div className="p-3">
          <h2 className="font-heading text-base text-gray-800 line-clamp-2">
            {villa.name}
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            📍 {villa.location}
          </p>

          {/* HIGHLIGHTS */}
          <div className="flex gap-2 mt-2 text-xs flex-wrap">
            <span className="bg-sand px-2 py-1 rounded">
              {villa.maxGuests} Guests
            </span>
            {villa.villalayout?.bedrooms && (
              <span className="bg-sand px-2 py-1 rounded">
                {villa.villalayout.bedrooms} BR
              </span>
            )}
            {villa.villalayout?.privatePool && (
              <span className="bg-sand px-2 py-1 rounded">
                🏊 Pool
              </span>
            )}
          </div>

          {/* PRICE */}
          <div className="flex justify-between items-end mt-3">
            <div>
              <p className="text-xs text-gray-500">
                Starting from
              </p>
              <p className="text-palmGreen font-bold text-lg">
                ₹{villa.basePrice}
                <span className="text-xs text-gray-500"> / night</span>
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
      <VillaCard key={villa.id} villa={villa} />
    )
  )}

  {villas.length === 0 && (
    <p className="text-center text-gray-500">
      No villas available at the moment.
    </p>
  )}
</div>

    </div>
  );
  
}
