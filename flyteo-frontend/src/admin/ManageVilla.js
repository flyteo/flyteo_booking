import { useEffect, useState } from "react";
import api from "../axios";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function ManageVilla() {
  const [villas, setVillas] = useState([]);

  useEffect(() => {
    api.get("/villas")
      .then((res) => setVillas(res.data));
  }, []);

  const delVilla = async (id) => {
    const token = localStorage.getItem("token");
    await api.delete(`/villas/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setVillas(villas.filter((v) => v.id !== id));
  };

  return (
     <div className="flex">
    <AdminSidebar />

    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="font-heading text-3xl text-palmGreen mb-6">Manage Villas</h1>

      <Link to="/admin/villas/add" className="bg-palmGreen text-white px-4 py-2 rounded mb-4">
        + Add New Villa
      </Link>
      <div className="mt-6 space-y-4">
        {villas.map((v) => (
          <div key={v.id} className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading">{v.name}</h2>
              <p>{v.location}</p>
            </div>

            <div className="flex gap-4">

              <Link to={`/admin/villas/edit/${v.id}`} className="bg-blue-600 text-white px-4 py-2 rounded">Edit</Link>
              <button onClick={() => delVilla(v.id)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
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
