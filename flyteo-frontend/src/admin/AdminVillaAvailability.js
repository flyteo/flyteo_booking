import { useEffect, useState } from "react";
import api from "../axios";
import AdminSidebar from "./AdminSidebar";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminVillaAvailability() {
  const [villas, setVillas] = useState([]);
  const [villaId, setVillaId] = useState("");
  const [availability, setAvailability] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());


  useEffect(() => {
    loadVillas();
  }, []);

  useEffect(() => {
    if (villaId) loadAvailability();
  }, [villaId, currentMonth]);

  const loadVillas = async () => {
    const res = await api.get("/villas");
    setVillas(res.data);
  };

  const loadAvailability = async () => {
    const res = await api.get(
      `/admin/villa-availability?villaId=${villaId}&month=${
        currentMonth.getMonth() + 1
      }&year=${currentMonth.getFullYear()}`
    );
    const normalized = res.data.map(d => ({
    ...d,
    date: new Date(d.date).toISOString().split("T")[0]
  }));
    setAvailability(normalized);
  };

  const toggleDate = async (dateStr, status) => {
    if (status === "available") {
      if (!window.confirm(`Block ${dateStr}?`)) return;

      await api.post(
        "/admin/villa-block-date",
        { villaId, date: dateStr }
      );
    } else {
      if (!window.confirm(`Unblock ${dateStr}?`)) return;

      await api.delete("/admin/villa-unblock-date", {
        data: { villaId, date: dateStr }
      });
    }

    loadAvailability();
  };

  const formatLocalDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
  const getStatus = (dateStr) =>
    availability.find((d) => d.date === dateStr)?.status ||
    "available";

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
      <AdminSidebar />

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-heading mb-6">
          Admin – Villa Availability
        </h1>

        <select
          className="border p-2 rounded mb-4"
          value={villaId}
          onChange={(e) => setVillaId(e.target.value)}
        >
          <option value="">Select Villa</option>
          {villas.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
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

        {/* CALENDAR */}
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center font-semibold">
              {d}
            </div>
          ))}

          {Array.from({ length: startDay }).map((_, i) => (
            <div key={i} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const date = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              i + 1
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
        !isPast && status !== "booked"  &&
                  toggleDate(dateStr, status)
                }
                className={`cursor-pointer p-3 text-white text-center rounded ${color}`}
              >
                {i + 1}
                <div className="text-[7px]">{status}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
