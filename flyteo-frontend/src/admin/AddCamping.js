import { useState } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import PointList from "./PointList";

export default function AddCamping() {
  const nav = useNavigate();

  const [camp, setCamp] = useState({
    name: "",
    location: "",
    description: "",
    // defaultPrice: 999,
    campingimage: [],

    campinginclusion: [],
    campingexclusion: [],
    campingactivity: [],
    campingitinerary: [{ day: "Day 1", description: [] }],
    
   campingpricing: {
  Sunday: { adultPrice: "", childPrice: "" },
  Monday: { adultPrice: "", childPrice: "" },
  Tuesday: { adultPrice: "", childPrice: "" },
  Wednesday: { adultPrice: "", childPrice: "" },
  Thursday: { adultPrice: "", childPrice: "" },
  Friday: { adultPrice: "", childPrice: "" },
  Saturday: { adultPrice: "", childPrice: "" }
},
    advancePaymentAllowed: false,
    advancePercent: ""

  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await api.post(
        "/campings",
        {
          ...camp,
           advancePaymentAllowed: Boolean(camp.advancePaymentAllowed),
    advancePercent: camp.advancePaymentAllowed
      ? Number(camp.advancePercent)
      : null,
      taxes: Number(camp.taxes || 0),
          // defaultPrice: Number(camp.defaultPrice),
         campingpricing: Object.fromEntries(
      Object.entries(camp.campingpricing).map(([day, v]) => [
        day,
        {
          adultPrice: v.adultPrice === "" ? null : Number(v.adultPrice),
          childPrice: v.childPrice === "" ? null : Number(v.childPrice)
        }
      ])
    )
        }
      );

      alert("Camping Package Added Successfully!");
      nav("/admin/camping");
    } catch (err) {
      console.error(err);
      setError("Failed to add camping package!");
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="font-heading text-3xl text-palmGreen mb-6 text-center">
          Add New Camping Package
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="font-medium">Camping Name</label>
            <input
              type="text"
              required
              className="w-full p-3 border rounded"
              value={camp.name}
              onChange={(e) => setCamp({ ...camp, name: e.target.value })}
            />
          </div>

          {/* Location */}
          <div>
            <label className="font-medium">Location</label>
            <input
              type="text"
              className="w-full p-3 border rounded"
              value={camp.location}
              onChange={(e) => setCamp({ ...camp, location: e.target.value })}
            />
          </div>

          {/* Default Price */}
          {/* <div>
            <label className="font-medium">Default Price (₹)</label>
            <input
              type="number"
              className="w-full p-3 border rounded"
              value={camp.defaultPrice}
              onChange={(e) =>
                setCamp({ ...camp, defaultPrice: Number(e.target.value) })
              }
            />
          </div> */}

          {/* Description */}
          <div>
            <label className="font-medium">Description</label>
            <textarea
              required
              className="w-full p-3 border rounded h-32"
              value={camp.description}
              onChange={(e) =>
                setCamp({ ...camp, description: e.target.value })
              }
            />
          </div>

          {/* Images */}
          <div>
            <label className="font-medium">Upload Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="w-full mt-1"
              onChange={async (e) => {
                const files = [...e.target.files];
                const uploaded = [];

                for (let f of files) {
                  const fd = new FormData();
                  fd.append("image", f);
                  const res = await api.post(
                    "/upload",
                    fd,
                    { headers: { "Content-Type": "multipart/form-data" } }
                  );
                  uploaded.push(res.data.url);
                }

                setCamp({ ...camp, campingimage: [...camp.campingimage, ...uploaded] });
              }}
            />

            {camp.campingimage.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {camp.campingimage.map((img, i) => (
                  <img key={i} src={img} className="h-24 w-full object-cover rounded" />
                ))}
              </div>
            )}
          </div>

          {/* Point lists */}
          <PointList title="Inclusions" points={camp.campinginclusion}
            setPoints={(v) => setCamp({ ...camp, campinginclusion: v })} />

          <PointList title="Exclusions" points={camp.campingexclusion}
            setPoints={(v) => setCamp({ ...camp, campingexclusion: v })} />
          <PointList title="Activities" points={camp.campingactivity}
            setPoints={(v) => setCamp({ ...camp, campingactivity: v })} />

          {/* Itinerary */}
          <div className="border p-4 rounded">
            <h2 className="font-heading text-xl mb-3">Camping Itinerary</h2>

            {camp.campingitinerary.map((day, index) => (
              <div key={index} className="mb-6 border rounded p-3">
                <h3 className="font-semibold mb-2">{day.day}</h3>

                <PointList
                  points={day.description}
                  setPoints={(v) => {
                    const updated = [...camp.campingitinerary];
                    updated[index].description = v;
                    setCamp({ ...camp, campingitinerary: updated });
                  }}
                />
              </div>
            ))}

            <button
              type="button"
              className="bg-palmGreen text-white px-4 py-2 rounded"
              onClick={() =>
                setCamp({
                  ...camp,
                  campingitinerary: [
                    ...camp.campingitinerary,
                    {
                      day: `Day ${camp.campingitinerary.length + 1}`,
                      description: []
                    }
                  ]
                })
              }
            >
              + Add Day
            </button>
          </div>

          {/* Pricing */}
        <div className="border p-4 rounded">
  <h2 className="font-heading text-xl mb-3">Day-wise Pricing</h2>

  {Object.entries(camp.campingpricing).map(([day, prices]) => (
    <div key={day} className="grid grid-cols-3 gap-3 mb-2 items-center">
      <label className="font-medium">{day}</label>

      <input
        type="number"
        placeholder="Adult ₹"
        className="p-2 border rounded"
        value={prices.adultPrice}
        onChange={(e) =>
          setCamp({
            ...camp,
            campingpricing: {
              ...camp.campingpricing,
              [day]: {
                ...prices,
                adultPrice: e.target.value
              }
            }
          })
        }
      />

      <input
        type="number"
        placeholder="Child ₹"
        className="p-2 border rounded"
        value={prices.childPrice}
        onChange={(e) =>
          setCamp({
            ...camp,
            campingpricing: {
              ...camp.campingpricing,
              [day]: {
                ...prices,
                childPrice: e.target.value
              }
            }
          })
        }
      />
    </div>
  ))}
</div>
<div>
  <label className="font-medium">Taxes of Camping</label>
  <input
    type="number"
    className="w-full p-3 border rounded"
    value={camp.taxes || ""}
    onChange={(e) => setCamp({ ...camp, taxes: e.target.value })}
    placeholder="Example: 10"
  />
</div>
{/* ADVANCE PAYMENT SETTINGS */}
<div className="border p-4 rounded">
  <h2 className="font-heading text-xl mb-3">
    Advance Payment Settings
  </h2>

  {/* Toggle */}
  <label className="flex items-center gap-3">
    <input
      type="checkbox"
      checked={camp.advancePaymentAllowed}
      onChange={(e) =>
        setCamp({
          ...camp,
          advancePaymentAllowed: e.target.checked,
          advancePercent: e.target.checked ? camp.advancePercent : ""
        })
      }
    />
    <span className="font-medium">
      Allow Advance Payment
    </span>
  </label>

  {/* Percentage */}
  {camp.advancePaymentAllowed && (
    <div className="mt-3">
      <label className="font-medium">
        Advance Payment Percentage (%)
      </label>
      <input
        type="number"
        min="1"
        max="100"
        required
        className="w-full p-3 border rounded mt-1"
        placeholder="e.g. 30"
        value={camp.advancePercent}
        onChange={(e) =>
          setCamp({
            ...camp,
            advancePercent: e.target.value
          })
        }
      />
      <p className="text-xs text-gray-500 mt-1">
        Customer will pay this percentage now, remaining later
      </p>
    </div>
  )}
</div>



          <button type="submit" className="w-full bg-palmGreen text-white py-3 rounded">
            Add Camping
          </button>
        </form>
      </div>
    </div>
  );
}
