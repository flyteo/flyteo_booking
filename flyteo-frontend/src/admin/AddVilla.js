import { useState , useEffect} from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AddVilla() {
  const nav = useNavigate();

  const [villa, setVilla] = useState({
    name: "",
    description: "",
    location: "",
    address: "",
    mapLocation: "",
    discount:"",
    advancePaymentAllowed: false,
    advancePercent: "",

    maxGuests: "",
    includedGuests: "",
    basePrice: "",
    extraGuestPrice: "",

    checkInTime: "",
    checkOutTime: "",
    cancellationPolicy: "",
    securityDeposit: "",

    images: [],
    villaoffer:[],
    villacoupon:[],
    villaamenity:[],
    layout: {
      bedrooms: "",
      bathrooms: "",
      beds: "",
      livingRoom: true,
      kitchen: true,
      privatePool: false,
      garden: false,
      parkingSlots: ""
    }
  });

  const [amenityList, setAmenityList] = useState([]);
  const [offerList, setOfferList] = useState([]);
  const [couponList, setCouponList] = useState([]);

  useEffect(() => {
    loadOfferList();
    loadCouponList();
  }, []);

  const loadOfferList = async () => {
    const res = await api.get("/search/activeoffers");
    setOfferList(res.data);
  };
  
  const loadCouponList = async () => {
    const res = await api.get("/search/activecoupons");
    setCouponList(res.data);
  };
  
  
  useEffect(() => {
    api.get("/hotels/amenities")
      .then(res => setAmenityList(res.data));
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await api.post(
      "/villas",
      villa,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Villa added successfully");
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
        <h1 className="text-3xl font-bold mb-6 text-palmGreen">
          Add Villa
        </h1>

        {/* BASIC INFO */}
        <input className="w-full p-3 mt-1 border rounded" placeholder="Villa Name"
          value={villa.name}
          onChange={e => setVilla({ ...villa, name: e.target.value })}
        />

        <textarea className="w-full p-3 mt-1 border rounded" placeholder="Description"
          value={villa.description}
          onChange={e => setVilla({ ...villa, description: e.target.value })}
        />

        <input className="w-full p-3 mt-1 border rounded" placeholder="Location"
          value={villa.location}
          onChange={e => setVilla({ ...villa, location: e.target.value })}
        />

        <input className="w-full p-3 mt-1 border rounded" placeholder="Address"
          value={villa.address}
          onChange={e => setVilla({ ...villa, address: e.target.value })}
        />

        {/* PRICING */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="w-full p-3 mt-1 border rounded" type="number" placeholder="Max Guests"
            value={villa.maxGuests}
            onChange={e => setVilla({ ...villa, maxGuests: e.target.value })}
          />
          <input className="w-full p-3 mt-1 border rounded" type="number" placeholder="Included Guests"
            value={villa.includedGuests}
            onChange={e => setVilla({ ...villa, includedGuests: e.target.value })}
          />
          <input className="w-full p-3 mt-1 border rounded" type="number" placeholder="Base Price / Night"
            value={villa.basePrice}
            onChange={e => setVilla({ ...villa, basePrice: e.target.value })}
          />
          <input className="w-full p-3 mt-1 border rounded" type="number" placeholder="Extra Guest Price"
            value={villa.extraGuestPrice}
            onChange={e => setVilla({ ...villa, extraGuestPrice: e.target.value })}
          />
          <input
          placeholder="Enter url of google map location"
    type="text"
    className="w-full p-3 border rounded"
    value={villa.mapLocation}
    onChange={(e) => setVilla({ ...villa, mapLocation: e.target.value })}
  />
        </div>

        {/* IMAGES */}
        <div className="mt-6">
          <label className="font-semibold">Villa Images</label>
          <input
            type="file"
             multiple
            accept="image/*"
            className="block mt-2"
           onChange={async (e) => {
    const urls = [];

    for (let file of e.target.files) {
      const fd = new FormData();
      fd.append("image", file);

      const res = await api.post(
        "/upload",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      urls.push(res.data.url);
    }

    setVilla(prev => ({
      ...prev,
      images: urls   // ✅ STORED IN VILLA
    }));
  }}
          />

          <div className="grid grid-cols-4 gap-3 mt-3">
            {villa.images.map((img, i) => (
              <img key={i} src={img} className="h-24 object-cover rounded" />
            ))}
          </div>
        </div>
<div>
  {/* <label className="font-medium">Flat Discount (%)</label> */}
  <input
    type="number"
    className="w-full p-3 border rounded"
    value={villa.discount || ""}
    onChange={(e) => setVilla({ ...villa, discount: e.target.value })}
    placeholder="Enter Discount (Example: 10 for 10%)"
  />
</div>
{/* SELECT OFFERS */}
<div className="border p-4 rounded mt-6">
  <h2 className="font-heading text-xl mb-3">Apply Offers</h2>

  {offerList.length === 0 && (
    <p className="text-gray-500 text-sm">No active offers found.</p>
  )}

 {offerList.map((o) => (
  <label key={o.id} className="flex gap-2 mt-1">
    <input
      type="checkbox"
      checked={villa.villaoffer.includes(o.id)}
      onChange={(e) => {
        setVilla({
          ...villa,
          villaoffer: e.target.checked
            ? [...villa.villaoffer, o.id]
            : villa.villaoffer.filter(id => id !== o.id),
        });
      }}
    />
    {o.title} ({o.discountPercent}%)
  </label>
))}

</div>

   {/* Coupon SEction */}
{/* SELECT COUPONS */}
<div className="border p-4 rounded mt-6">
  <h2 className="font-heading text-xl mb-3">Apply Coupons</h2>

  {couponList.length === 0 && (
    <p className="text-gray-500 text-sm">No active coupons found.</p>
  )}

 {couponList.map((c) => (
  <label key={c.id} className="flex gap-2 mt-1">
    <input
      type="checkbox"
      checked={villa.villacoupon.includes(c.id)}
      onChange={(e) => {
        setVilla({
          ...villa,
          villacoupon: e.target.checked
            ? [...villa.villacoupon, c.id]
            : villa.villacoupon.filter(id => id !== c.id),
        });
      }}
    />
    {c.code} — {c.discountType === "percent" ? `${c.amount}%` : `₹${c.amount}`}
  </label>
))}

</div>
           
        {/* LAYOUT */}
        <h2 className="text-xl font-bold mt-8">Layout Details</h2>

        <div className="grid grid-cols-3 gap-4 mt-3">
          <input className="w-full p-3 mt-1 border rounded" type="number" placeholder="Bedrooms"
            value={villa.layout.bedrooms}
            onChange={e => setVilla({
              ...villa,
              layout: { ...villa.layout, bedrooms: e.target.value }
            })}
          />
          <input className="w-full p-3 mt-1 border rounded" type="number" placeholder="Bathrooms"
            value={villa.layout.bathrooms}
            onChange={e => setVilla({
              ...villa,
              layout: { ...villa.layout, bathrooms: e.target.value }
            })}
          />
          <input className="w-full p-3 mt-1 border rounded" type="number" placeholder="Beds"
            value={villa.layout.beds}
            onChange={e => setVilla({
              ...villa,
              layout: { ...villa.layout, beds: e.target.value }
            })}
          />
          <input
  type="number"
  className="w-full p-3 mt-1 border rounded"
  placeholder="Parking Slots"
  value={villa.layout.parkingSlots}
  onChange={e =>
    setVilla({
      ...villa,
      layout: { ...villa.layout, parkingSlots: e.target.value }
    })
  }
/>
          <div className="grid grid-cols-2 gap-6 mt-4">
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={villa.layout.livingRoom}
      onChange={e =>
        setVilla({
          ...villa,
          layout: { ...villa.layout, livingRoom: e.target.checked }
        })
      }
    />
    Living Room
  </label>

  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={villa.layout.kitchen}
      onChange={e =>
        setVilla({
          ...villa,
          layout: { ...villa.layout, kitchen: e.target.checked }
        })
      }
    />
    Kitchen
  </label>

  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={villa.layout.privatePool}
      onChange={e =>
        setVilla({
          ...villa,
          layout: { ...villa.layout, privatePool: e.target.checked }
        })
      }
    />
    Private Pool
  </label>

  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={villa.layout.garden}
      onChange={e =>
        setVilla({
          ...villa,
          layout: { ...villa.layout, garden: e.target.checked }
        })
      }
    />
    Garden
  </label>
</div>

{/* PARKING */}

        </div>

          <div>
  <label className="font-medium">Amenities</label>
  <div className="grid grid-cols-2 gap-2 border p-3 rounded">
 {amenityList.map((a) => (
      <label key={a.id} className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={villa.villaamenity.includes(a.id)}
          onChange={(e) => {
            setVilla(prev => ({
              ...prev,
              villaamenity: e.target.checked
                ? [...prev.villaamenity, a.id]
                : prev.villaamenity.filter(id => id !== a.id)
            }));
          }}
        />
        {a.name}
      </label>
    ))}

  </div>
</div>
{/* POLICIES */}
<h2 className="text-xl font-bold mt-8">Policies</h2>

<input
  className="w-full p-3 mt-1 border rounded"
  placeholder="Check-in Time (e.g. 2:00 PM)"
  value={villa.checkInTime}
  onChange={e => setVilla({ ...villa, checkInTime: e.target.value })}
/>

<input
  className="w-full p-3 mt-1 border rounded"
  placeholder="Check-out Time (e.g. 11:00 AM)"
  value={villa.checkOutTime}
  onChange={e => setVilla({ ...villa, checkOutTime: e.target.value })}
/>

<textarea
  className="w-full p-3 mt-1 border rounded"
  placeholder="Cancellation Policy"
  value={villa.cancellationPolicy}
  onChange={e =>
    setVilla({ ...villa, cancellationPolicy: e.target.value })
  }
/>

<input
  type="number"
  className="w-full p-3 mt-1 border rounded"
  placeholder="Security Deposit (optional)"
  value={villa.securityDeposit}
  onChange={e =>
    setVilla({ ...villa, securityDeposit: e.target.value })
  }
/>
{/* ADVANCE PAYMENT SETTINGS */}
<div className="border p-4 rounded">
  <h2 className="font-heading text-xl mb-3">
    Advance Payment Settings
  </h2>

  {/* Toggle */}
  <label className="flex items-center gap-3">
    <input
      type="checkbox"
      checked={villa.advancePaymentAllowed}
      onChange={(e) =>
        setVilla({
          ...villa,
          advancePaymentAllowed: e.target.checked,
          advancePercent: e.target.checked ? villa.advancePercent : ""
        })
      }
    />
    <span className="font-medium">
      Allow Advance Payment
    </span>
  </label>

  {/* Percentage */}
  {villa.advancePaymentAllowed && (
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
        value={villa.advancePercent}
        onChange={(e) =>
          setVilla({
            ...villa,
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

        <button className="mt-8 bg-palmGreen text-white px-6 py-3 rounded">
          Save Villa
        </button>
      </form>
      </div>
    </div>
  );
}
