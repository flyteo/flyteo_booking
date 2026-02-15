import { useEffect, useState } from "react";
import api from "../axios";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminBookings() {

  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    location: "",
    type: "",
    paymentStatus: ""
  });

  const loadBookings = async () => {
    const res = await api.get(
      "/admin/bookings",
      {
        params: filters
      }
    );
    setBookings(res.data);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <AdminTopbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">
            Manage Bookings
          </h1>

          {/* FILTERS */}
          <div className="grid md:grid-cols-5 gap-4 bg-white p-4 rounded shadow mb-6">
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              className="border p-2 rounded"
            />

            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              className="border p-2 rounded"
            />

            <input
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="border p-2 rounded"
            />

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="">All Types</option>
              <option value="hotel">Hotel</option>
              <option value="camping">Camping</option>
            </select>

            <select
              value={filters.paymentStatus}
              onChange={(e) =>
                setFilters({ ...filters, paymentStatus: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="">Payment</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>

            <button
              onClick={loadBookings}
              className="bg-palmGreen text-white rounded px-4 py-2"
            >
              Apply
            </button>
          </div>

          {/* BOOKINGS TABLE */}
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Date</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Hotel / Camping</th>
                  <th>Location</th>
                  <th>Guests</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t">
                    <td className="p-3">
                      {new Date(b.checkIn).toLocaleDateString()}
                    </td>
                    <td>{b.user?.name}</td>
                    <td className="capitalize">{b.type}</td>
                    <td>{b.hotel?.name || b.camping?.name}</td>
                    <td>{b.hotel?.location || b.camping?.location}</td>
                    <td>{b.guests}</td>
                    <td className="font-bold">₹{b.price}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          b.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {bookings.length === 0 && (
              <p className="text-center p-6 text-gray-500">
                No bookings found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
