import { useEffect, useState ,useMemo,useRef} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../axios";
import {load} from "@cashfreepayments/cashfree-js";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";



export default function Booking() {
  const cashfreeRef = useRef(null);

useEffect(() => {
  load({ mode: "production" }).then(cf => {
    cashfreeRef.current = cf;
  });
}, []);

  const nav = useNavigate();
  const query = new URLSearchParams(useLocation().search);
 const [couponCode, setCouponCode] = useState("");
const [appliedCoupon, setAppliedCoupon] = useState(null);
const [couponMessage, setCouponMessage] = useState("");
const [paymentChoice,setPaymentChoice] = useState("full");
const [meals,setMeals] = useState([]);

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
const [openCalendar, setOpenCalendar] = useState(false);

  // Params from URL
  const hotelId = query.get("hotelId");
  const campingId = query.get("campingId");
  const selectedRoomId = query.get("roomId");
 const [date, setDate] = useState(query.get("date") ? new Date(query.get("date")) : null);
const [adults, setAdults] = useState(Number(query.get("adults")) || 1);
const [children, setChildren] = useState(Number(query.get("children")) || 0);
const [roomCount,setRoomCount] = useState(Number(query.get("rooms")) || 1)
const [orderId,setOrderId] = useState(null);

  // const selectedRoomType = query.get("roomType");
  // const selectedAcType = query.get("acType");
  // const selectedRoomPrice = Number(query.get("price"));

  const [item, setItem] = useState(null);
 

  // Dates & guests
  const [checkIn, setCheckIn] = useState(query.get("checkIn") ? new Date(query.get("checkIn")) : null);
const [checkOut, setCheckOut] = useState(query.get("checkOut") ? new Date(query.get("checkOut")) : null);

const today = new Date();
  const [guests, setGuests] = useState(Number(query.get("guests")) || 1);
  // const [bookingperson, setBookingperson] = useState([]);
  const [total, setTotal] = useState(0);

  const villaId = query.get("villaId");

const villaCheckIn = query.get("checkIn") || "";
const villaCheckOut = query.get("checkOut") || "";
const villaAdults = Number(query.get("adults")) || 1;
const villaChildren = Number(query.get("children")) || 0;
const villaPriceFromUrl = Number(query.get("price")) || 0;

const getDayWiseRoomPrice = ({
  roomBasePrice,
  checkIn,
  dayWisePricing = [],
  hotelDiscount = 0
}) => {
  let price = roomBasePrice;

  if (checkIn) {
    const dayName = new Date(checkIn)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    const rule = dayWisePricing.find(d => d.day === dayName);

    if (rule) {
      price = price - (price * rule.percentage) / 100;
    }
  }

  // Hotel discount AFTER day-wise
  if (hotelDiscount > 0) {
    price = price - (price * hotelDiscount) / 100;
  }

  return Math.round(price);
};

const [type] = useState(
  hotelId ? "hotel" : campingId ? "camping" : "villa"
);


  // Load hotel or camping details
  useEffect(() => {
    if (type === "hotel") {
      api.get(`/hotels/${hotelId}`)
        .then((res) => setItem(res.data));
    } else if (type === "camping") {
      api.get(`/campings/${campingId}`)
        .then((res) => setItem(res.data));
    }
    else if(type === "villa") {
    api.get(`/villas/${villaId}`)
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
  if (
    !item ||
    !selectedRoom ||
    !checkIn ||
    !checkOut ||
    type !== "hotel"
  ) return;

  const sd = new Date(checkIn);
  const ed = new Date(checkOut);

  const nights = Math.ceil(
    (ed.getTime() - sd.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (nights <= 0) return;

  // 🔹 Day-wise + hotel discount price PER NIGHT
  const pricePerNight = getDayWiseRoomPrice({
    roomBasePrice: selectedRoom?.price,
    checkIn,
    dayWisePricing: item.day_wise_percentage,
    hotelDiscount: item.discount
  });

  // 🔹 Room total
  const roomTotal = pricePerNight * nights * roomCount;

  // 🔹 Taxes
  const taxAmount = item.taxes || 0;

  const base = roomTotal + taxAmount;

  // 🔹 BEST ACTIVE OFFER
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

  const final = Math.max(base - offerDiscount, 0);

  setPrice({
    base,
    hotelDiscount: 0, // already applied in pricePerNight
    offerDiscount,
    couponDiscount: 0,
    final
  });

  setAppliedCoupon(null);
  setCouponMessage("");

}, [
  item,
  selectedRoom,
  checkIn,
  checkOut,
  roomCount,
  type
]);


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

  const taxtotal = total + item.taxes;

  setPrice({
    base: total,
    adultPrice:priceRow.adultPrice,
    childPrice:priceRow.childPrice,
    hotelDiscount: 0,
    offerDiscount: 0,
    couponDiscount: 0,
    final: taxtotal
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

  const taxesVilla = item.taxes;

  const baseTotal = baseVillaPrice + extraGuestCost + taxesVilla;

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

useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  params.set("checkIn", checkIn);
  params.set("checkOut", checkOut);
  params.set("rooms", roomCount);
  params.set("roomId", selectedRoom?.id || "");

  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${params.toString()}`
  );
}, [checkIn, checkOut, roomCount, selectedRoom]);


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
  paymentChoice === "advance"
    ? Math.round((price.final * advancePercent) / 100)
    : price.final;

const remainingAmount =
  advancePercent
    ? price.final - payNowAmount
    : 0;

useEffect(()=>{
  if(!item?.advancePaymentAllowed){
    setPaymentChoice("full");
  }
},[item]);
  // Submit booking

  // const getSessionId= async()=>{
  //   try {
  //     let res= await api.post("/payment/create-order");
  //     if(res.data && res.data.payment_session_id){
  //       console.log(res.data)
  //       setOrderId(res.data.order_id);
  //       return res.data.payment_session_id;
  //     }
      
  //   } catch (error) {
      
  //   }
  // }


//   const handleBooking = async () => {
//   try {
//     const token = localStorage.getItem("token");

//      let payload = {};
//     //  let sessionId = await getSessionId();
//     //  let checkoutOptions = {
//     //   paymentSessionId:sessionId,
//     //   redirectTarget:"_modal"
//     //  }

//     //  cashfree.checkout(checkoutOptions).then((res)=>{
//     //   console.log("payment Initiated");
//     //  })

//     if (type === "hotel") {
//       payload = {
//         type: "hotel",
//         hotel: hotelId,
//         camping: null,
//         roomType: selectedRoom?.type,
//         acType: selectedRoom?.acType,
//         checkIn,
//         checkOut,
//         guests,
//         fullname,
//         mobileno,
//         remainingAmount,
//         roomCount:roomCount,
//         totalAmount: price.final,
//         paymentChoice
//       };
//     }

//     if (type === "camping") {
//       payload = {
//         type: "camping",
//         hotel: null,
//         camping: campingId,
//         roomType: null,
//         acType: null,
//         checkIn:date,
//         checkOut: null,
//         guests: adults + children,
//         fullname,
//         mobileno,
//         remainingAmount,
//       totalAmount: price.final,
//       paymentChoice
//       };
//     }

//     if (type === "villa") {
//       payload = {
//         type: "villa",
//         hotel: null,
//         camping: null,
//         villa: villaId,
//         roomType: null,
//         acType: null,
//         checkIn,
//         checkOut,
//         guests: totalGuestsVilla,
//         fullname,
//         mobileno,
//         remainingAmount,
//        totalAmount: price.final,
//        paymentChoice
//       };
//     }

// if (!fullname || !mobileno) {
//   alert("Please enter full name and mobile number");
//   return;
// }
// const res1 = await api.post(
//       "/payment/create-order",
//       payload,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     const cashfree = new window.Cashfree();
//     cashfree.checkout({
//       paymentSessionId: res1.data.payment_session_id,
//       redirectTarget: "_self"
//     });
//     const res = await api.post(
//       "/bookings",
//       payload,
//       {
//         headers: { Authorization: `Bearer ${token}` }
//       }
//     );

//     const bookingId = res.data.id;
    

// //     nav(
// //   `/payment?bookingId=${bookingId}` +
// //   `&total=${price.final}` +
// //   `&payNow=${payNowAmount}` +
// //   `&remaining=${remainingAmount}`
// // );

//   } catch (err) {
//     alert(err.response?.data?.msg || "Error creating booking");
//     // nav("/login");
//   }
// };

const handleBooking = async () => {
  try {
     let payload;
  
   
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
        remainingAmount,
        roomCount:roomCount,
        totalAmount: price.final,
        paymentChoice
      };
    }

    if (type === "camping") {
      payload = {
        type: "camping",
        hotel: null,
        camping: campingId,
        roomType: null,
        acType: null,
        meals,
        checkIn:date,
        checkOut: null,
        guests: adults + children,
        fullname,
        mobileno,
        remainingAmount,
      totalAmount: price.final,
      paymentChoice
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
        remainingAmount,
       totalAmount: price.final,
       paymentChoice
      };
    }
    if (!fullname || !mobileno) {
      alert("Enter name & mobile");
      return;
    }


    const res = await api.post(
      "/payment/create-order",
        payload
    );

    if (!res.data.payment_session_id) {
      alert("Failed to initialize payment");
      return;
    }
    cashfreeRef.current.checkout({
      paymentSessionId: res.data.payment_session_id,
      redirectTarget: "_self"
    });

  } catch (err) {
  console.error("FULL ERROR:", err);
  if (err.response?.status === 401) {
  nav("/login");
  return;
}

  alert(err.response?.data?.msg || err.message || "Payment failed");

}

};

const todaydate = new Date().toISOString().split("T")[0];

const Row = ({ label, value, bold }) => (
  <div className={`flex justify-between ${bold ? "font-bold text-lg text-palmGreen" : ""}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

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
        <option
  key={r.id}
  value={r.id}
  disabled={r.availableRooms <= 0}
>
  {r.type} — ₹{r.price}
  {r.availableRooms <= 0 ? " (Sold Out)" : ""}
</option>

      ))}
    </select>
  </div>
)}

      <div className="mt-6 space-y-4">
{type === "hotel" && (
  <div className="relative">
    <label className="font-medium text-gray-700">Stay Dates</label>

    {/* Display box */}
    <div
      onClick={() => setOpenCalendar(true)}
      className="w-full mt-2 p-3 border rounded-xl cursor-pointer bg-white shadow-sm hover:border-orange-400 transition"
    >
      {checkIn
        ? `${checkIn.toLocaleDateString()} → ${checkOut ? checkOut.toLocaleDateString() : "Select check-out"}`
        : "Select stay dates"}
    </div>

    {/* Calendar popup */}
    {openCalendar && (
      <div className="absolute z-50 mt-2 bg-white p-4 rounded-xl shadow-xl">
        <DayPicker
          mode="range"
          selected={{ from: checkIn, to: checkOut }}
          onSelect={(range) => {
            setCheckIn(range?.from || null);
            setCheckOut(range?.to || null);
          }}
          disabled={{ before: today }}
        />

        <button
          onClick={() => setOpenCalendar(false)}
          className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg"
        >
          Done
        </button>
      </div>
    )}
  </div>
)}
        {type === "villa" && (
  <div className="relative">
    <label className="font-medium text-gray-700">Stay Dates</label>

    <div
      onClick={() => setOpenCalendar(true)}
      className="w-full mt-2 p-3 border rounded-xl cursor-pointer bg-white shadow-sm hover:border-orange-400 transition"
    >
      {checkIn
        ? `${checkIn.toLocaleDateString()} → ${checkOut ? checkOut.toLocaleDateString() : "Select check-out"}`
        : "Select stay dates"}
    </div>

    {openCalendar && (
      <div className="absolute z-50 mt-2 bg-white p-4 rounded-xl shadow-xl">
        <DayPicker
          mode="range"
          selected={{ from: checkIn, to: checkOut }}
          onSelect={(range) => {
            setCheckIn(range?.from || null);
            setCheckOut(range?.to || null);
          }}
          disabled={{ before: today }}
        />

        <button
          onClick={() => setOpenCalendar(false)}
          className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg"
        >
          Done
        </button>
      </div>
    )}
  </div>
)}
{type === "camping" && (
  <div className="relative">
    <label className="font-medium text-gray-700">Select Date</label>

    <div
      onClick={() => setOpenCalendar(true)}
      className="w-full mt-2 p-3 border rounded-xl cursor-pointer bg-white shadow-sm hover:border-orange-400 transition"
    >
      {date ? date.toLocaleDateString() : "Select date"}
    </div>

    {openCalendar && (
      <div className="absolute z-50 mt-2 bg-white p-4 rounded-xl shadow-xl">
        <DayPicker
          mode="single"
          selected={date}
          onSelect={(d) => {
            setDate(d);
            setOpenCalendar(false);
          }}
          disabled={{ before: today }}
        />
      </div>
    )}
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
    <div className="mt-4">
  <label className="font-medium">Select Meals</label>

  <div className="space-y-2 mt-2">

    {["veg", "non-veg", "jain"].map(option => (
      <label key={option} className="flex items-center gap-2">
        <input
          type="checkbox"
          value={option}
          checked={meals.includes(option)}
          onChange={(e) => {
            if (e.target.checked) {
              setMeals([...meals, option]);
            } else {
              setMeals(meals.filter(m => m !== option));
            }
          }}
        />
        {option.toUpperCase()}
      </label>
    ))}

  </div>
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
  maxLength={10}
  inputMode="numeric"
  pattern="[0-9]{10}"
  onChange={(e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "");
    if (onlyDigits.length <= 10) {
      setMobileno(onlyDigits);
    }
  }}
/>

</div>

{/* PERSON DETAILS (CAMPING ONLY) */}

{item?.advancePaymentAllowed && (
  <div className="mt-4">
    <p className="font-semibold mb-2">Payment Option</p>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="payment"
        value="full"
        checked={paymentChoice === "full"}
        onChange={() => setPaymentChoice("full")}
      />
      Pay Full Amount (₹{price.final})
    </label>

    <label className="flex items-center gap-2 mt-2">
      <input
        type="radio"
        name="payment"
        value="advance"
        checked={paymentChoice === "advance"}
        onChange={() => setPaymentChoice("advance")}
      />
      Pay Advance ({item.advancePercent}% – ₹
      {Math.round((price.final * item.advancePercent) / 100)})
    </label>
  </div>
)}


        {/* Total */}
      <div className="bg-sand p-4 rounded border">
        {type === "hotel" && (
   <div className="flex justify-between">
  <span>
    ₹{getDayWiseRoomPrice({
      roomBasePrice: selectedRoom?.price,
      checkIn,
      dayWisePricing: item?.day_wise_percentage,
      hotelDiscount: item?.discount
    })} × {roomCount} room + ₹{item?.taxes}
  </span>
  <span>₹{price.base}</span>
</div>
)}

  {price.hotelDiscount > 0 && (
    <div className="flex justify-between text-green-700">
      <span>Discount</span>
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
      <span>Taxes</span>
      <span>₹{item.taxes}</span>
    </div>
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
<div className="flex justify-between font-bold text-lg text-palmGreen">
      <span>Taxes</span>
      <span>₹{item.taxes}</span>
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
    <div className="bg-sand p-3 rounded mt-4">
  <Row label="Total Amount" value={`₹${price.final}`} />

  {paymentChoice === "advance" && (
    <>
      <Row
        label="Advance Paid"
        value={`₹${Math.round(
          (price.final * item.advancePercent) / 100
        )}`}
      />
      <Row
        label="Remaining at Property"
        value={`₹${
          price.final -
          Math.round((price.final * item.advancePercent) / 100)
        }`}
      />
    </>
  )}
</div>

  </div>
)}


        {/* Payment */}
       
<button
  onClick={handleBooking}
  className="w-full bg-rusticBrown text-white py-3 rounded text-lg"
>
 {advancePercent ? (
    paymentChoice === "advance" ? (
      `Pay ₹${payNowAmount} (Advance)`
    ) : (
      `Pay ₹${price.final} (Full Payment)`
    )
  ) : (
    `Pay ₹${price.final}`
  )}
</button>

      </div>
    </div>
  );
}
