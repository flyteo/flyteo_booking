import { useEffect, useState } from "react";
import api from "../axios";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import {useAuth} from "../context/AuthContext";

export default function AdminDashboard() {
  const nav = useNavigate();
const { user, loading } = useAuth();
  const [stats, setStats] = useState(null);

  
  useEffect(() => {
if (loading) return null;

if (!user || user.role !== "admin") {
  nav("/login");
  return;
}
  }, []);

 

 useEffect(() => {

    api.get("/admin/stats").then(res => setStats(res.data)).catch(err => {
      console.error(err);
      // redirect logic if unauthorized could be added
    });
  }, []);
 
   if (!stats) return <div className="flex"><AdminSidebar /><div className="ml-72 p-10">Loading...</div></div>;
  
  const { hotelsCount, campingCount, bookingsCount, usersCount } = stats;
    

  return (
    <div className="flex min-h-screen bg-gray-100">
        <div className="md:block">
        <AdminSidebar />
      </div>
        <div className="flex-1 md:ml-72 px-4 md:px-8">
            <AdminTopbar/>
      <h1 className="font-heading text-2xl md:text-3xl text-palmGreen mb-6">
        Admin Dashboard
      </h1>
 {/* <button
          onClick={logout}
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button> */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard title="Hotels" value={hotelsCount} />
          <StatCard title="Camping" value={campingCount} />
          <StatCard title="Bookings" value={bookingsCount} />
          <StatCard title="Users" value={usersCount} />
        </div>

      {/* Navigation links */}
      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <Link className="bg-palmGreen text-white px-6 py-3 rounded-lg text-center" to="/admin/hotels">
          Manage Hotels
        </Link>

        <Link className="bg-rusticBrown text-white px-6 py-3 rounded-lg text-center" to="/admin/camping">
          Manage Camping
        </Link>
        <Link
  className="bg-blue-600 text-white px-6 py-3 rounded-lg text-center"
  to="/admin/bookings"
>
  Manage Bookings
</Link>

      </div>
      <div className="flex justify-between items-center mb-6">

 
</div>
</div>
    </div>
  );
}
function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow">
      <h2 className="text-sm md:text-lg text-gray-600">{title}</h2>
      <p className="text-2xl md:text-3xl font-bold text-palmGreen">
        {value}
      </p>
    </div>
  );
}