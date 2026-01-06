import { useEffect, useState } from "react";
import axios from "../axios";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function ManageCamping() {
  const [campings, setCampings] = useState([]);

  useEffect(() => {
    axios.get("/api/campings")
      .then((res) => setCampings(res.data));
  }, []);

  const delHotel = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`/api/campings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCampings(campings.filter((h) => h.id !== id));
  };

  return (
   <div className="flex">
    <AdminSidebar />

    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="font-heading text-3xl text-palmGreen mb-6">Manage Camping</h1>

      <Link
        to="/admin/camping/add"
        className="bg-palmGreen text-white px-4 py-2 rounded mb-4 inline-block"
      >
        + Add Camping
      </Link>
      <div className="mt-6 space-y-4">
        {campings.map((h) => (
          <div key={h.id} className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading">{h.name}</h2>
              <p>{h.location}</p>
            </div>

            <div className="flex gap-4">
              <Link to={`/admin/campings/edit/${h.id}`} className="bg-blue-600 text-white px-4 py-2 rounded">Edit</Link>
              <button onClick={() => delHotel(h.id)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
            </div>
            {/* <div>
                <Link
            to="/admin/camping/add"
            className="bg-palmGreen text-white px-4 py-2 rounded"
            >
            + Add Camping
            </Link>

            </div> */}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
