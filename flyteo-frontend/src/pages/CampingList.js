import { useEffect, useState } from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

export default function CampingList() {
  const [campings, setCampings] = useState([]);
  const [loading, setLoading] = useState(true);

  const isMobile = window.innerWidth <= 768;
  const isDesktop = window.innerWidth > 1024;

  useEffect(() => {
    axios
      .get("/campings")
      .then(res => setCampings(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading experiences…</div>;
  }

  return (
    <div className="bg-gray-50 min-h-scree">

      {/* HEADER */}
      <div className="bg-white shadow-sm">
        {isMobile && (
  <div className="sticky top-0 z-40 bg-white px-4 py-3 shadow">
    <h1 className="font-heading text-md text-palmGreen">
      Camping Experiences
    </h1>
    <p className="text-xs text-gray-500">
      {campings.length} stays found
    </p>
  </div>
)}
  {isDesktop && (   <div className="container mx-auto px-6 py-8">
          <h1 className="font-heading text-4xl text-palmGreen">
            Camping Experiences
          </h1>
          <p className="text-gray-600 mt-2">
            Nature stays, bonfires & unforgettable outdoor adventures
          </p>
        </div>)}
      </div>

      {/* LIST */}
      <div className="px-4 md:px-6 py-8 space-y-8">
        <div className="px-4 py-6 space-y-4">
  {campings.map((camp) =>
    isMobile ? (
      <Link
        key={camp.id}
        to={`/campings/${camp.id}`}
        className="block bg-white rounded-xl shadow overflow-hidden"
      >
        {/* IMAGE */}
        <div className="relative h-40">
          <img
            src={camp.campingimage?.[0]?.url || "/camping.jpg"}
            className="w-full h-full object-cover"
            alt={camp.name}
          />

          <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Nature Stay
          </span>
        </div>

        {/* CONTENT */}
        <div className="p-3">
          <h2 className="font-heading text-base text-gray-800 line-clamp-2">
            {camp.name}
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            📍 {camp.location}
          </p>

          {/* ACTIVITIES */}
          <div className="flex gap-2 mt-2 text-xs flex-wrap">
            {camp.campingactivity?.slice(0, 2).map((a) => (
              <span
                key={a.id}
                className="bg-sand px-2 py-1 rounded"
              >
                {a.text}
              </span>
            ))}

            {camp.campingactivity?.length > 2 && (
              <span className="bg-sand px-2 py-1 rounded">
                +{camp.campingactivity.length - 2}
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
                ₹{
                  camp.campingpricing?.[0]?.adultPrice || "999"
                }
                <span className="text-xs text-gray-500">
                  {" "} / adult
                </span>
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
      <CampingCard key={camp.id} camp={camp} />
    )
  )}

  {campings.length === 0 && (
    <p className="text-center text-gray-500">
      No camping experiences available right now.
    </p>
  )}
</div>

        {campings.length === 0 && (
          <p className="text-center text-gray-500">
            No camping experiences available right now.
          </p>
        )}
      </div>
    </div>
  );
}
function CampingCard({ camp }) {
  // Get today price (safe)
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long"
  });

  const todayPrice = camp.campingpricing?.find(
    p => p.day === today
  );

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-2xl transition overflow-hidden flex flex-col md:flex-row">

      {/* IMAGE */}
      <div className="md:w-1/3 relative">
        <img
          src={camp.campingimage?.[0]?.url || "/camping.jpg"}
          alt={camp.name}
          className="w-full h-32 md:h-full object-cover"
        />

        {/* EXPERIENCE BADGE */}
        <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-1 rounded-full text-xs tracking-wide">
          Nature Experience
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex-1 flex flex-col justify-between">

        <div>
          <h2 className="font-heading text-2xl text-gray-800">
            {camp.name}
          </h2>

          <p className="text-gray-500 mt-1 flex items-center gap-1">
            📍 {camp.location}
          </p>

          <p className="text-gray-600 mt-3 line-clamp-3">
            {camp.description}
          </p>

          {/* HIGHLIGHTS */}
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {camp.campingactivity?.slice(0, 3).map((a) => (
              <Tag key={a.id} label={a.text} />
            ))}

            {camp.campingactivity?.length > 3 && (
              <Tag label={`+${camp.campingactivity.length - 3} more`} />
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 border-t pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* PRICE */}
          <div>
            <p className="text-sm text-gray-500">Starting from</p>

            {todayPrice ? (
              <>
                <p className="text-xl font-bold text-palmGreen">
                  ₹{todayPrice.adultPrice}
                  <span className="text-sm font-normal text-gray-500">
                    {" "} / adult
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  ₹{todayPrice.childPrice} / child
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">
                Pricing varies by date
              </p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <Link
              to={`/campings/${camp.id}`}
              className="bg-palmGreen text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              View Details
            </Link>

            <Link
              to={`/campings/${camp.id}`}
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
