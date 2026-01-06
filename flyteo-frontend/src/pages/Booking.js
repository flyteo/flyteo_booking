import { useEffect, useState ,useMemo} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../axios";


export default function Booking() {
  const nav = useNavigate();
  const query = new URLSearchParams(useLocation().search);
 const [couponCode, setCouponCode] = useState("");
const [appliedCoupon, setAppliedCoupon] = useState(null);
const [couponMessage, setCouponMessage] = useState("");

const [fullname, setFullname] = useState("");
const [mobileno, setMobileno] = useState("");

const [price, setPrice] = useState({
  base: 0,
  hotelDiscount: 0,
  offerDiscount: 0,
  couponDiscount: 0,
  final: 0
});

const [selectedRoom, setSelectedRoom] = useState(null);


  // Params from URL
  const hotelId = query.get("hotelId");
  const campingId = query.get("campingId");
  const selectedRoomId = query.get("roomId");
 const [date, setDate] = useState(query.get("date") || "");
const [adults, setAdults] = useState(Number(query.get("adults")) || 1);
const [children, setChildren] = useState(Number(query.get("children")) || 0);
const [roomCount,setRoomCount] = useState(Number(query.get("rooms")) || 1)


  // const selectedRoomType = query.get("roomType");
  // const selectedAcType = query.get("acType");
  // const selectedRoomPrice = Number(query.get("price"));

  const [item, setItem] = useState(null);
 

  // Dates & guests
  const [checkIn, setCheckIn] = useState(query.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(query.get("checkOut") || "");
  const [guests, setGuests] = useState(Number(query.get("guests")) || 1);
  // const [bookingperson, setBookingperson] = useState([]);
  const [total, setTotal] = useState(0);

  const villaId = query.get("villaId");

const villaCheckIn = query.get("checkIn") || "";
const villaCheckOut = query.get("checkOut") || "";
const villaAdults = Number(query.get("adults")) || 1;
const villaChildren = Number(query.get("children")) || 0;
const villaPriceFromUrl = Number(query.get("price")) || 0;


const [type] = useState(
  hotelId ? "hotel" : campingId ? "camping" : "villa"
);


  // Load hotel or camping details
  useEffect(() => {
    if (type === "hotel") {
      axios.get(`/hotels/${hotelId}`)
        .then((res) => setItem(res.data));
    } else if (type === "camping") {
      axios.get(`/campings/${campingId}`)
        .then((res) => setItem(res.data));
    }
    else if(type === "villa") {
    axios.get(`/villas/${villaId}`)
      .then(res => setItem(res.data));
  }
  }, []);

useEffect(() => {
  if (!item || !item.room) return;

  const roomFromUrl = item.room.find(
    r => r.id === Number(selectedRoomId)
  );

  setSelectedRoom(roomFromUrl || item.room[0]);
}, [item, selectedRoomId]);

  // Price calculation
 useEffect(() => {
  if (!item || !selectedRoom || !checkIn || !checkOut || type !== "hotel") return;

  const sd = new Date(checkIn);
  const ed = new Date(checkOut);
  const nights = Math.ceil(
    (ed.getTime() - sd.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (nights <= 0) return;
  const taxAmount = item.taxes || 0;
  const base = [(selectedRoom.price * nights * roomCount) + (taxAmount)];
 
  // 🟢 HOTEL DISCOUNT
  const hotelDiscount = item.discount
    ? Math.round((base * item.discount) / 100)
    : 0;

  // 🟢 BEST ACTIVE OFFER
  let offerDiscount = 0;
  const today = new Date();

  if (item.hoteloffer?.length > 0) {
    const activeOffers = item.hoteloffer
      .map(o => o.offer)
      .filter(o =>
        today >= new Date(o.validFrom) &&
        today <= new Date(o.validTo)
      );

    if (activeOffers.length > 0) {
      const best = activeOffers.sort(
        (a, b) => b.discountPercent - a.discountPercent
      )[0];

      offerDiscount = Math.round(
        (base * best.discountPercent) / 100
      );
    }
  }

  const final = Math.max(base - hotelDiscount - offerDiscount, 0);

  setPrice({
    base,
    adultPrice: 0,
    childPrice: 0,
    hotelDiscount,
    offerDiscount,
    couponDiscount: 0,
    final
  });

  setAppliedCoupon(null);
  setCouponMessage("");
}, [item,selectedRoom, checkIn, checkOut,roomCount]);

const applyCoupon = () => {
  if (!couponCode) return;

 const couponList =
  type === "hotel"
    ? item.hotelcoupon
    : type === "villa"
    ? item.villacoupon
    : [];

const couponObj = couponList
  ?.map(c => c.coupon)
  .find(c => c.code === couponCode.toUpperCase());

  if (!couponObj) {
    setCouponMessage("Invalid coupon");
    return;
  }

  const today = new Date();

  if (
    today < new Date(couponObj.validFrom) ||
    today > new Date(couponObj.validTo)
  ) {
    setCouponMessage("Coupon expired");
    return;
  }

  if (price.base < couponObj.minBookingAmount) {
    setCouponMessage(
      `Minimum booking ₹${couponObj.minBookingAmount}`
    );
    return;
  }

  let discount = 0;

  if (couponObj.discountType === "percent") {
    discount = Math.round((price.base * couponObj.amount) / 100);
  } else {
    discount = couponObj.amount;
  }

  const final = Math.max(price.final - discount, 0);

  setPrice(prev => ({
    ...prev,
    couponDiscount: discount,
    final
  }));

  setAppliedCoupon(couponObj);
  setCouponMessage("Coupon applied successfully ✅");
};

useEffect(() => {
  if (!item || type !== "camping" || !date) return;

  const dayName = new Date(date).toLocaleDateString("en-US", {
    weekday: "long"
  });

  const priceRow = item.campingpricing?.find(
    p => p.day === dayName
  );

  if (!priceRow) return;

  const adultTotal = adults * priceRow.adultPrice;
  const childTotal = children * priceRow.childPrice;
  const total = adultTotal + childTotal;

  setPrice({
    base: total,
    adultPrice:priceRow.adultPrice,
    childPrice:priceRow.childPrice,
    hotelDiscount: 0,
    offerDiscount: 0,
    couponDiscount: 0,
    final: total
  });
}, [item, type, date, adults, children]);

useEffect(() => {
  if (type !== "villa" || !item || !checkIn || !checkOut) return;

  const totalGuests = adults + children;

  const extraGuests = Math.max(
    totalGuests - item.includedGuests,
    0
  );
  

  const baseVillaPrice = item.basePrice * villaNights;
  const extraGuestCost =
    extraGuests * item.extraGuestPrice * villaNights;

  const baseTotal = baseVillaPrice + extraGuestCost;

  // 🟢 VILLA DISCOUNT
  const villaDiscount = item.discount
    ? Math.round((baseTotal * item.discount) / 100)
    : 0;

  // 🟢 BEST ACTIVE OFFER
  let offerDiscount = 0;
  const today = new Date();

  if (item.villaoffer?.length > 0) {
    const activeOffers = item.villaoffer
      .map(o => o.offer)
      .filter(o =>
        today >= new Date(o.validFrom) &&
        today <= new Date(o.validTo)
      );

    if (activeOffers.length > 0) {
      const bestOffer = activeOffers.sort(
        (a, b) => b.discountPercent - a.discountPercent
      )[0];

      offerDiscount = Math.round(
        (baseTotal * bestOffer.discountPercent) / 100
      );
    }
  }

  const final = Math.max(
    baseTotal - villaDiscount - offerDiscount,
    0
  );

  setPrice({
    base: baseTotal,
    hotelDiscount: villaDiscount,
    offerDiscount,
    couponDiscount: 0,
    final
  });

  setAppliedCoupon(null);
  setCouponMessage("");
}, [type, item, checkIn, checkOut, adults, children]);

const villaNights =
  checkIn && checkOut
    ? Math.max(
        Math.ceil(
          (new Date(checkOut) - new Date(checkIn)) /
            (1000 * 60 * 60 * 24)
        ),
        1
      )
    : 1;


const totalGuestsVilla = adults + children;

const extraGuests =
  type === "villa" && item
    ? Math.max(totalGuestsVilla - item.includedGuests, 0)
    : 0;



// const selectedRoom = useMemo(() => {
//   if (!item || !item.rooms || !selectedRoomId) return null;
//   return item.rooms.find(r => r.id === Number(selectedRoomId));
// }, [item, selectedRoomId]);

const maxAllowed = selectedRoom?.maxPersons || 1;


const advancePercent =
  item?.advancePaymentAllowed && item?.advancePercent
    ? item.advancePercent
    : null;

const payNowAmount =
  advancePercent
    ? Math.round((price.final * advancePercent) / 100)
    : price.final;

const remainingAmount =
  advancePercent
    ? price.final - payNowAmount
    : 0;


  // Submit booking
  const handleBooking = async () => {
  try {
    const token = localStorage.getItem("token");

     let payload = {};

    if (type === "hotel") {
      payload = {
        type: "hotel",
        hotel: hotelId,
        camping: null,
        roomType: selectedRoom?.type,
        acType: selectedRoom?.acType,
        checkIn,
        checkOut,
        guests,
        fullname,
        mobileno,
        roomCount:roomCount,
        totalAmount: price.final
      };
    }

    if (type === "camping") {
      payload = {
        type: "camping",
        hotel: null,
        camping: campingId,
        roomType: null,
        acType: null,
        checkIn,
        checkOut: null,
        guests: adults + children,
        fullname,
        mobileno,
      totalAmount: price.final
      };
    }

    if (type === "villa") {
      payload = {
        type: "villa",
        hotel: null,
        camping: null,
        villa: villaId,
        roomType: null,
        acType: null,
        checkIn,
        checkOut,
        guests: totalGuestsVilla,
        fullname,
        mobileno,
       totalAmount: price.final
      };
    }

if (!fullname || !mobileno) {
  alert("Please enter full name and mobile number");
  return;
}
    const res = await axios.post(
      "/bookings",
      payload,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const bookingId = res.data.id;

    nav(`/payment?bookingId=${bookingId}&amount=${price.final}`);
  } catch (err) {
    alert("Booking failed. Please login first.");
    nav("/login");
  }
};


  if (!item) return <div className="p-10 text-center">Loading…</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow mt-6">

      <h1 className="font-heading text-3xl text-palmGreen mb-4">
        {item.name}
      </h1>

      {/* COVER IMAGE */}
      {type==="hotel" && ( <img
        src={item.hotelimage?.[0].url || "/placeholder.jpg"}
        className="w-full h-56 md:h-64 object-cover rounded"
        alt=""
      />)}
      {type === 'camping' && (  <img
        src={item.campingimage?.[0].url || "/placeholder.jpg"}
        className="w-full h-56 md:h-64 object-cover rounded"
        alt=""
      />)}
    

      {/* ROOM DETAILS IF HOTEL */}
     {type === "hotel" && selectedRoom && (
  <div className="mt-4 bg-sand p-3 rounded">
    <p className="font-semibold">Selected Room:</p>

    <p>
      {selectedRoom.type} ({selectedRoom.acType})
    </p>

    <p className="text-palmGreen font-bold">
      ₹{selectedRoom.price + item.taxes}  / night
      (incl. taxes)
    </p>

    <p className="text-xs text-gray-600">
      Max {selectedRoom.maxPersons} guests
    </p>
    <div className="flex justify-between">
  <span>Rooms</span>
  <span>{roomCount}</span>
</div>

  </div>
)}

{type === "hotel" && item?.room?.length > 0 && (
  <div>
    <label className="font-medium">Change Room</label>

    <select
      className="w-full mt-1 p-3 border rounded"
      value={selectedRoom?.id || ""}
      onChange={(e) => {
        const room = item.room.find(
          r => r.id === Number(e.target.value)
        );
        setSelectedRoom(room);
        setGuests(1); // reset guests on room change
      }}
    >
      {item.room.map((r) => (
        <option key={r.id} value={r.id}>
          {r.type} ({r.acType}) – ₹{r.price}
        </option>
      ))}
    </select>
  </div>
)}

      <div className="mt-6 space-y-4">
{type === "hotel" && (
  <div>
        {/* Check-in */}
        <div>
          <label className="font-medium">Check-in Date</label>
          <input
            type="date"
            className="w-full mt-1 p-3 border rounded"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>

        {/* Check-out (hotels only) */}
          <div>
            <label className="font-medium">Check-out Date</label>
            <input
              type="date"
              className="w-full mt-1 p-3 border rounded"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          </div>
        )}
        {type === "villa" && (
  <>
    <div>
      <label className="font-medium">Check-in Date</label>
      <input
        type="date"
        className="w-full p-3 border rounded"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
      />
    </div>

    <div>
      <label className="font-medium">Check-out Date</label>
      <input
        type="date"
        className="w-full p-3 border rounded"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
      />
    </div>
  </>
)}
{type === "camping" && (
  <div>
    <label className="font-medium">Select Date</label>
    <input
      type="date"
      className="w-full p-3 border rounded"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />
  </div>
)}

        {/* Guests */}
        {type === "hotel" && selectedRoom && (
  <div>
    <label className="font-medium">
      Guests (Max {maxAllowed})
    </label>

    <input
      type="number"
      min="1"
      max={maxAllowed}
      className="w-full mt-1 p-3 border rounded"
      value={guests}
      onChange={(e) => {
        const val = Number(e.target.value);

        if (val > maxAllowed) {
          alert(`Maximum ${maxAllowed} guests allowed for this room`);
          return;
        }

        setGuests(val);
      }}
    />
  </div>
)}
{type === "camping" && (
  <>
    <div>
      <label className="font-medium">Adults</label>
      <input
        type="number"
        min="1"
        className="w-full p-3 border rounded"
        value={adults}
        onChange={(e) => setAdults(Number(e.target.value))}
      />
    </div>

    <div>
      <label className="font-medium">Children</label>
      <input
        type="number"
        min="0"
        className="w-full p-3 border rounded"
        value={children}
        onChange={(e) => setChildren(Number(e.target.value))}
      />
    </div>
  </>
)}
{type === "villa" && (
  <>
    <div>
      <label className="font-medium">Adults</label>
      <input
        type="number"
        min="1"
        className="w-full p-3 border rounded"
        value={adults}
        onChange={(e) => setAdults(Number(e.target.value))}
      />
    </div>

    <div>
      <label className="font-medium">Children</label>
      <input
        type="number"
        min="0"
        className="w-full p-3 border rounded"
        value={children}
        onChange={(e) => setChildren(Number(e.target.value))}
      />
    </div>
  </>
)}

        {/* Coupon Code */}
{type === "hotel" && (
  <div>
  <label className="font-medium">Apply Coupon</label>

  <div className="flex gap-2 mt-1">
    <input
      type="text"
      className="flex-1 p-3 border rounded"
      placeholder="ENTER CODE"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
    />

    <button
      type="button"
      onClick={applyCoupon}
      className="px-4 bg-palmGreen text-white rounded"
    >
      Apply
    </button>
  </div>

  {couponMessage && (
    <p className="text-sm mt-1 text-blue-700">{couponMessage}</p>
  )}
</div>
)}
{/* CONTACT DETAILS */}
<div className="mt-6 space-y-3">
  <h2 className="text-xl font-bold">Contact Details</h2>

  <input
    type="text"
    placeholder="Full Name"
    className="w-full p-3 border rounded"
    value={fullname}
    onChange={(e) => setFullname(e.target.value)}
  />

  <input
    type="tel"
    placeholder="Mobile Number"
    className="w-full p-3 border rounded"
    value={mobileno}
    onChange={(e) => setMobileno(e.target.value)}
  />
</div>

{/* PERSON DETAILS (CAMPING ONLY) */}



        {/* Total */}
      <div className="bg-sand p-4 rounded border">
        {type === "hotel" && (
   <div className="flex justify-between">
    <span>
      Base Price ({roomCount} room × {selectedRoom?.price } night + {item?.taxes})
    </span>
    <span>₹{price.base}</span>
  </div>)}

  {price.hotelDiscount > 0 && (
    <div className="flex justify-between text-green-700">
      <span>Hotel Discount</span>
      <span>-₹{price.hotelDiscount}</span>
    </div>
  )}

  {price.offerDiscount > 0 && (
    <div className="flex justify-between text-green-700">
      <span>Offer Discount</span>
      <span>-₹{price.offerDiscount}</span>
    </div>
  )}

  {price.couponDiscount > 0 && (
    <div className="flex justify-between text-green-700">
      <span>Coupon Discount</span>
      <span>-₹{price.couponDiscount}</span>
    </div>
  )}

  <hr className="my-2" />
{type === "hotel" && (
  <div className="flex justify-between font-bold text-lg text-palmGreen">
    <span>Total Payable</span>
    <span>₹{price.final}</span>
  </div>)}

  {type === "camping" && (
  <div className="bg-sand p-4 rounded border space-y-2">

    <p className="text-sm text-gray-600">
      Selected Date:{" "}
      <span className="font-semibold">
        {new Date(date).toDateString()}
      </span>
    </p>

    <div className="flex justify-between">
      <span>
        Adults ({adults} × ₹{price.adultPrice})
      </span>
      <span>₹{adults * price.adultPrice}</span>
    </div>

    <div className="flex justify-between">
      <span>
        Children ({children} × ₹{price.childPrice})
      </span>
      <span>₹{children * price.childPrice}</span>
    </div>

    <hr />

    <div className="flex justify-between font-bold text-lg text-palmGreen">
      <span>Total Payable</span>
      <span>₹{price.final}</span>
    </div>
  </div>
)}
</div>
{type === "villa" && item && (
  <div className="bg-sand p-4 rounded border space-y-2">

    <div className="flex justify-between">
      <span>Villa Price ({villaNights} nights)</span>
      <span>₹{item.basePrice * villaNights}</span>
    </div>

    <div className="flex justify-between">
      <span>Total Guests</span>
      <span>{adults + children}</span>
    </div>

    <div className="flex justify-between">
      <span>Included Guests</span>
      <span>{item.includedGuests}</span>
    </div>

    {extraGuests > 0 && (
      <div className="flex justify-between text-red-600">
        <span>
          Extra Guests ({extraGuests} × ₹{item.extraGuestPrice} × {villaNights})
        </span>
        <span>
          ₹{extraGuests * item.extraGuestPrice * villaNights}
        </span>
      </div>
    )}

    {price.hotelDiscount > 0 && (
      <div className="flex justify-between text-green-700">
        <span>Villa Discount</span>
        <span>-₹{price.hotelDiscount}</span>
      </div>
    )}

    {price.offerDiscount > 0 && (
      <div className="flex justify-between text-green-700">
        <span>Offer Discount</span>
        <span>-₹{price.offerDiscount}</span>
      </div>
    )}

    {price.couponDiscount > 0 && (
      <div className="flex justify-between text-green-700">
        <span>Coupon Discount</span>
        <span>-₹{price.couponDiscount}</span>
      </div>
    )}

    <hr />

    <div className="flex justify-between font-bold text-lg text-palmGreen">
      <span>Total Payable</span>
      <span>₹{price.final}</span>
    </div>
  </div>
)}
{/* ADVANCE PAYMENT INFO */}
{advancePercent && (
  <div className="bg-yellow-50 border border-yellow-300 p-4 rounded mb-4">
    <p className="font-semibold text-yellow-800">
      Advance Payment Required
    </p>

    <p className="text-sm text-gray-700 mt-1">
      Pay <b>{advancePercent}%</b> now to confirm your booking.
    </p>

    <div className="mt-2 space-y-1 text-sm">
      <div className="flex justify-between">
        <span>Total Amount</span>
        <span>₹{price.final}</span>
      </div>

      <div className="flex justify-between font-semibold text-palmGreen">
        <span>Pay Now</span>
        <span>₹{payNowAmount}</span>
      </div>

      <div className="flex justify-between text-gray-600">
        <span>Pay at Property</span>
        <span>₹{remainingAmount}</span>
      </div>
    </div>
  </div>
)}


        {/* Payment */}
       
<button
  onClick={handleBooking}
  className="w-full bg-rusticBrown text-white py-3 rounded text-lg"
>
  {advancePercent
    ? `Pay ₹${payNowAmount} to Confirm Booking`
    : `Pay ₹${price.final}`}
</button>

      </div>
    </div>
  );
}
