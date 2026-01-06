import { useEffect, useState } from "react";
import axios from "../axios";
import useIsMobile from "../hooks/useIsmobile";
import { Link } from "react-router-dom";

export default function OfferList() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    axios
      .get("/api/offers")
      .then((res) => setOffers(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading offers…
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">

      {/* ================= HEADER ================= */}
      <div className="bg-white shadow-sm">
        <div className={`px-4 ${!isMobile && "container mx-auto px-6"} py-6`}>
          <h1 className="font-heading text-3xl text-palmGreen">
            Special Offers & Deals
          </h1>
          <p className="text-gray-600 mt-1">
            Save more on hotels & villas with exclusive discounts
          </p>
        </div>
      </div>

      {/* ================= OFFER LIST ================= */}
      <div className={`px-2 ${!isMobile && "container mx-auto px-6"} py-8`}>
        {offers.length === 0 ? (
          <p className="text-center text-gray-500">
            No active offers available right now.
          </p>
        ) : (
          <div
            className={
              isMobile
                ? "space-y-4"
                : "grid grid-cols-1 md:grid-cols-3 gap-8"
            }
          >
            {offers.map((offer) =>
              isMobile ? (
                <MobileOfferCard key={offer.id} offer={offer} />
              ) : (
                <DesktopOfferCard key={offer.id} offer={offer} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
function MobileOfferCard({ offer }) {
  return (
    <Link
      to="/hotels"
      className="block bg-white rounded-xl shadow overflow-hidden"
    >
      {/* IMAGE */}
      <div className="relative h-36">
        <img
          src={offer.image || "/offer-default.jpg"}
          className="w-full h-full object-cover"
          alt={offer.title}
        />

        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
          {offer.discountPercent}% OFF
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-3">
        <h2 className="font-heading text-base text-gray-800">
          {offer.title}
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          Valid till{" "}
          <b>
            {new Date(offer.validTo).toLocaleDateString("en-IN")}
          </b>
        </p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-palmGreen font-semibold">
            Apply Offer →
          </span>
        </div>
      </div>
    </Link>
  );
}
function DesktopOfferCard({ offer }) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-2xl transition overflow-hidden">
      <div className="relative h-48">
        <img
          src={offer.image || "/offer-default.jpg"}
          className="w-full h-full object-cover"
          alt={offer.title}
        />

        <span className="absolute top-4 left-4 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
          {offer.discountPercent}% OFF
        </span>
      </div>

      <div className="p-6">
        <h2 className="font-heading text-xl text-gray-800">
          {offer.title}
        </h2>

        <p className="text-gray-600 mt-2">
          Book now & save big on your stay
        </p>

        <p className="text-sm text-gray-500 mt-3">
          Valid from{" "}
          {new Date(offer.validFrom).toLocaleDateString("en-IN")}{" "}
          to{" "}
          <b>
            {new Date(offer.validTo).toLocaleDateString("en-IN")}
          </b>
        </p>

        <Link
          to="/hotels"
          className="mt-5 inline-block bg-palmGreen text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
        >
          Explore Deals
        </Link>
      </div>
    </div>
  );
}
