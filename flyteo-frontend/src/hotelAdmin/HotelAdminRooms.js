import { useEffect, useState } from "react";
import api from "../axios";
import HotelAdminSidebar from "./HotelAdminSidebar";

export default function HotelAdminRooms() {
  

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [confirmData,setConfirmData] =useState(null);
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCalendar = async () => {
    if (!from || !to) return;

    setLoading(true);

    const res = await api.get(
      `/occupancy/calendar?from=${from}&to=${to}`
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
      { roomId, date, blockedRooms }
    );

    loadCalendar();
  };

  

 return (
  <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2f7] flex">

    {/* SIDEBAR */}
    <div className="md:block">
      <HotelAdminSidebar />
    </div>

    {/* MAIN CONTENT */}
    <div className="flex-1 md:ml-72 px-4 md:px-10 pt-16 md:pt-8 pb-10">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl md:text-3xl font-heading text-palmGreen">
          Room Availability
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage daily room blocking — Powered by Flyteo
        </p>
      </div>

      {/* DATE FILTER */}
      <div className="bg-white rounded-2xl shadow-md p-5 mt-6 flex flex-col md:flex-row md:items-end gap-4">

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-palmGreen outline-none"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-palmGreen outline-none"
          />
        </div>

        <button
          onClick={loadCalendar}
          className="bg-palmGreen hover:scale-105 transition text-white px-6 py-2 rounded-xl shadow-md"
        >
          Load Availability
        </button>

      </div>

      {loading && (
        <p className="mt-6 text-gray-500">Loading availability…</p>
      )}

      {/* CALENDAR DATA */}
      <div className="mt-8 space-y-10">

        {calendar.map((day) => (
          <div key={day.date}>

            {/* DATE HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                {day.date}
              </h2>
              <div className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                {day.rooms.length} Room Types
              </div>
            </div>

            {/* ROOM CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {day.rooms.map((r) => {
                const maxBlockable = r.total - r.booked;

                return (
                  <div
                    key={r.roomId}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col justify-between"
                  >

                    {/* ROOM INFO */}
                    <div>
                      <p className="font-semibold text-lg">
                        {r.roomType}
                      </p>

                      <div className="mt-2 text-sm text-gray-600 space-y-1">
                        <p>Total: {r.total}</p>
                        <p>Booked: {r.booked}</p>
                        <p>
                          Available:
                          <span className="ml-1 font-bold text-green-600">
                            {r.available}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* BLOCK CONTROL */}
                    <div className="mt-4 flex items-center justify-between">

                      <input
                        type="number"
                        min="0"
                        max={maxBlockable}
                        defaultValue={r.blocked}
                        className="w-24 border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-palmGreen outline-none"
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

      </div>

      {/* CONFIRM MODAL */}
      {confirmData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">

          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fadeIn">

            <h2 className="text-xl font-semibold mb-3 text-palmGreen">
              Confirm Room Blocking
            </h2>

            <p className="text-sm text-gray-700 mb-6">
              Block <b>{confirmData.blockedRooms}</b> room(s) on{" "}
              <b>{confirmData.date}</b>?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setConfirmData(null)}
                className="px-4 py-2 border rounded-xl"
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
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
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
