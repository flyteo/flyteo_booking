import { useEffect, useState } from "react";
import api from "../axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function EditVilla() {
  const { id } = useParams();
  const nav = useNavigate();
  const [villa, setVilla] = useState(null);
   const DAYS = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY"
  ];
  
  const [dayWisePercentage, setDayWisePercentage] = useState({
    SUNDAY: "",
    MONDAY: "",
    TUESDAY: "",
    WEDNESDAY: "",
    THURSDAY: "",
    FRIDAY: "",
    SATURDAY: ""
  });

  useEffect(() => {

    api
      .get(`/villas/${id}`)
      .then(res => {
        const v = res.data;

        setVilla({
          id: v.id,
          name: v.name || "",
          location: v.location || "",
          address: v.address || "",
          discount:v.discount || "",
          description: v.description || "",
          mapLocation: v.mapLocation || "",
          email:v.email || "",
          taxes:v.taxes || "",

          maxGuests: v.maxGuests || 1,
          includedGuests: v.includedGuests || 1,
          basePrice: v.basePrice || "",
          extraGuestPrice: v.extraGuestPrice || "",
          securityDeposit: v.securityDeposit || "",

          checkInTime: v.checkInTime || "",
          checkOutTime: v.checkOutTime || "",
          cancellationPolicy: v.cancellationPolicy || "",

          advancePaymentAllowed: v.advancePaymentAllowed ?? false,
          advancePercent: v.advancePercent ?? "",

          images: v.villaimage?.map(i => i.url) || [],

          layout: {
            bedrooms: v.villalayout?.bedrooms || "",
            bathrooms: v.villalayout?.bathrooms || "",
            beds:v.villalayout?.beds || "",
            livingRoom: v.villalayout?.livingRoom || false,
            kitchen: v.villalayout?.kitchen || false,
            privatePool: v.villalayout?.privatePool || false,
            garden: v.villalayout?.garden || false,
            parkingSlots: v.villalayout?.parkingSlots || 0
          }
        });
        // ✅ Convert array → object with all days
const dayMap = {
  SUNDAY: "",
  MONDAY: "",
  TUESDAY: "",
  WEDNESDAY: "",
  THURSDAY: "",
  FRIDAY: "",
  SATURDAY: ""
};

(v.day_wise_percentage || []).forEach(d => {
  dayMap[d.day] = d.percentage;
});

setDayWisePercentage(dayMap);
      });
  }, [id]);

  if (!villa) return <div className="p-10">Loading...</div>;

  const cleanDayWisePercentage = Object.fromEntries(
  Object.entries(dayWisePercentage)
    .filter(([_, v]) => v !== "" && Number(v) > 0)
    .map(([k, v]) => [k, Number(v)])
);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.put(
      `/villas/${id}`,
      {
        ...villa,
        taxes: Number(villa.taxes),
        basePrice: Number(villa.basePrice),
        extraGuestPrice: Number(villa.extraGuestPrice),
        maxGuests: Number(villa.maxGuests),
        includedGuests: Number(villa.includedGuests),
        securityDeposit: villa.securityDeposit
          ? Number(villa.securityDeposit)
          : null,
        advancePercent: villa.advancePaymentAllowed
          ? Number(villa.advancePercent)
          : null,
          dayWisePercentage: cleanDayWisePercentage,
      }
    );

    alert("Villa updated successfully");
    nav("/admin/villas");
  };

  return (
    <div className="flex">
      <AdminSidebar />
<div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold text-palmGreen">
          Edit Villa
        </h1>

        {/* BASIC INFO */}
        <label className="font-medium">Villa Name</label>
        <input className="w-full p-2 border rounded mb-3" placeholder="Villa Name"
          value={villa.name}
          onChange={e => setVilla({ ...villa, name: e.target.value })}
        />
<label>Location</label>
        <input className="w-full p-2 border rounded mb-3" placeholder="Location"
          value={villa.location}
          onChange={e => setVilla({ ...villa, location: e.target.value })}
        />
<label>Address</label>
        <input className="w-full p-2 border rounded mb-3" placeholder="Address"
          value={villa.address}
          onChange={e => setVilla({ ...villa, address: e.target.value })}
        />
        <label>Email</label>
        <input className="w-full p-2 border rounded mb-3" placeholder="Email" 
          value={villa.email}
          onChange={e => setVilla({ ...villa, email: e.target.value })}
        />
<label>Description</label>
        <textarea className="input h-28" placeholder="Description"
          value={villa.description}
          onChange={e => setVilla({ ...villa, description: e.target.value })}
        />

        {/* PRICING */}
        <div className="">
          <label>Base Price / night</label>
          <input type="number" className="w-full p-2 border rounded mb-3" placeholder="Base Price / night"
            value={villa.basePrice}
            onChange={e => setVilla({ ...villa, basePrice: e.target.value })}
          />
          <label>Extra Guest Price</label>
          <input type="number" className="w-full p-2 border rounded mb-3" placeholder="Extra Guest Price"
            value={villa.extraGuestPrice}
            onChange={e => setVilla({ ...villa, extraGuestPrice: e.target.value })}
          />
          <label>Taxes</label>
          <input type="number" className="w-full p-2 border rounded mb-3" placeholder="Taxes"
            value={villa.taxes}
            onChange={e => setVilla({ ...villa, taxes: e.target.value })}
          />
          <label> Discount </label>
          <input type="number" className="w-full p-2 border rounded mb-3" placeholder="Villa Discount"
            value={villa.discount}
            onChange={e => setVilla({ ...villa, discount: e.target.value })}
          />
        </div>

        <div className="">
          <label>Max Guests</label>
          <input type="number" className="w-full p-2 border rounded mb-3" placeholder="Max Guests"
            value={villa.maxGuests}
            onChange={e => setVilla({ ...villa, maxGuests: e.target.value })}
          />
          <label>Included Guests</label>
          <input type="number" className="w-full p-2 border rounded mb-3" placeholder="Included Guests"
            value={villa.includedGuests}
            onChange={e => setVilla({ ...villa, includedGuests: e.target.value })}
          />
          <label>Security Deposit</label>
          <input type="number" className="w-full p-2 border rounded mb-3" placeholder="Security Deposit"
            value={villa.securityDeposit}
            onChange={e => setVilla({ ...villa, securityDeposit: e.target.value })}
          />
        </div>
        <div className="bg-white shadow rounded-xl p-6 mt-8">
  <h2 className="text-xl font-heading text-palmGreen mb-4">
    Day-wise Pricing Percentage
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {DAYS.map(day => (
      <div key={day}>
        <label className="block text-sm font-semibold mb-1">
          {day}
        </label>

        <input
          type="number"
          min="0"
          max="100"
          placeholder="0"
          value={dayWisePercentage[day]}
          onChange={(e) =>
            setDayWisePercentage({
              ...dayWisePercentage,
              [day]:
                e.target.value === ""
                  ? ""
                  : Math.min(100, Math.max(0, Number(e.target.value)))
            })
          }
          className="w-full border p-2 rounded"
        />

        {dayWisePercentage[day] !== "" && (
  <p className="text-xs text-green-600 mt-1">
    Existing value
  </p>
)}

      </div>
    ))}
  </div>
</div>

        {/* ADVANCE PAYMENT */}
        <div className="border p-4 rounded">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={villa.advancePaymentAllowed}
              onChange={e =>
                setVilla({
                  ...villa,
                  advancePaymentAllowed: e.target.checked,
                  advancePercent: e.target.checked ? villa.advancePercent : ""
                })
              }
            />
            Enable Advance Payment
          </label>

          {villa.advancePaymentAllowed && (
            <input
              type="number"
              className="input mt-3"
              placeholder="Advance %"
              value={villa.advancePercent}
              onChange={e =>
                setVilla({ ...villa, advancePercent: e.target.value })
              }
            />
          )}
        </div>

        {/* LAYOUT */}
        <div className="border p-4 rounded space-y-3">
          <h2 className="font-semibold">Villa Layout</h2>

          <div className="">
            <label>Bedrooms</label>
            <input type="number" className="w-full p-2 border rounded mb-3" placeholder="Bedrooms"
              value={villa.layout.bedrooms}
              onChange={e =>
                setVilla({
                  ...villa,
                  layout: { ...villa.layout, bedrooms: e.target.value }
                })
              }
            />
            <label>Beds</label>
            <input type="number" className="w-full p-2 border rounded mb-3" placeholder="Beds"
              value={villa.layout.beds}
              onChange={e =>
                setVilla({
                  ...villa,
                  layout: { ...villa.layout, beds: e.target.value }
                })
              }
            />
            <label>Bathrooms</label>
            <input type="number" className="w-full p-2 border rounded mb-3" placeholder="Bathrooms"
              value={villa.layout.bathrooms}
              onChange={e =>
                setVilla({
                  ...villa,
                  layout: { ...villa.layout, bathrooms: e.target.value }
                })
              }
            />
          </div>

          {["livingRoom", "kitchen", "privatePool", "garden"].map(k => (
            <label key={k} className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={villa.layout[k]}
                onChange={e =>
                  setVilla({
                    ...villa,
                    layout: { ...villa.layout, [k]: e.target.checked }
                  })
                }
              />
              {k}
            </label>
          ))}
          <label>Parking Slots</label>
          <input type="number" className="w-full p-2 border rounded mb-3" placeholder="Parking Slots"
            value={villa.layout.parkingSlots}
            onChange={e =>
              setVilla({
                ...villa,
                layout: { ...villa.layout, parkingSlots: e.target.value }
              })
            }
          />
        </div>

        <button className="bg-palmGreen text-white px-6 py-3 rounded">
          Update Villa
        </button>
      </form>
    </div>
    </div>  
  );
}
