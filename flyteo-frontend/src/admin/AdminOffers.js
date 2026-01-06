import axios from "../axios";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminOffers() {
  const token = localStorage.getItem("token");

  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    discountPercent: "",
    validFrom: "",
    validTo: ""
  });

  const loadOffers = async () => {
    const res = await axios.get("/offers");
    setOffers(res.data);
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const addOffer = async () => {
    await axios.post(
      "/offers",
      {
        title: form.title,
        discountPercent: Number(form.discountPercent),
        validFrom: form.validFrom
  ? new Date(form.validFrom).toISOString()
  : null,
        validTo: form.validTo ? new Date(form.validTo).toISOString() : null
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setForm({ title: "", discountPercent: "", validFrom: "", validTo: "" });
    loadOffers();
  };

  const deleteOffer = async (id) => {
    await axios.delete(
      `/offers/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadOffers();
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">Manage Offers</h1>

        {/* ADD OFFER */}
        <div className="bg-white p-6 rounded-xl shadow max-w-xl mb-10">
          <h2 className="text-xl font-semibold mb-4">Add New Offer</h2>

          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Offer Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            type="number"
            className="w-full border p-2 rounded mb-2"
            placeholder="Discount %"
            value={form.discountPercent}
            onChange={(e) =>
              setForm({ ...form, discountPercent: e.target.value })
            }
          />

          <label className="text-sm">Start Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded mb-2"
            value={form.validFrom}
            onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
          />

          <label className="text-sm">End Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={form.validTo}
            onChange={(e) => setForm({ ...form, validTo: e.target.value })}
          />

          <button
            onClick={addOffer}
            className="mt-4 bg-palmGreen text-white px-4 py-2 rounded"
          >
            Add Offer
          </button>
        </div>

        {/* LIST OFFERS */}
        <div className="grid md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white p-5 rounded-xl shadow border">
              <h3 className="text-xl font-semibold">{offer.title}</h3>

              <p className="mt-2 font-bold text-palmGreen">
                {offer.discountPercent}% OFF
              </p>

              <p className="text-sm text-gray-600">
                {offer.validFrom.slice(0, 10)} → {offer.validTo.slice(0, 10)}
              </p>

              <p className="mt-1 text-sm">
                Status:{" "}
                <span
                  className={`font-bold ${
                    offer.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {offer.isActive ? "Active" : "Expired"}
                </span>
              </p>

              <button
                onClick={() => deleteOffer(offer.id)}
                className="mt-4 bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
