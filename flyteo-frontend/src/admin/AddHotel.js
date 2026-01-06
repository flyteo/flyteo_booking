import { useState ,useEffect} from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AddHotel() {
  const nav = useNavigate();

  const [hotel, setHotel] = useState({
     name: "",
  location: "",
  description: "",
  phone: "",
  email: "",
  address: "",
  hotelamenity: [],
  hotelimage: [],
  room: [],     // ⭐ FIXED
  mapLocation: "",
  adminEmail: "",
  adminPassword: "",
   // ⭐ NEW FIELDS
  hotelType: "",
  starCategory: "",
  advancePaymentAllowed: false,
  advancePercent: "",
  
 hotelpolicy: {
  checkIn: "",
  checkOut: "",
  cancellationPolicy: "",
  childPolicy: "",
  petPolicy: "",
  coupleFriendly: false,
},

hotelsafety: {
  sanitizedRooms: false,
  staffVaccinated: false,
  fireSafety: false,
  cctv: false,
  contactlessCheckin: false,
},

hotelrule: {
  smokingAllowed: false,
  alcoholAllowed: false,
  visitorsAllowed: false,
  loudMusicAllowed: false
},

hoteloffer: [],
  hotelcoupon: [],

  ratingAverage: "",
  ratingCount: ""
  });


  const [rooms, setRooms] = useState({
  type: "",
  acType: "",
  price: "",
  maxPersons: "",
  totalRooms: "",
  roomimage: [] 
});

const [offerList, setOfferList] = useState([]);
const [couponList, setCouponList] = useState([]);


const [amenityList, setAmenityList] = useState([]);


useEffect(() => {
  loadOfferList();
  loadCouponList();
}, []);

const loadOfferList = async () => {
  const res = await axios.get("/api/search/activeoffers");
  setOfferList(res.data);
};

const loadCouponList = async () => {
  const res = await axios.get("/api/search/activecoupons");
  setCouponList(res.data);
};


useEffect(() => {
  axios.get("/api/hotels/amenities")
    .then(res => setAmenityList(res.data));
}, []);


  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

    await axios.post(
  "/api/hotels",
  {
    name: hotel.name,
    location: hotel.location,
    description: hotel.description,
    phone: hotel.phone,
    email: hotel.email,
    address: hotel.address,
    mapLocation: hotel.mapLocation,
    nearby: hotel.nearby,
    hotelamenity: hotel.hotelamenity,
    taxes: Number(hotel.taxes || 0),
    // ADMIN
    adminEmail: hotel.adminEmail,
    adminPassword: hotel.adminPassword,
    advancePaymentAllowed: Boolean(hotel.advancePaymentAllowed),
    advancePercent: hotel.advancePaymentAllowed
      ? Number(hotel.advancePercent)
      : null,

    // OPTIONAL
    hotelType: hotel.hotelType,
   starCategory: hotel.starCategory ? Number(hotel.starCategory) : null,
   discount: Number(hotel.discount || 0),

  room: hotel.room
  ?.filter(r => r.type && r.acType && r.price)
  .map(r => ({
    type: r.type,
    acType: r.acType,
    price: Number(r.price),
    maxPersons: Number(r.maxPersons),
    totalRooms: Number(r.totalRooms),
     roomimage: r.roomimage  
  })) || [],

    // OPTIONAL RELATIONS (SAFE)
    hotelimage: hotel.hotelimage,  
    // rooms: hotel.rooms || [],

   hotelpolicy: hotel.hotelpolicy || null,
    hotelsafety: hotel.hotelsafety || null,
    hotelrule: hotel.hotelrule || null,

    hotelhighlight: hotel.hotelhighlight || [],
    hoteloffer: hotel.hoteloffer || [],
    hotelcoupon: hotel.hotelcoupon || []
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

      alert("Hotel Added Successfully!");
      nav("/admin/hotels");
    } catch (err) {
      setError("Failed to add hotel. Check your input or permissions.");
    }
  };

  return (
    <div className="flex">
        <AdminSidebar/>
    
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
        
      <h1 className="font-heading text-3xl text-palmGreen mb-6 text-center">
        Add New Hotel
      </h1>

      {error && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Hotel Name */}
        <div>
          <label className="font-medium">Hotel Name</label>
          <input
            type="text"
            required
            className="w-full p-3 mt-1 border rounded"
            value={hotel.name}
            onChange={(e) => setHotel({ ...hotel, name: e.target.value })}
          />
        </div>
        <div>
  <label className="font-medium">Hotel Type</label>
  <select
    className="w-full p-3 border rounded"
    value={hotel.hotelType}
    onChange={(e) => setHotel({ ...hotel, hotelType: e.target.value })}
  >
    <option>-- Select Hotel Type --</option>
    <option>Hotel</option>
    <option>Resort</option>
    <option>Villa</option>
    <option>Hostel</option>
    <option>Apartment</option>
  </select>
</div>

<div>
  <label className="font-medium">Star Category</label>
  <select
    className="w-full p-3 border rounded"
    value={hotel.starCategory}
    onChange={(e) => setHotel({ ...hotel, starCategory: e.target.value })}
  >
    <option>-- Select Rating --</option>
    <option>1</option>
    <option>2</option>
    <option>3</option>
    <option>4</option>
    <option>5</option>
  </select>
</div>
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
  />
</div>


        {/* Location */}
        <div>
          <label className="font-medium">Location</label>
          <input
            type="text"
            placeholder="Mumbai"
            required
            className="w-full p-3 mt-1 border rounded"
            value={hotel.location}
            onChange={(e) => setHotel({ ...hotel, location: e.target.value })}
          />
        </div>

        <div>
  <label className="font-medium">Nearby Location</label>
  <input
    type="text"
    placeholder="7.2 km from Navi Mumbai Airport"
    className="w-full p-3 border rounded"
    value={hotel.nearby}
    onChange={(e) => setHotel({ ...hotel, nearby: e.target.value })}
  />
</div>

        {/* Price */}
        <div className="p-4 border rounded">
  <h2 className="font-heading text-xl mb-3">Add Room Type</h2>

  <label>Room Type</label>
  <select className="w-full p-3 border rounded" value={rooms.type}
    onChange={(e) => setRooms({ ...rooms, type: e.target.value })}>
     <option>---Select Room Type---</option>   
    <option>Deluxe</option>
    <option>Double Bed</option>
    <option>Single Bed</option>
  </select>

  <label>AC Type</label>
  <select className="w-full p-3 border rounded" value={rooms.acType}
    onChange={(e) => setRooms({ ...rooms, acType: e.target.value })}>
        <option>---Select AC Type---</option>
    <option>AC</option>
    <option>Non-AC</option>
  </select>

  <label>Price</label>
  <input type="number" className="w-full p-3 border rounded" value={rooms.price}
    onChange={(e) => setRooms({ ...rooms, price: e.target.value })} />

  <label>Person Limit</label>
  <input type="number" className="w-full p-3 border rounded" value={rooms.maxPersons}
    onChange={(e) => setRooms({ ...rooms, maxPersons: e.target.value })} />

  <label>Total Rooms</label>
  <input type="number" className="w-full p-3 border rounded" value={rooms.totalRooms}
    onChange={(e) => setRooms({ ...rooms, totalRooms: e.target.value })} />
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

      const res = await axios.post(
        "http://localhost:5000/api/upload",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      urls.push(res.data.url);
    }

    setRooms(prev => ({
      ...prev,
      roomimage: urls   // ✅ STORED IN ROOM
    }));
  }}
