import { useEffect, useState } from "react";
import api from "../axios";
import HotelAdminSidebar from "./HotelAdminSidebar";

export default function HotelAdminRooms() {
  const token = localStorage.getItem("token");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [confirmData,setConfirmData] =useState(null);
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCalendar = async () => {
    if (!from || !to) return;

    setLoading(true);

    const res = await api.get(
      `/occupancy/calendar?from=${from}&to=${to}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCalendar(res.data);
    setLoading(false);
  };

  const normalizeDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);

  // month - 1 because JS months are 0-based
  return new Date(year, month - 1, day);
};

  const updateBlockedRooms = async (roomId, date, blockedRooms, maxAllowed) => {
    if (blockedRooms < 0 || blockedRooms > maxAllowed) {
      alert(`Blocked rooms must be between 0 and ${maxAllowed}`);
      return;
    }

    await api.post(
      "/hotel-admin/availability/block",
      { roomId, date, blockedRooms },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    loadCalendar();
  };

  

  return (
    <div className="flex">
      <HotelAdminSidebar />

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-heading text-palmGreen mb-6">
          Room Availability Calendar
        </h1>

        {/* DATE RANGE */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">From</label>
            <input
              type="date"
              className="border p-2 rounded"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">To</label>
            <input
              type="date"
              className="border p-2 rounded"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <button
            onClick={loadCalendar}
            className="bg-palmGreen text-white px-6 py-2 rounded mt-6"
          >
            Load Availability
          </button>
        </div>

        {loading && <p>Loading availability…</p>}

        {/* CALENDAR */}
        {calendar.map((day) => (
          <div key={day.date} className="mb-8">
            <h2 className="font-semibold text-xl mb-3">
             {day.date}
            </h2>

            <div className="space-y-4">
              {day.rooms.map((r) => {
                const maxBlockable = r.total - r.booked;

                return (
                  <div
                    key={r.roomId}
                    className="bg-white shadow rounded p-4 flex flex-col md:flex-row justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{r.roomType}</p>
                      <p className="text-sm text-gray-600">
                        Total: {r.total} | Booked: {r.booked} | Available:{" "}
                        <span className="font-bold text-green-600">
                          {r.available}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-3 md:mt-0">
                      <input
                        type="number"
                        min="0"
                        max={maxBlockable}
                        defaultValue={r.blocked}
                        className="w-20 border p-2 rounded"
                        onBlur={(e) => {
  const value = Number(e.target.value);

  if (value < 0 || value > maxBlockable) {
    alert(`Max blockable rooms: ${maxBlockable}`);
    return;
  }

  setConfirmData({
    roomId: r.roomId,
    date: day.date,
    blockedRooms: value,
    maxBlockable
  });
}}

                      />
                      <span className="text-sm text-gray-500">
                        Blocked
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {confirmData && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">

      <h2 className="text-xl font-semibold mb-3 text-palmGreen">
        Confirm Room Blocking
      </h2>

      <p className="text-sm text-gray-700 mb-4">
        Are you sure you want to block{" "}
        <b>{confirmData.blockedRooms}</b> room(s) for this date?
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setConfirmData(null)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            await updateBlockedRooms(
              confirmData.roomId,
              confirmData.date,
              confirmData.blockedRooms,
              confirmData.maxBlockable
            );
            setConfirmData(null);
          }}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
