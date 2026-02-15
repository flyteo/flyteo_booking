import { useEffect, useState } from "react";
import api from "../axios";
import VillaAdminSidebar from "./VillaAdminSidebar";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function VillaAvailabilityCalendar() {
  const [availability, setAvailability] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [confirmDate, setConfirmDate] = useState(null);
const [confirmStatus, setConfirmStatus] = useState(null);


  useEffect(() => {
    loadAvailability();
  }, [currentMonth]);

  const loadAvailability = async () => {
    
    const res = await api.get(
      `/villa-admin/availability?month=${currentMonth.getMonth() + 1}&year=${currentMonth.getFullYear()}`
    );

    // ✅ normalize dates to YYYY-MM-DD
  const normalized = res.data.map(d => ({
    ...d,
    date: new Date(d.date).toISOString().split("T")[0]
  }));
    setAvailability(normalized);
  };

 const getStatus = (dateStr) => {
  const found = availability.find(a => a.date === dateStr);
  return found?.status || "available";
};

  const openConfirm = (dateStr, status) => {
  setConfirmDate(dateStr);
  setConfirmStatus(status);
};


  // const toggleBlock = async (dateStr, status) => {
  //   const token = localStorage.getItem("token");

  //   if (status === "available") {
  //     await api.post(
  //       "/villa-admin/block-dates",
  //       { date: [dateStr] },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //   }

  //   if (status === "blocked") {
  //     await api.delete(
  //       `/villa-admin/unblock-date/${dateStr}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //   }

  //   loadAvailability();
  // };

  const confirmAction = async () => {

  if (confirmStatus === "available") {
    await api.post(
      "/villa-admin/block-dates",
      { dates: [confirmDate] }
    );
  }

  if (confirmStatus === "blocked") {
    await api.delete(
      `/villa-admin/unblock-date/${confirmDate}`
    );
  }

  setConfirmDate(null);
  setConfirmStatus(null);
  loadAvailability();
};

const formatLocalDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const startDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  return (
    <div className="flex">
      <div className="md:block">
      <VillaAdminSidebar />
      </div>
<div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="text-2xl font-heading mb-6">
        Villa Availability Calendar
      </h1>

      {/* MONTH CONTROLS */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
            )
          }
        >
          ◀ Prev
        </button>

        <h2 className="text-xl font-semibold">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric"
          })}
        </h2>

        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
            )
          }
        >
          Next ▶
        </button>
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map(d => (
          <div key={d} className="font-semibold text-center">
            {d}
          </div>
        ))}

        {Array.from({ length: startDay }).map((_, i) => (
          <div key={i} />
        ))}

       {Array.from({ length: daysInMonth }).map((_, i) => {
  const day = i + 1;

  const date = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    day
  );

  const dateStr = formatLocalDate(date);
  const status = getStatus(dateStr);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPast =
    date < today &&
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  let color = "bg-green-500";

  if (status === "booked") color = "bg-red-500";
  else if (status === "blocked") color = "bg-gray-500";
  else if (isPast) color = "bg-gray-300 text-gray-500";

  return (
    <div
      key={dateStr}
      onClick={() =>
        !isPast && status !== "booked" && openConfirm(dateStr, status)
      }
      className={`p-3 rounded text-center text-white
        ${color}
        ${isPast || status === "booked"
          ? "cursor-not-allowed opacity-80"
          : "cursor-pointer"}
      `}
    >
      {day}
      <div className="text-[10px] mt-1 capitalize">
        {isPast ? "past" : status}
      </div>
    </div>
  );
})}

      </div>
      {confirmDate && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">

      <h2 className="text-xl font-semibold mb-3 text-palmGreen">
        {confirmStatus === "available"
          ? "Block this date?"
          : "Unblock this date?"}
      </h2>

      <p className="text-gray-600 mb-5">
        Date: <b>{confirmDate}</b>
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setConfirmDate(null)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={confirmAction}
          className="px-4 py-2 bg-palmGreen text-white rounded"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}


      {/* LEGEND */}
      <div className="flex gap-4 mt-6 text-sm">
        <Legend color="bg-green-500" label="Available" />
        <Legend color="bg-red-500" label="Booked" />
        <Legend color="bg-gray-500" label="Blocked" />
      </div>
    </div>
    </div>
  );
}

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <span className={`w-4 h-4 rounded ${color}`} />
    {label}
  </div>
);