/>



  {rooms.roomimage?.length > 0 && (
  <div className="grid grid-cols-3 gap-4 mt-2">
    {rooms.roomimage.map((img, i) => (
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
    if (!rooms.type || !rooms.price) {
      alert("Room details missing");
      return;
    }

    setHotel(prev => ({
      ...prev,
      room: [...prev.room, rooms]   // ✅ room.images INCLUDED
    }));

    setRooms({
      type: "",
      acType: "",
      price: "",
      maxPersons: "",
      totalRooms: "",
      roomimage: []     // reset
    });
  }}
>
  + Add Room
</button>

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
  <label className="flex items-center gap-2">
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

<div>
  <label className="font-medium">Hotel Highlights</label>
  <input
    type="text"
    className="w-full p-3 border rounded"
    placeholder="Comma separated (Example: Sea View, Near Airport)"
    onChange={(e) => setHotel({ ...hotel, hotelhighlight: e.target.value.split(",") })}
  />
</div>
<div className="border p-4 rounded">
  <h2 className="font-heading text-xl mb-3">Safety & Hygiene</h2>

  {["sanitizedRooms", "staffVaccinated", "fireSafety", "cctv", "contactlessCheckin"]
    .map((key) => (
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

  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={hotel.hotelrule.smokingAllowed}
      onChange={(e) =>
        setHotel({
          ...hotel,
          hotelrule: {
            ...hotel.hotelrule,
            smokingAllowed: e.target.checked,
          },
        })
      }
    />
    Smoking Allowed
  </label>

  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={hotel.hotelrule.visitorsAllowed}
      onChange={(e) =>
        setHotel({
          ...hotel,
          hotelrule: {
            ...hotel.hotelrule,
            visitorsAllowed: e.target.checked,
          },
        })
      }
    />
    Visitors Allowed
  </label>

  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={hotel.hotelrule.alcoholAllowed}
      onChange={(e) =>
        setHotel({
          ...hotel,
          hotelrule: {
            ...hotel.hotelrule,
            alcoholAllowed: e.target.checked,
          },
        })
      }
    />
    Alcohol Allowed
  </label>

  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={hotel.hotelrule.loudMusicAllowed}
      onChange={(e) =>
        setHotel({
          ...hotel,
          hotelrule: {
            ...hotel.hotelrule,
            loudMusicAllowed: e.target.checked,
          },
        })
      }
    />
    Loud Music Allowed
  </label>
</div>


<div>
  <label className="font-medium">Taxes of Hotel</label>
  <input
    type="number"
    className="w-full p-3 border rounded"
    value={hotel.taxes || ""}
    onChange={(e) => setHotel({ ...hotel, taxes: e.target.value })}
    placeholder="Example: 10"
  />
</div>
 {/* Discount Section */}
<div>
  <label className="font-medium">Flat Discount (%)</label>
  <input
    type="number"
    className="w-full p-3 border rounded"
    value={hotel.discount || ""}
    onChange={(e) => setHotel({ ...hotel, discount: e.target.value })}
    placeholder="Example: 10"
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
      checked={hotel.hoteloffer.includes(o.id)}
      onChange={(e) => {
        setHotel({
          ...hotel,
          hoteloffer: e.target.checked
            ? [...hotel.hoteloffer, o.id]
            : hotel.hoteloffer.filter(id => id !== o.id),
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
      checked={hotel.hotelcoupon.includes(c.id)}
      onChange={(e) => {
        setHotel({
          ...hotel,
          hotelcoupon: e.target.checked
            ? [...hotel.hotelcoupon, c.id]
            : hotel.hotelcoupon.filter(id => id !== c.id),
        });
      }}
    />
    {c.code} — {c.discountType === "percent" ? `${c.amount}%` : `₹${c.amount}`}
  </label>
))}


</div>


<div>
  <label className="font-medium">Google Map Location URL</label>
  <input
    type="text"
    className="w-full p-3 border rounded"
    value={hotel.mapLocation}
    onChange={(e) => setHotel({ ...hotel, mapLocation: e.target.value })}
  />
</div>
        {/* Description */}
        <div>
          <label className="font-medium">Description</label>
          <textarea
            
            className="w-full p-3 mt-1 border rounded h-32"
            value={hotel.description}
            onChange={(e) =>
              setHotel({ ...hotel, description: e.target.value })
            }
          ></textarea>
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
            setHotel(prev => ({
              ...prev,
              hotelamenity: e.target.checked
                ? [...prev.hotelamenity, a.id]
                : prev.hotelamenity.filter(id => id !== a.id)
            }));
          }}
        />
        {a.name}
      </label>
    ))}

  </div>
</div>


        {/* Images */}
      
<div>
  <label className="font-medium">Upload Images</label>
  <input
  type="file"
  multiple
  accept="image/*"
  onChange={async (e) => {
    const urls = [];

    for (let file of e.target.files) {
      const fd = new FormData();
      fd.append("image", file);

      const res = await axios.post(
        "http://localhost:5000/api/upload",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      urls.push(res.data.url);
    }

    setHotel(prev => ({
      ...prev,
      hotelimage: urls
    }));
  }}
/>

  {hotel.hotelimage && (
  <div className="mt-4 grid grid-cols-3 gap-4">
    {/* {hotel.images.split(",").map((img, i) => (
      <img
        key={i}
        src={img.trim()}
        className="w-full h-32 object-cover rounded"
        alt="preview"
      />
    ))} */}
  </div>
)}

</div>

<div>
  <label className="font-medium">Hotel Admin Email</label>
  <input type="email" className="w-full p-3 border rounded"
    onChange={(e) => setHotel({ ...hotel, adminEmail: e.target.value })}/>
</div>

<div>
  <label className="font-medium">Hotel Admin Password</label>
  <input type="password" className="w-full p-3 border rounded"
    onChange={(e) => setHotel({ ...hotel, adminPassword: e.target.value })}/>
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
      checked={hotel.advancePaymentAllowed}
      onChange={(e) =>
        setHotel({
          ...hotel,
          advancePaymentAllowed: e.target.checked,
          advancePercent: e.target.checked ? hotel.advancePercent : ""
        })
      }
    />
    <span className="font-medium">
      Allow Advance Payment
    </span>
  </label>

  {/* Percentage */}
  {hotel.advancePaymentAllowed && (
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
        value={hotel.advancePercent}
        onChange={(e) =>
          setHotel({
            ...hotel,
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



        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-palmGreen text-white py-3 rounded text-lg"
        >
          Add Hotel
        </button>
      </form>
    </div>
    </div>
  );
}
