import { useEffect, useState } from "react";
import api from "../axios";
import AdminSidebar from "./AdminSidebar";

export default function AdminRoomAvailability() {
  const [hotels, setHotels] = useState([]);
  const [hotelId, setHotelId] = useState("");
  const [date, setDate] = useState("");
  const [rooms, setRooms] = useState([]);


  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    const res = await api.get("/hotels");
    setHotels(res.data);
  };

  const loadAvailability = async () => {
    if (!hotelId || !date) return;

    const res = await api.get(
      `/admin/room-availability?hotelId=${hotelId}&date=${date}`
    );

    setRooms(res.data);
  };

  const updateBlock = async (room, blockedRooms) => {
    if (
      !window.confirm(
        `Block ${blockedRooms} room(s) for ${room.roomType}?`
      )
    )
      return;

    await api.post(
      "/admin/room-availability",
      {
        hotelId,
        roomId: room.roomId,
        date,
        blockedRooms
      }
    );

    loadAvailability();
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-heading mb-6">
          Admin – Room Availability
        </h1>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="border p-2 rounded"
            value={hotelId}
            onChange={(e) => setHotelId(e.target.value)}
          >
            <option value="">Select Hotel</option>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            onClick={loadAvailability}
            className="bg-palmGreen text-white px-4 rounded"
          >
            Load
          </button>
        </div>

        {/* ROOMS */}
        {rooms.map((r) => (
          <div
            key={r.roomId}
            className="bg-white shadow rounded p-4 mb-4 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{r.roomType}</h2>
              <p className="text-sm text-gray-600">
                Total: {r.totalRooms} | Booked: {r.bookedRooms} | Blocked:{" "}
                {r.blockedRooms} | Available:{" "}
                <b>{r.availableRooms}</b>
              </p>
            </div>

            <input
              type="number"
              min="0"
              max={r.totalRooms - r.bookedRooms}
              defaultValue={r.blockedRooms}
              className="w-24 border p-2 rounded"
              onBlur={(e) =>
                updateBlock(r, Number(e.target.value))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
