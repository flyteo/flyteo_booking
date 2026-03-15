import { useEffect, useState, useRef } from "react";
import api from "../axios";

export default function DestinationSearch({
  destination,
  setDestination,
  type = "hotel"   // default hotel
}) {

  const [locations, setLocations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);

  const ref = useRef();

  useEffect(() => {
    loadLocations();
  }, [type]);

  const loadLocations = async () => {

    const url =
      type === "villa"
        ? "/villas/locations"
        : "/hotels/locations";

    const res = await api.get(url);

    setLocations(res.data);
    setFiltered(res.data);
  };

  const handleSearch = (value) => {

    setDestination(value);

    const results = locations.filter(l =>
      l.city.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(results);
    setOpen(true);
  };

  useEffect(() => {

    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () =>
      document.removeEventListener("click", handleClickOutside);

  }, []);

  return (
    <div className="relative w-full" ref={ref}>

      <input
        type="text"
        placeholder="Where are you going?"
        value={destination}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setOpen(true)}
        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-palmGreen outline-none"
      />

      {open && filtered.length > 0 && (
        <div className="absolute z-20 bg-white shadow-lg border mt-2 rounded-xl w-full max-h-60 overflow-y-auto">

          {filtered.map((loc, i) => (
            <div
              key={i}
              onClick={() => {
                setDestination(loc.city);
                setOpen(false);
              }}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer"
            >

              <div className="flex items-center gap-3">

                <span className="text-lg">📍</span>

                <div>
                  <p className="font-medium">{loc.city}</p>

                  <p className="text-xs text-gray-500">
                    {loc.count} {type === "villa" ? "villas" : "hotels"}
                  </p>
                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}