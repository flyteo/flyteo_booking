import { useEffect, useState } from "react";
import api from "../axios";
import AdminSidebar from "./AdminSidebar";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminVillaAvailability() {
  const [villas, setVillas] = useState([]);
  const [villaId, setVillaId] = useState("");
  const [availability, setAvailability] = useState([]);
  const [month, setMonth] = useState(new Date());

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadVillas();
  }, []);

  useEffect(() => {
    if (villaId) loadAvailability();
  }, [villaId, month]);

  const loadVillas = async () => {
    const res = await api.get("/villas", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setVillas(res.data);
  };

  const loadAvailability = async () => {
    const res = await api.get(
      `/admin/villa-availability?villaId=${villaId}&month=${
        month.getMonth() + 1
      }&year=${month.getFullYear()}`,
      { headers: { Authorization: `Bearer ${token}` } }
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
        { villaId, date: dateStr },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      if (!window.confirm(`Unblock ${dateStr}?`)) return;

      await api.delete("/admin/villa-unblock-date", {
        data: { villaId, date: dateStr },
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    loadAvailability();
  };

  const getStatus = (dateStr) =>
    availability.find((d) => d.date === dateStr)?.status ||
    "available";

  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0
  ).getDate();

  const startDay = new Date(
    month.getFullYear(),
    month.getMonth(),
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
              month.getFullYear(),
              month.getMonth(),
              i + 1
            );
            const dateStr = date.toISOString().split("T")[0];
            const status = getStatus(dateStr);

            const color =
              status === "blocked"
                ? "bg-gray-500"
                : status === "booked"
                ? "bg-red-500"
                : "bg-green-500";

            return (
              <div
                key={dateStr}
                onClick={() =>
                  status !== "booked" &&
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
