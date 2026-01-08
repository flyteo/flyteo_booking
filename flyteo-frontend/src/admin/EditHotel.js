import { useEffect, useState } from "react";
import api from "../axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function EditHotel() {
  const { id } = useParams();
  const nav = useNavigate();

 const [amenityList, setAmenityList] = useState([]);

  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState({
    type: "",
    acType: "",
    price: "",
    maxPersons: "",
    totalRooms: "",
    roomimage: [] 
  });

useEffect(() => {
  api.get("/hotels/amenities")
    .then(res => setAmenityList(res.data));
}, []);

  const [error, setError] = useState("");
const [offerList, setOfferList] = useState([]);
useEffect(() => {
  api.get("/search/activeoffers").then((res) => setOfferList(res.data));
}, []);
const [couponList, setCouponList] = useState([]);
useEffect(() => {
  api.get("/search/activecoupons").then((res) => setCouponList(res.data));
}, []);

  // 🔥 Load hotel data
  useEffect(() => {
    const loadHotel = async () => {
      const token = localStorage.getItem("token");

      const res = await api.get(
        `/hotels/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHotel({
  ...res.data,

  // ✅ convert relations to ID arrays
  hotelamenity: res.data.hotelamenity?.map(a => a.amenityId) || [],
  hoteloffer: res.data.hoteloffer?.map(o => o.offerId) || [],
  hotelcoupon: res.data.hotelcoupon?.map(c => c.couponId) || [],
   advancePaymentAllowed: res.data.advancePaymentAllowed ?? false,
  advancePercent: res.data.advancePercent ?? "",

  // ✅ normalize images
 hotelimage: res.data.hotelimage?.map(img => img.url) || [],

  // ✅ rooms stay as-is (backend recreates them)
  room: res.data.room?.map(r => ({
    ...r,
    roomimage: r.roomimage?.map(img => img.url) || []
  })) || [],

  hotelpolicy: res.data.hotelpolicy || {
    checkIn: "",
    checkOut: "",
    cancellationPolicy: "",
    childPolicy: "",
    petPolicy: "",
    coupleFriendly: false
  },

  hotelsafety: res.data.hotelsafety || {
    sanitizedRooms: false,
    staffVaccinated: false,
    fireSafety: false,
    cctv: false,
    contactlessCheckin: false
  },

  hotelrule: res.data.hotelrule || {
    smokingAllowed: false,
    alcoholAllowed: false,
    visitorsAllowed: false,
    loudMusicAllowed: false
  }
});
    };

    loadHotel();
  }, [id]);

  if (!hotel) return <div className="p-10">Loading...</div>;

  // 🔥 Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/hotels/${id}`,
       {
    name: hotel.name,
    location: hotel.location,
    description: hotel.description,
    address: hotel.address,
    phone: hotel.phone,
    email: hotel.email,
    mapLocation: hotel.mapLocation,
    nearby: hotel.nearby,
    discount: hotel.discount,
    taxes: hotel.taxes,
    advancePaymentAllowed: hotel.advancePaymentAllowed,
    advancePercent: hotel.advancePaymentAllowed
      ? Number(hotel.advancePercent)
      : null,

    hotelamenity: hotel.hotelamenity, // [Int]
    hoteloffer: hotel.hoteloffer,       // [Int]
    hotelcoupon: hotel.hotelcoupon,     // [Int]

room: hotel.room.map(
  ({ id, hotelId, roomimage, ...rest }) => ({
    ...rest,
    roomimage: roomimage?.map(url => ({ url })) || []
  })
),

    hotelimage: hotel.hotelimage,

    hotelpolicy: hotel.hotelpolicy,
    hotelsafety: hotel.hotelsafety,
    hotelrule: hotel.hotelrule
  },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Hotel Updated Successfully!");
      nav("/admin/hotels");
    } catch (err) {
      setError("Update failed. Check all fields.");
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="font-heading text-3xl text-palmGreen mb-6 text-center">
          Edit Hotel
        </h1>

        {error && <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hotel Name */}
          <div>
            <label className="font-medium">Hotel Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded"
              value={hotel.name}
              onChange={(e) => setHotel({ ...hotel, name: e.target.value })}
            />
          </div>

          {/* Contacts */}
          <div>
            <label className="font-medium">Phone Number</label>
            <input
              type="text"
              className="w-full p-3 border rounded"
              value={hotel.phone}
              onChange={(e) => setHotel({ ...hotel, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="font-medium">Hotel Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded"
              value={hotel.email}
              onChange={(e) => setHotel({ ...hotel, email: e.target.value })}
            />
          </div>

          <div>
            <label className="font-medium">Address</label>
            <textarea
              className="w-full p-3 border rounded"
              value={hotel.address}
              onChange={(e) => setHotel({ ...hotel, address: e.target.value })}
            ></textarea>
          </div>

          {/* Location & Nearby */}
          <div>
            <label className="font-medium">Location</label>
            <input
              type="text"
              className="w-full p-3 border rounded"
              value={hotel.location}
              onChange={(e) => setHotel({ ...hotel, location: e.target.value })}
            />
          </div>

          <div>
            <label className="font-medium">Google Map URL</label>
            <input
              type="text"
              className="w-full p-3 border rounded"
              value={hotel.mapLocation}
              onChange={(e) =>
                setHotel({ ...hotel, mapLocation: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-medium">Nearby Location</label>
            <input
              type="text"
              placeholder="7.2 km from Navi Mumbai Airport"
              className="w-full p-3 border rounded"
              value={hotel.nearby}
              onChange={(e) =>
                setHotel({ ...hotel, nearby: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-medium">Taxes on Hotel</label>
            <input
              type="number"
              placeholder="taxes of all rooms are same "
              className="w-full p-3 border rounded"
              value={hotel.taxes}
              onChange={(e) =>
                setHotel({ ...hotel, taxes: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-medium">Discount</label>
            <input
              type="number"
              placeholder="10 % discount on all rooms enter 10"
              className="w-full p-3 border rounded"
              value={hotel.discount}
              onChange={(e) =>
                setHotel({ ...hotel, discount: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-medium">Description</label>
            <textarea
              className="w-full p-3 border rounded h-32"
              value={hotel.description}
              onChange={(e) =>
                setHotel({ ...hotel, description: e.target.value })
              }
            ></textarea>
          </div>
<div className="border p-4 rounded">
  <h2 className="font-heading text-xl mb-3">Hotel Policies</h2>

  {/* Check-in */}
  <label>Check-in Time</label>
  <input
    type="text"
    className="w-full p-2 border"
    value={hotel.hotelpolicy.checkIn}
    onChange={(e) =>
      setHotel({
        ...hotel,
        hotelpolicy: {
          ...hotel.hotelpolicy,
          checkIn: e.target.value,
        },
      })
    }
  />

  {/* Check-out */}
  <label>Check-out Time</label>
  <input
    type="text"
    className="w-full p-2 border"
    value={hotel.hotelpolicy.checkOut}
    onChange={(e) =>
      setHotel({
        ...hotel,
        hotelpolicy: {
          ...hotel.hotelpolicy,
          checkOut: e.target.value,
        },
      })
    }
  />

  {/* Cancellation */}
  <label>Cancellation Policy</label>
  <textarea
    className="w-full p-2 border"
    value={hotel.hotelpolicy.cancellationPolicy}
    onChange={(e) =>
      setHotel({
        ...hotel,
        hotelpolicy: {
          ...hotel.hotelpolicy,
          cancellationPolicy: e.target.value,
        },
      })
    }
  />

  {/* Child Policy */}
  <label>Child Policy</label>
  <textarea
    className="w-full p-2 border"
    value={hotel.hotelpolicy.childPolicy}
    onChange={(e) =>
      setHotel({
        ...hotel,
        hotelpolicy: {
          ...hotel.hotelpolicy,
          childPolicy: e.target.value,
        },
      })
    }
  />

  {/* Pet Policy */}
  <label>Pet Policy</label>
  <textarea
    className="w-full p-2 border"
    value={hotel.hotelpolicy.petPolicy}
    onChange={(e) =>
      setHotel({
        ...hotel,
        hotelpolicy: {
          ...hotel.hotelpolicy,
          petPolicy: e.target.value,
        },
      })
    }
  />

  {/* Couple Friendly */}
  <label className="flex items-center gap-2 mt-2">
    <input
      type="checkbox"
      checked={hotel.hotelpolicy.coupleFriendly}
      onChange={(e) =>
        setHotel({
          ...hotel,
          hotelpolicy: {
            ...hotel.hotelpolicy,
            coupleFriendly: e.target.checked,
          },
        })
      }
    />
    Couple Friendly
  </label>
</div>
<div className="border p-4 rounded">
  <h2 className="font-heading text-xl mb-3">Safety & Hygiene</h2>

  {["sanitizedRooms", "staffVaccinated", "fireSafety", "cctv", "contactlessCheckin"].map((key) => (
    <label key={key} className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={hotel.hotelsafety[key]}
        onChange={(e) =>
          setHotel({
            ...hotel,
            hotelsafety: {
              ...hotel.hotelsafety,
              [key]: e.target.checked,
            },
          })
        }
      />
      {key.replace(/([A-Z])/g, " $1")}
    </label>
  ))}
</div>
<div className="border p-4 rounded">
  <h2 className="font-heading text-xl mb-3">Hotel Rules</h2>

  {["smokingAllowed", "alcoholAllowed", "visitorsAllowed", "loudMusicAllowed"].map((key) => (
    <label key={key} className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={hotel.hotelrule[key]}
        onChange={(e) =>
          setHotel({
            ...hotel,
            hotelrule: {
              ...hotel.hotelrule,
              [key]: e.target.checked,
            },
          })
        }
      />
      {key.replace(/([A-Z])/g, " $1")}
    </label>
  ))}
</div>
<div className="border p-4 rounded">
  <h2 className="font-heading text-xl mb-3">Select Offers</h2>

  {offerList.map((o) => (
    <label key={o.id} className="flex gap-2">
      <input
        type="checkbox"
        checked={hotel.hoteloffer?.includes(o.id)}
        onChange={(e) => {
          if (e.target.checked) {
            setHotel({ ...hotel, hoteloffer: [...hotel.hoteloffer, o.id] });
          } else {
            setHotel({ ...hotel, hoteloffer: hotel.hoteloffer.filter((id) => id !== o.id) });
          }
        }}
      />
      {o.title} ({o.discountPercent}%)
    </label>
  ))}
</div>
<div className="border p-4 rounded">
  <h2 className="font-heading text-xl mb-3">Select Coupons</h2>

  {couponList.map((c) => (
    <label key={c.id} className="flex gap-2">
      <input
        type="checkbox"
        checked={hotel.hotelcoupon?.includes(c.id)}
        onChange={(e) => {
          if (e.target.checked) {
            setHotel({ ...hotel, hotelcoupon: [...hotel.hotelcoupon, c.id] });
          } else {
            setHotel({ ...hotel, hotelcoupon: hotel.hotelcoupon.filter((id) => id !== c.id) });
          }
        }}
      />
      {c.code} — {c.discountType === "percent" ? `${c.amount}%` : `₹${c.amount}`}
    </label>
  ))}
</div>

          {/* Amenities */}
          <div>
            <label className="font-medium">Amenities</label>
            <div className="grid grid-cols-2 gap-2 border p-3 rounded">
              {amenityList.map((a) => (
      <label key={a.id} className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={hotel.hotelamenity.includes(a.id)}
          onChange={(e) => {
            setHotel({
              ...hotel,
              hotelamenity: e.target.checked
                ? [...hotel.hotelamenity, a.id]
                : hotel.hotelamenity.filter(id => id !== a.id)
            });
          }}
        />
        {a.name}
      </label>
    ))}
            </div>
          </div>

        {/* HOTEL IMAGES */}
<div>
  <label className="font-medium">Hotel Images</label>

  {/* Upload */}
  <input
    type="file"
    accept="image/*"
    className="w-full mt-1"
    onChange={async (e) => {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);

      const res = await api.post(
        "/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setHotel(prev => ({
        ...prev,
        hotelimage: [...prev.hotelimage, res.data.url]
      }));
    }}
  />

  {/* Preview + Delete */}
  <div className="grid grid-cols-3 gap-4 mt-3">
    {hotel.hotelimage.map((url, i) => (
      <div key={i} className="relative">
        <img
          src={url}
          className="h-32 w-full object-cover rounded"
        />
        <button
          type="button"
          className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
          onClick={() =>
            setHotel(prev => ({
              ...prev,
              hotelimage: prev.hotelimage.filter((_, idx) => idx !== i)
            }))
          }
        >
          ✕
        </button>
      </div>
    ))}
  </div>
</div>


       
{/* Existing Room List */}
<div className="border rounded p-4">
  <h2 className="font-heading text-xl mb-4">Existing Room Types</h2>

  {hotel.room?.length === 0 && (
    <p className="text-gray-500">No rooms added yet.</p>
  )}

  {hotel.room?.map((r, index) => (
    <div key={index} className="bg-gray-50 p-4 rounded mb-4 border">

      <h3 className="font-heading text-lg mb-2">
        {r.type} ({r.acType})
      </h3>

      {/* ROOM TYPE */}
      <label>Room Type</label>
      <select
        className="w-full p-2 border rounded mb-2"
        value={r.type}
        onChange={(e) => {
          const updated = [...hotel.room];
          updated[index].type = e.target.value;
          setHotel({ ...hotel, room: updated });
        }}
      >
        <option value="Deluxe">Deluxe</option>
        <option value="Double Bed">Double Bed</option>
        <option value="Single Bed">Single Bed</option>
      </select>

      {/* AC TYPE */}
      <label>AC Type</label>
      <select
        className="w-full p-2 border rounded mb-2"
        value={r.acType}
        onChange={(e) => {
          const updated = [...hotel.room];
          updated[index].acType = e.target.value;
          setHotel({ ...hotel, room: updated });
        }}
      >
        <option value="AC">AC</option>
        <option value="Non-AC">Non-AC</option>
      </select>

      {/* PRICE */}
      <label>Price</label>
      <input
        type="number"
        className="w-full p-2 border rounded mb-2"
        value={Number(r.price)}
        onChange={(e) => {
          const updated = [...hotel.room];
          updated[index].price = e.target.value;
          setHotel({ ...hotel, room: updated });
        }}
      />

      {/* MAX PERSONS */}
      <label>Max Persons</label>
      <input
        type="number"
        className="w-full p-2 border rounded mb-2"
        value={r.maxPersons}
        onChange={(e) => {
          const updated = [...hotel.room];
          updated[index].maxPersons = e.target.value;
          setHotel({ ...hotel, room: updated });
        }}
      />

      {/* TOTAL ROOMS */}
      <label>Total Rooms</label>
      <input
        type="number"
        className="w-full p-2 border rounded mb-3"
        value={r.totalRooms}
        onChange={(e) => {
          const updated = [...hotel.room];
          updated[index].totalRooms = e.target.value;
          setHotel({ ...hotel, room: updated });
        }}
      />
       {/* ROOM IMAGES */}
      <label className="font-medium">Room Images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        className="w-full mb-2"
        onChange={async (e) => {
          const files = [...e.target.files];
          const urls = [];

          for (let file of files) {
            const fd = new FormData();
            fd.append("image", file);

            const res = await api.post(
              "/upload",
              fd,
              { headers: { "Content-Type": "multipart/form-data" } }
            );

            urls.push(res.data.url);
          }

          const updated = [...hotel.room];
          updated[index].roomimage = [
            ...(updated[index].roomimage || []),
            ...urls
          ];
          setHotel({ ...hotel, room: updated });
        }}
      />

      {/* ROOM IMAGE PREVIEW */}
      <div className="grid grid-cols-3 gap-3 mt-2">
        {r.roomimage?.map((url, imgIndex) => (
          <div key={imgIndex} className="relative">
            <img
              src={url}
              className="h-24 w-full object-cover rounded"
              alt="room"
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
              onClick={() => {
                const updated = [...hotel.room];
                updated[index].roomimage = updated[index].roomimage.filter(
                  (_, i) => i !== imgIndex
                );
                setHotel({ ...hotel, room: updated });
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Delete Button */}
      <button
        type="button"
        className="mt-10 bg-red-600 text-white px-4 py-2 rounded"
        onClick={() => {
          const updated = hotel.room.filter((_, i) => i !== index);
          setHotel({ ...hotel, room: updated });
        }}
      >
        Delete Room Type
      </button>

    </div>
  ))}
</div>
          {/* Rooms Section */}
          <div className="p-4 border rounded">
            <h2 className="font-heading text-xl mb-3">Add Room Type</h2>

            <label>Room Type</label>
            <select
              className="w-full p-3 border rounded"
              value={room.type}
              onChange={(e) => setRoom({ ...room, type: e.target.value })}
            >
              <option>Deluxe</option>
              <option>Double Bed</option>
              <option>Single Bed</option>
            </select>

            <label>AC Type</label>
            <select
              className="w-full p-3 border rounded"
              value={room.acType}
              onChange={(e) => setRoom({ ...room, acType: e.target.value })}
            >
              <option>AC</option>
              <option>Non-AC</option>
            </select>

            <label>Price</label>
            <input
              type="number"
              className="w-full p-3 border rounded"
              value={room.price}
              onChange={(e) =>
                setRoom({ ...room, price: e.target.value })
              }
            />

            <label>Person Limit</label>
            <input
              type="number"
              className="w-full p-3 border rounded"
              value={room.maxPersons}
              onChange={(e) =>
                setRoom({ ...room, maxPersons: e.target.value })
              }
            />

            <label>Total Rooms</label>
            <input
              type="number"
              className="w-full p-3 border rounded"
              value={room.totalRooms}
              onChange={(e) =>
                setRoom({ ...room, totalRooms: e.target.value })
              }
            />
            <div>
              <label className="font-medium">Upload Room Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
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
            
                setRoom(prev => ({
                  ...prev,
                  roomimage: urls   // ✅ STORED IN ROOM
                }));
              }}
            />
            
            
            
              {room.roomimage?.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-2">
                {room.roomimage.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="h-24 w-full object-cover rounded"
                  />
                ))}
              </div>
            )}
            </div>

            <button
              type="button"
              className="mt-3 bg-palmGreen text-white px-4 py-2 rounded"
              onClick={() => {
                setHotel({
                  ...hotel,
                  room: [...hotel.room, room]
                });
                setRoom({
                  type: "",
                  acType: "",
                  price: "",
                  maxPersons: "",
                  totalRooms: "",
                  roomimage:[]
                });
              }}
            >
              + Add Room
            </button>
          </div>
          <div className="border p-4 rounded">
  <h2 className="font-heading text-xl mb-3">Advance Payment</h2>

  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={hotel.advancePaymentAllowed}
      onChange={(e) =>
        setHotel({
          ...hotel,
          advancePaymentAllowed: e.target.checked,
          advancePercent: e.target.checked ? hotel.advancePercent : ""
        })
      }
    />
    Enable Advance Payment
  </label>

  {hotel.advancePaymentAllowed && (
    <input
      type="number"
      min="1"
      max="100"
      placeholder="Advance % (e.g. 30)"
      className="mt-3 w-full p-2 border rounded"
      value={hotel.advancePercent}
      onChange={(e) =>
        setHotel({
          ...hotel,
          advancePercent: e.target.value
        })
      }
    />
  )}
</div>

          {/* Submit */}
          <button className="w-full bg-palmGreen text-white py-3 rounded text-lg">
            Update Hotel
          </button>
        </form>
      </div>
    </div>
  );
}
