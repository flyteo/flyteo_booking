import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../axios";
import { Link } from "react-router-dom";

export default function SearchedHotels() {
  const [params] = useSearchParams();
  const location = params.get("location");
  const guests = params.get("guests") || 1;

  const [data, setData] = useState({ hotels: [], villas: [] });

  useEffect(() => {
    api
      .get("/search", {
        params: { location, guests }
      })
      .then(res => setData(res.data));
  }, [location, guests]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Results in {location}
      </h1>

      {/* HOTELS */}
      {data.hotels.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-3">Hotels</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.hotels.map(h => (
              <Link
                key={h.id}
                to={`/hotels/${h.id}`}
                className="bg-white shadow rounded-xl overflow-hidden"
              >
                <img
                  src={h.hotelimage?.[0]?.url || "/hotel.jpg"}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{h.name}</h3>
                  <p className="text-gray-500">{h.location}</p>
                  {h.room?.[0]?.price && (
                    <p className="text-palmGreen font-bold">
                      ₹{h.room[0].price}/night
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* VILLAS */}
      {data.villas.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-10 mb-3">Villas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.villas.map(v => (
              <Link
                key={v.id}
                to={`/villas/${v.id}`}
                className="bg-white shadow rounded-xl overflow-hidden"
              >
                <img
                  src={v.villaimage?.[0]?.url || "/villa.jpg"}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{v.name}</h3>
                  <p className="text-gray-500">{v.location}</p>
                  <p className="text-palmGreen font-bold">
                    ₹{v.basePrice}/night
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {data.hotels.length === 0 && data.villas.length === 0 && (
        <p className="text-gray-500 mt-10">
          No stays found for this location.
        </p>
      )}
    </div>
  );
}
