import { useEffect, useState } from "react";
import axios from "../axios";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function ManageHotels() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    axios.get("/hotels")
      .then((res) => setHotels(res.data));
  }, []);

  const delHotel = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`/hotels/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setHotels(hotels.filter((h) => h.id !== id));
  };

  return (
     <div className="flex">
    <AdminSidebar />

    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="font-heading text-3xl text-palmGreen mb-6">Manage Hotels</h1>
      
      <Link to="/admin/hotels/add" className="bg-palmGreen text-white px-4 py-2 rounded mb-4">
        + Add New Hotel
      </Link>
      <div className="mt-6 space-y-4">
        {hotels.map((h) => (
          <div key={h.id} className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading">{h.name}</h2>
              <p>{h.location}</p>
            </div>

            <div className="flex gap-4">

              <Link to={`/admin/hotels/edit/${h.id}`} className="bg-blue-600 text-white px-4 py-2 rounded">Edit</Link>
              <button onClick={() => delHotel(h.id)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
            </div>
            {/* <div>
                <Link
                to="/admin/hotels/add"
                className="bg-palmGreen text-white px-4 py-2 rounded"
                >
                + Add New Hotel
                </Link>

            </div> */}

          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
