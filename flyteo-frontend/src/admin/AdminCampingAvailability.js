import { useEffect, useState } from "react";
import api from "../axios";
import AdminSidebar from "./AdminSidebar";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminCampingAvailability() {
  const [availability, setAvailability] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [campingId, setCampingId] = useState("");
  const [campings, setCampings] = useState([]);
  const [confirm, setConfirm] = useState(null);

  const token = localStorage.getItem("token");

  /* ========================
     LOAD CAMPINGS
  ======================== */
  useEffect(() => {
    api
      .get("/campings", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setCampings(res.data));
  }, []);

  /* ========================
     LOAD AVAILABILITY
  ======================== */
  useEffect(() => {
    if (!campingId) return;

    api
      .get(
        `/admin/camping-availability?campingId=${campingId}&month=${
          currentMonth.getMonth() + 1
        }&year=${currentMonth.getFullYear()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => setAvailability(res.data));
  }, [campingId, currentMonth]);

  const getStatus = (dateStr) => {
    return (
      availability.find(
        a => a.date?.split("T")[0] === dateStr
      )?.status || "open"
    );
  };

  /* ========================
     CONFIRM ACTION
  ======================== */
  const handleConfirm = async () => {
    const { date, status } = confirm;

    if (status === "open") {
      await api.post(
        "/admin/camping-availability/block",
        { campingId, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await api.post(
        "/admin/camping-availability/unblock",
        { campingId, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setConfirm(null);
    reload();
  };

  const reload = async () => {
   const res= await api
      .get(
        `/admin/camping-availability?campingId=${campingId}&month=${
          currentMonth.getMonth() + 1
        }&year=${currentMonth.getFullYear()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const normalized = res.data.map(d => ({
    ...d,
    date: new Date(d.date).toISOString().split("T")[0]
  }));
       setAvailability(res.data);
  };
const formatLocalDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
  /* ========================
     CALENDAR LOGIC
  ======================== */
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
          Camping Availability
        </h1>

        {/* CAMPING SELECT */}
        <select
          className="border p-2 rounded mb-6"
          value={campingId}
          onChange={(e) => setCampingId(e.target.value)}
        >
          <option value="">Select Camping</option>
          {campings.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {!campingId && (
          <p className="text-gray-500">
            Select a camping to manage availability
          </p>
        )}

        {campingId && (
          <>
            {/* MONTH NAV */}
            <div className="flex justify-between mb-4">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.setMonth(
                        currentMonth.getMonth() - 1
                      )
                    )
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
                    new Date(
                      currentMonth.setMonth(
                        currentMonth.getMonth() + 1
                      )
                    )
                  )
                }
              >
                Next ▶
              </button>
            </div>

            {/* CALENDAR */}
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map(d => (
                <div
                  key={d}
                  className="font-semibold text-center"
                >
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
                

                const color =
                  status === "blocked"
                    ? "bg-red-600"
                    : "bg-green-600";

                return (
                  <div
                    key={dateStr}
                    onClick={() =>
                      setConfirm({ date: dateStr, status })
                    }
                    className={`cursor-pointer text-white p-3 rounded text-center ${color}`}
                  >
                    {i + 1}
                    <div className="text-[10px] mt-1 capitalize">
                      {status}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* LEGEND */}
            <div className="flex gap-4 mt-6 text-sm">
              <Legend color="bg-green-600" label="Booking ON" />
              <Legend color="bg-red-600" label="Booking OFF" />
            </div>
          </>
        )}
      </div>

      {/* CONFIRM MODAL */}
      {confirm && (
        <ConfirmModal
          date={confirm.date}
          status={confirm.status}
          onCancel={() => setConfirm(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

/* ========================
   COMPONENTS
======================== */
const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <span className={`w-4 h-4 rounded ${color}`} />
    {label}
  </div>
);

const ConfirmModal = ({ date, status, onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">
      <h3 className="text-xl font-semibold mb-4">
        {status === "open"
          ? "Block Camping"
          : "Unblock Camping"}
      </h3>

      <p className="mb-6">
        Are you sure you want to{" "}
        <b>{status === "open" ? "block" : "open"}</b>{" "}
        camping booking for
        <br />
        <b>{new Date(date).toDateString()}</b>?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-palmGreen text-white rounded"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);
