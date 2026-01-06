import axios from "../axios";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminCoupons() {
  const token = localStorage.getItem("token");

  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountType: "percent",
    amount: "",
    minBookingAmount: "",
    validFrom: "",
    validTo: ""
  });

  const loadCoupons = async () => {
    const res = await axios.get("/coupons");
    setCoupons(res.data);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const addCoupon = async () => {
    await axios.post(
      "/coupons",
      {
        code: form.code.toUpperCase(),
        discountType: form.discountType,
        amount: Number(form.amount),
        minBookingAmount: Number(form.minBookingAmount),
        validFrom: form.validFrom ? new Date(form.validFrom).toISOString() : null,
        validTo: form.validTo ? new Date(form.validTo).toISOString() : null
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setForm({
      code: "",
      discountType: "percent",
      amount: "",
      minBookingAmount: "",
      validFrom: "",
      validTo: ""
    });

    loadCoupons();
  };

  const deleteCoupon = async (id) => {
    await axios.delete(
      `/coupons/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadCoupons();
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">Manage Coupons</h1>

        {/* ADD COUPON */}
        <div className="bg-white p-6 rounded-xl shadow max-w-xl mb-10">
          <h2 className="text-xl font-semibold mb-4">Add New Coupon</h2>

          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Coupon Code"
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value })
            }
          />

          <select
            className="w-full border p-2 rounded mb-2"
            value={form.discountType}
            onChange={(e) =>
              setForm({ ...form, discountType: e.target.value })
            }
          >
            <option value="percent">Percent (%)</option>
            <option value="flat">Flat Amount (₹)</option>
          </select>

          <input
            type="number"
            className="w-full border p-2 rounded mb-2"
            placeholder="Discount Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <input
            type="number"
            className="w-full border p-2 rounded mb-2"
            placeholder="Minimum Booking Amount"
            value={form.minBookingAmount}
            onChange={(e) =>
              setForm({ ...form, minBookingAmount: e.target.value })
            }
          />

          <label className="text-sm">Start Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded mb-2"
            value={form.validFrom}
            onChange={(e) =>
              setForm({ ...form, validFrom: e.target.value })
            }
          />

          <label className="text-sm">End Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={form.validTo}
            onChange={(e) =>
              setForm({ ...form, validTo: e.target.value })
            }
          />

          <button
            onClick={addCoupon}
            className="mt-4 bg-palmGreen text-white px-4 py-2 rounded"
          >
            Add Coupon
          </button>
        </div>

        {/* LIST COUPONS */}
        <div className="grid md:grid-cols-2 gap-6">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-xl shadow border"
            >
              <h3 className="text-xl font-semibold">{c.code}</h3>

              <p className="text-gray-600">
                {c.discountType === "percent"
                  ? `${c.amount}% OFF`
                  : `₹${c.amount} OFF`}
              </p>

              <p className="text-sm mt-1">
                Min Booking: ₹{c.minBookingAmount}
              </p>

              <p className="text-sm text-gray-600">
                {c.validFrom.slice(0, 10)} → {c.validTo.slice(0, 10)}
              </p>

              <p className="mt-1 text-sm">
                Status:{" "}
                <span
                  className={`font-bold ${
                    c.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {c.isActive ? "Active" : "Expired"}
                </span>
              </p>

              <button
                onClick={() => deleteCoupon(c.id)}
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
