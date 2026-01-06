import { useEffect, useState } from "react";
import axios from "../axios";
import AdminSidebar from "./AdminSidebar"; // existing
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#1B5E20", "#8C5E2C", "#FF8A00", "#008CBA"];

export default function AdminCharts() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // admin should be logged in

    axios.get("/admin/stats", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setStats(res.data)).catch(err => {
      console.error(err);
      // redirect logic if unauthorized could be added
    });
  }, []);

  if (!stats) return <div className="flex"><AdminSidebar /><div className="ml-72 p-10">Loading...</div></div>;

  const { hotelsCount, campingCount, bookingsCount, usersCount, totalRevenue, hotelRevenue, campingRevenue, bookingsByMonths } = stats;

  const pieData = [
    { name: "Hotel Revenue", value: hotelRevenue || 0 },
    { name: "Camping Revenue", value: campingRevenue || 0 }
  ];

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-3xl text-palmGreen">Admin Analytics</h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-sm text-gray-500">Hotels</div>
            <div className="text-2xl font-bold">{hotelsCount}</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-sm text-gray-500">Camping</div>
            <div className="text-2xl font-bold">{campingCount}</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-sm text-gray-500">Bookings</div>
            <div className="text-2xl font-bold">{bookingsCount}</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-sm text-gray-500">Revenue</div>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
          </div>
        </div>

        {/* Charts section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Bookings bar chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-heading text-xl mb-4">Bookings (Last 6 months)</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={bookingsByMonths}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1B5E20" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Pie */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-heading text-xl mb-4">Revenue Split</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
