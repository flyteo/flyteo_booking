import { useEffect, useState } from "react";
import axios from "../axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import PointList from "./PointList";

export default function EditCamping() {
  const { id } = useParams();
  const nav = useNavigate();

  const [camp, setCamp] = useState(null);
  const [error, setError] = useState("");

  // LOAD CAMPING
  useEffect(() => {
    const loadCamp = async () => {
      try {
        const res = await axios.get(
          `/api/campings/${id}`
        );
        const c = res.data;

        setCamp({
  name: c.name || "",
  location: c.location || "",
  description: c.description || "",

  // ✅ images as string[]
  campingimage: c.campingimage?.map(i => i.url) || [],

  // ✅ text lists as string[]
  campinginclusion: c.campinginclusion?.map(i => i.text) || [],
  campingexclusion: c.campingexclusion?.map(i => i.text) || [],
  campingactivity: c.campingactivity?.map(i => i.text) || [],

  // ✅ itinerary normalized
  campingitinerary: c.campingitinerary?.map(d => ({
    day: d.day,
    description: d.campingitinerarypoint?.map(p => p.text) || []
  })) || [{ day: "Day 1", description: [] }],

  advancePaymentAllowed: c.advancePaymentAllowed ?? false,
  advancePercent: c.advancePercent ?? "",

  // ✅ PRICING (Adult + Child)
  campingpricing: {
    Sunday:    { adultPrice: "", childPrice: "" },
    Monday:    { adultPrice: "", childPrice: "" },
    Tuesday:   { adultPrice: "", childPrice: "" },
    Wednesday: { adultPrice: "", childPrice: "" },
    Thursday:  { adultPrice: "", childPrice: "" },
    Friday:    { adultPrice: "", childPrice: "" },
    Saturday:  { adultPrice: "", childPrice: "" }
  }
});
 if (c.campingpricing?.length) {
  setCamp(prev => {
    const pricing = { ...prev.campingpricing };

    c.campingpricing.forEach(p => {
      pricing[p.day] = {
        adultPrice: p.adultPrice ?? "",
        childPrice: p.childPrice ?? ""
      };
    });

    return { ...prev, campingpricing: pricing };
  });
}

      } catch (err) {
        setError("Failed to load camping details");
      }
    };

    loadCamp();
  }, [id]);

 


  if (!camp) return <div className="p-10">Loading...</div>;

  // UPDATE CAMPING
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `/api/campings/${id}`,
        {
          ...camp,
          advancePaymentAllowed: camp.advancePaymentAllowed,
    advancePercent: camp.advancePaymentAllowed
      ? Number(camp.advancePercent)
      : null,

    campingpricing: Object.fromEntries(
      Object.entries(camp.campingpricing).map(([day, v]) => [
        day,
        {
          adultPrice: v.adultPrice === "" ? null : Number(v.adultPrice),
          childPrice: v.childPrice === "" ? null : Number(v.childPrice)
        }
      ])
    )
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Camping Package Updated Successfully!");
      nav("/admin/camping");
    } catch (err) {
      console.error(err);
      setError("Failed to update camping details");
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="font-heading text-3xl text-palmGreen mb-6 text-center">
          Edit Camping Package
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BASIC INFO */}
          <input
            className="w-full p-3 border rounded"
            value={camp.name}
            onChange={(e) => setCamp({ ...camp, name: e.target.value })}
            placeholder="Camping Name"
          />

          <input
            className="w-full p-3 border rounded"
            value={camp.location}
            onChange={(e) => setCamp({ ...camp, location: e.target.value })}
            placeholder="Location"
          />

          <input
            type="number"
            className="w-full p-3 border rounded"
            value={camp.defaultPrice}
            onChange={(e) =>
              setCamp({ ...camp, defaultPrice: Number(e.target.value) })
            }
            placeholder="Default Price"
          />

          <textarea
            className="w-full p-3 border rounded h-32"
            value={camp.description}
            onChange={(e) =>
              setCamp({ ...camp, description: e.target.value })
            }
            placeholder="Description"
          />

         {/* CAMPING IMAGES */}
<div>
  <label className="font-medium">Camping Images</label>

  <input
    type="file"
    multiple
    accept="image/*"
    onChange={async (e) => {
      const files = [...e.target.files];
      const uploaded = [];

      for (let f of files) {
        const fd = new FormData();
        fd.append("image", f);

        const res = await axios.post(
          "http://localhost:5000/api/upload",
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        uploaded.push(res.data.url);
      }

      setCamp(prev => ({
        ...prev,
        campingimage: [...prev.campingimage, ...uploaded]
      }));
    }}
  />

  <div className="grid grid-cols-3 gap-3 mt-3">
    {camp.campingimage.map((url, i) => (
      <div key={i} className="relative">
        <img
          src={url}
          className="h-24 w-full object-cover rounded"
        />
        <button
          type="button"
          className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
          onClick={() =>
            setCamp(prev => ({
              ...prev,
              campingimage: prev.campingimage.filter((_, idx) => idx !== i)
            }))
          }
        >
          ✕
        </button>
      </div>
    ))}
  </div>
</div>


          {/* POINT LISTS */}
          <PointList title="Inclusions" points={camp.campinginclusion}
            setPoints={(v) => setCamp({ ...camp, campinginclusion: v })} />

          <PointList title="Exclusions" points={camp.campingexclusion}
            setPoints={(v) => setCamp({ ...camp, campingexclusion: v })} />
          <PointList title="Activities" points={camp.campingactivity}
            setPoints={(v) => setCamp({ ...camp, campingactivity: v })} />

          {/* ITINERARY */}
          <div className="border p-4 rounded">
            <h2 className="font-heading text-xl mb-3">Camping Itinerary</h2>

            {camp.campingitinerary.map((day, index) => (
              <div key={index} className="mb-4 border rounded p-3">
                <h3 className="font-semibold">{day.day}</h3>

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

          {/* DAY-WISE PRICING */}
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
<div className="border p-4 rounded">
  <h2 className="font-heading text-xl mb-3">Advance Payment</h2>

  <label className="flex items-center gap-2">
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
    Enable Advance Payment
  </label>

  {camp.advancePaymentAllowed && (
    <input
      type="number"
      min="1"
      max="100"
      placeholder="Advance % (e.g. 30)"
      className="mt-3 w-full p-2 border rounded"
      value={camp.advancePercent}
      onChange={(e) =>
        setCamp({
          ...camp,
          advancePercent: e.target.value
        })
      }
    />
  )}
</div>



          <button type="submit" className="w-full bg-palmGreen text-white py-3 rounded">
            Update Camping
          </button>
        </form>
      </div>
    </div>
  );
}
