import api from "../axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import AddReviews from "./AddReviews";
import Reviews from "./Reviews";
import { calculateRoomPrice } from "../hooks/priceUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";

export default function HotelDetails() {
  const { id } = useParams();
  const nav = useNavigate();
const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nearbyHotels, setNearbyHotels] = useState([]);

  const [checking, setChecking] = useState(false);
const [availability, setAvailability] = useState(null);
const [availabilityMsg, setAvailabilityMsg] = useState("");
const [rooms, setRooms] = useState(1);



  const [bestOffer, setBestOffer] = useState(null);
const [countdown, setCountdown] = useState("");


  useEffect(() => {
    if (!id) return; // 🛑 important guard
  api.get(`/hotels/${id}`).then((res) => {
     
    const h = res.data;

    setHotel({
       id: h.id,
        name: h.name,
        slug: h.slug,
        location: h.location,
        description: h.description,
        address: h.address,
        email: h.email,
        phone: h.phone,
        mapLocation: h.mapLocation,
        nearby: h.nearby,
        hotelType: h.hotelType,
        starCategory: h.starCategory,
        discount: h.discount,
        taxes: h.taxes,
        dayWisePricing: h.day_wise_percentage || [],
      // normalize relations
      hotelimage: h.hotelimage?.map((i) => i.url) || [],
      room:
        h.room?.map((room) => ({
          ...room,
          roomimage: room.roomimage?.map((img) => ({
            id: img.id,
            url: img.url
          })) || []
        })) || [],
     hotelamenity: h.hotelamenity?.map(a => a.amenity.name) || [],
      hoteloffer: h.hoteloffer?.map((o) => o.offer) || [],
      hotelcoupon: h.hotelcoupon?.map((c) => c.coupon) || [],
      hotelhighlight: h.hotelhighlight?.map((x) => x.text) || [],

      hotelpolicy: h.hotelpolicy,
      hotelsafety: h.hotelsafety,
      hotelrule: h.hotelrule
    });
  });
}, [id]);

useEffect(() => {
  if (!hotel?.hoteloffer?.length) return;

  const today = new Date();

  const activeOffers = hotel.hoteloffer.filter((o) => {
    return (
      o.isActive &&
      today >= new Date(o.validFrom) &&
      today <= new Date(o.validTo)
    );
  });

  if (activeOffers.length > 0) {
    setBestOffer(
      activeOffers.reduce((a, b) =>
        a.discountPercent > b.discountPercent ? a : b
      )
    );
  }
}, [hotel]);

useEffect(() => {
  if (!bestOffer) return;

  const interval = setInterval(() => {
    const diff = new Date(bestOffer.validTo) - new Date();
    if (diff <= 0) return setCountdown("Expired");

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);

    setCountdown(`${d}d ${h}h ${m}m remaining`);
  }, 1000);

  return () => clearInterval(interval);
}, [bestOffer]);


  useEffect(() => {
    if (hotel?.room?.length > 0) {
      setSelectedRoom(hotel.room[0]);
    }
  }, [hotel]);

  useEffect(() => {
    if (!checkIn || !checkOut || !selectedRoom) return;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = (end - start) / (1000 * 60 * 60 * 24);
    setTotalPrice(nights > 0 ? nights * calculateRoomPrice({
        basePrice: selectedRoom?.price,
        checkIn,
        dayWisePricing: hotel.dayWisePricing,
        hotelDiscount: hotel.discount
      }) * rooms : 0);
  }, [checkIn, checkOut, selectedRoom]);

  const todayCheck = new Date().toISOString().split("T")[0];

const roomImages =
  hotel?.room?.flatMap(room =>
    room.roomimage?.map(img => ({
      ...img,
      roomType: room.type
    }))
  ) || [];

  useEffect(() => {
  if (!hotel) return;



  api
    .get("/hotels/recommend", {
      params: {
        hotelId: hotel.id,
        location: hotel.location,
        nearby: hotel.nearby,
        minPrice: selectedRoom?.price - 2000 || 0,
        maxPrice: selectedRoom?.price + 2000 || 999999
      }
    })
    .then(res => setNearbyHotels(res.data))
    .catch(console.error);
}, [hotel, selectedRoom]);

const [showPopup, setShowPopup] = useState(false);


const checkAvailability = async () => {
  
  // setShowPopup(true);

  const res = await api.post(
    "/check-availability/hotel-room",
    {
      hotelId: id,
      roomType: selectedRoom.type,
      acType: selectedRoom.acType,
      checkIn,
      checkOut,
      roomsRequested: rooms
    }
  );

  setAvailability(res.data.available);
  setAvailabilityMsg(
    res.data.available
      ? `✅ ${res.data.availableRooms} rooms available`
      : "❌ Sold Out - Try another date"
  );
};
const maxGuests =
  selectedRoom && rooms
    ? selectedRoom.maxPersons * rooms
    : 1;
useEffect(() => {
  if (guests > maxGuests) {
    setGuests(maxGuests);
  }
}, [rooms, selectedRoom]);



// const icons = {
//   "Free WiFi": "📶",
//   Parking: "🅿️",
//   Lift: "🛗",
//   TV: "📺"
// };

  if (!hotel)
    return <div className="p-10 text-center text-xl">Loading...</div>;

  return (
    <div className="w-full bg-gray-50">
      {/* HERO SECTION */}
     <div className="relative h-[55vh] md:h-[75vh]">
  <img
    src={hotel.hotelimage?.[0]}
    className="w-full h-full object-cover"
    alt={hotel.name}
  />

  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />

  {bestOffer && (
    <div className="absolute top-5 left-5 bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow">
      🔥 {bestOffer.discountPercent}% OFF
    </div>
  )}

  <div className="absolute bottom-6 left-6 right-6 text-white">
    <h1 className="text-3xl md:text-5xl font-heading">{hotel.name}</h1>

    <div className="flex flex-wrap gap-2 mt-3 text-sm">
      {hotel.hotelType && (
        <span className="bg-white/20 px-3 py-1 rounded-full">
          {hotel.hotelType}
        </span>
      )}
      {hotel.starCategory && (
        <span className="bg-yellow-400 text-black px-3 py-1 rounded-full">
          ⭐ {hotel.starCategory} Star
        </span>
      )}
      {hotel.ratingAverage > 0 && (
        <span className="bg-white text-black px-3 py-1 rounded-full">
          {hotel.ratingAverage} ★ ({hotel.ratingCount})
        </span>
      )}
    </div>
  </div>
</div>


      {/* MAIN CONTENT */}
     <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT CONTENT */}
        <div className="md:col-span-2 space-y-10">

          {/* ADDRESS */}
          <div className="text-gray-600">
  <p>{hotel.address}</p>
  {hotel.nearby && <p className="text-sm">{hotel.nearby}</p>}
  {hotel.mapLocation && (
    <a
      href={hotel.mapLocation}
      target="_blank"
      className="text-palmGreen underline text-sm"
    >
      View on Google Maps →
    </a>
  )}
</div>


         {/* ROOM IMAGES GALLERY */}
{roomImages.length > 0 && (
  <section>
    <h2 className="section-title">Room Gallery</h2>

    <Swiper
      modules={[Navigation, Thumbs]}
      navigation
      thumbs={{ swiper: thumbsSwiper }}
      className="rounded-xl overflow-hidden h-[50vh]"
    >
      {roomImages.map(img => (
        <SwiperSlide key={img.id}>
          <img src={img.url} className="w-full h-full object-cover" />
        </SwiperSlide>
      ))}
    </Swiper>

    <Swiper
      onSwiper={setThumbsSwiper}
      slidesPerView={5}
      spaceBetween={10}
      className="mt-3"
    >
      {roomImages.map(img => (
        <SwiperSlide key={img.id}>
          <img src={img.url} className="h-24 w-full object-cover rounded cursor-pointer" />
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
)}


          {/* HIGHLIGHTS */}
          {hotel.hotelhighlight?.length > 0 && (
  <section>
    <h2 className="section-title">Highlights</h2>
    <div className="flex flex-wrap gap-2">
      {hotel.hotelhighlight.map((h, i) => (
        <span key={i} className="px-4 py-2 bg-palmGreen text-white rounded-full text-sm">
          {h}
        </span>
      ))}
    </div>
  </section>
)}

          {/* DESCRIPTION */}
          <div>
            <h2 className="text-2xl font-bold mb-3">About this hotel</h2>
            <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
          </div>

          {/* AMENITIES */}
          
           
    {/* <h2 className="text-2xl font-bold mb-3">Amenities</h2> */}

  
  <section>
  <h2 className="section-title">Amenities</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
    {hotel.hotelamenity.map((a, i) => (
      <div key={i} className="bg-white border p-3 rounded text-sm">
        {a}
      </div>
    ))}
  </div>
</section>

<section>
  <h2 className="section-title">Safety & Hygiene</h2>
  <div className="grid gap-4 text-md">
    {hotel.hotelsafety?.sanitizedRooms && "✔ Sanitized Rooms"}
    {hotel.hotelsafety?.staffVaccinated && "✔ Vaccinated Staff"}
    {hotel.hotelsafety?.fireSafety && "✔ Fire Safety"}
    {hotel.hotelsafety?.cctv && "✔ CCTV"}
    {hotel.hotelsafety?.contactlessCheckin && "✔ Contactless Check-in"}
  </div>
</section>



          {/* ROOMS */}
       <section>
  <h2 className="section-title">Available Rooms</h2>

  <div className="space-y-4">
    {hotel.room.map(room => {
      const finalPrice = calculateRoomPrice({
        basePrice: room.price,
        checkIn,
        dayWisePricing: hotel.dayWisePricing,
        hotelDiscount: hotel.discount
      }) ;

      return (
        <div
          key={room.id}
          className="bg-white border rounded-xl p-5 flex justify-between items-center hover:shadow-lg transition"
        >
          <div>
            <h3 className="font-semibold text-lg">
              {room.type} ({room.acType})
            </h3>
            <p className="text-sm text-gray-500">
              Max {room.maxPersons} Guests
            </p>
          </div>

          <div className="text-right">
            {finalPrice !== room.price && (
              <p className="text-sm text-gray-400 line-through">
                ₹{room.price}
              </p>
            )}

            <p className="text-2xl font-bold text-palmGreen">
              ₹{finalPrice}
            </p>

            <p className="text-xs text-gray-500">per night</p>

          </div>
        </div>
      );
    })}
  </div>
</section>

          {/* POLICIES */}
         <div>
  <h2 className="text-2xl font-bold mb-3">Hotel Policies</h2>
  <ul className="text-gray-700 space-y-1">
   <li>Check-In: {hotel.hotelpolicy?.checkIn || "—"}</li>
    <li>Check-Out: {hotel.hotelpolicy?.checkOut}</li>
    <li>Cancellation: {hotel.hotelpolicy?.cancellationPolicy}</li>
    <li>Child Policy: {hotel.hotelpolicy?.childPolicy}</li>
    <li>Pet Policy: {hotel.hotelpolicy?.petPolicy}</li>
    <li>
      Couple Friendly: {hotel.hotelpolicy?.coupleFriendly ? "Yes" : "No"}
    </li>
  </ul>
</div>


          {/* RULES */}
          <div>
  <h2 className="text-2xl font-bold mb-3">Rules</h2>
  <ul className="text-gray-700 space-y-1">
    <li>
      Smoking {hotel.hotelrule?.smokingAllowed ? "Allowed" : "Not Allowed"}
    </li>
    <li>
      Visitors {hotel.hotelrule?.visitorsAllowed ? "Allowed" : "Not Allowed"}
    </li>
    <li>
      Alcohol {hotel.hotelrule?.alcoholAllowed ? "Allowed" : "Not Allowed"}
    </li>
    <li>
      Loud Music {hotel.hotelrule?.loudMusicAllowed ? "Allowed" : "Not Allowed"}
    </li>
  </ul>
</div>


          {/* PAYMENT OPTIONS */}
          {hotel.paymentOptions?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-3">Payment Options</h2>
              <div className="flex flex-wrap gap-2">
                {hotel.paymentOptions.map((p, i) => (
                  <span key={i} className="bg-white border px-3 py-1 rounded shadow text-sm">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

       {/* BOOKING SIDEBAR */}
<div>
  <div className="bg-white shadow p-6 rounded-xl sticky top-24">
     
    {/* ROOM PRICE */}
    <p className="text-3xl font-bold text-palmGreen">
  ₹{selectedRoom ? calculateRoomPrice({
        basePrice: selectedRoom?.price,
        checkIn,
        dayWisePricing: hotel.dayWisePricing,
        hotelDiscount: hotel.discount
      }): "—"}
  <span className="text-palmGreen-200 text-sm">
    {" "}+ ₹{hotel.taxes}
  </span>
  <span className="text-gray-500 text-sm">
    {" "}(excl. taxes) / night
  </span>
</p>


    {/* DATE SECTION */}
    <div className="space-y-4 mt-6">
  {/* ROOM SELECT */}
      <div>
        <label className="text-sm font-semibold">Select Room Type</label>
        <select
          className="w-full border p-2 rounded mt-1"
          value={selectedRoom?.id || ""}
          onChange={(e) => {
            const roomId = Number(e.target.value);
            const room = hotel.room.find((r) => r.id === roomId);
            setSelectedRoom(room);
            setGuests(1); // reset guests on room change
          }}
        >
          {hotel.room.map((room) => (
           <option
  key={room.id}
  value={room.id}
  disabled={room.availableRooms <= 0}
>
  {room.type} ({room.acType}) — ₹{room.price}
  {room.availableRooms <= 0 ? " (Sold Out)" : ""}
</option>

          ))}
        </select>
      </div>
{/* CHECK-IN */}
<div className="space-y-2">
  <label className="text-sm font-semibold text-gray-700">
    Check-in
  </label>

  <div className="relative group">
    <CalendarDays className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition" />

    <DatePicker
      selected={checkIn}
      onChange={(date) => {
        setCheckIn(date);
        if (checkOut && date > checkOut) setCheckOut(null);
      }}
      minDate={new Date()}
      maxDate={
    new Date(
      new Date().setMonth(new Date().getMonth() + 2)
    )
  }  // ✅ next 2 months
      placeholderText="Select check-in date"
      popperClassName="premium-datepicker"
      calendarClassName="premium-calendar"
      className="
        w-full bg-white border border-gray-200 rounded-xl
        pl-10 pr-4 py-3 text-sm
        shadow-sm
        focus:outline-none
        focus:ring-2 focus:ring-orange-400
        focus:border-orange-400
        transition-all duration-300
        hover:shadow-md
      "
      dateFormat="dd/MM/yyyy"
      showPopperArrow={false}
    />
  </div>
</div>


{/* CHECK-OUT */}
<div className="space-y-2">
  <label className="text-sm font-semibold text-gray-700">
    Check-out
  </label>

  <div className="relative group">
    <CalendarDays className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition" />

    <DatePicker
      selected={checkOut}
      onChange={(date) => setCheckOut(date)}
      minDate={checkIn || new Date()}
      maxDate={
    new Date(
      new Date().setMonth(new Date().getMonth() + 2)
    )
  }  // ✅ next 2 months
      placeholderText="Select check-out date"
      disabled={!checkIn}
      popperClassName="premium-datepicker"
      calendarClassName="premium-calendar"
      className="
        w-full bg-white border border-gray-200 rounded-xl
        pl-10 pr-4 py-3 text-sm
        shadow-sm
        focus:outline-none
        focus:ring-2 focus:ring-orange-400
        focus:border-orange-400
        transition-all duration-300
        hover:shadow-md
        disabled:bg-gray-100 disabled:cursor-not-allowed
      "
      dateFormat="dd/MM/yyyy"
      showPopperArrow={false}
    />
  </div>
</div>

    
   {/* Number Of Rooms */}
      <div>
  <label className="text-sm font-semibold">Number of Rooms</label>
  <select
    className="w-full border p-2 rounded mt-1"
    value={rooms}
    onChange={(e) => setRooms(Number(e.target.value))}
  >
    {Array.from(
      { length: selectedRoom?.totalRooms || 1 },
      (_, i) => i + 1
    ).map(r => (
      <option key={r} value={r}>
        {r} Room{r > 1 ? "s" : ""}
      </option>
    ))}
  </select>
</div>


      {/* GUESTS (ROOM LIMIT SAFE) */}
     <div>
  <label className="text-sm font-semibold">
    Guests (Max {maxGuests})
  </label>

  <select
    className="w-full border p-2 rounded mt-1"
    value={guests}
    onChange={(e) => setGuests(Number(e.target.value))}
  >
    {Array.from(
      { length: maxGuests },
      (_, i) => i + 1
    ).map((g) => (
      <option key={g} value={g}>
        {g} Guest{g > 1 ? "s" : ""}
      </option>
    ))}
  </select>

  <p className="text-xs text-gray-500 mt-1">
    {rooms} room{rooms > 1 ? "s" : ""} × {selectedRoom?.maxPersons} guests per room
  </p>
</div>


      {/* TOTAL PRICE */}
      {totalPrice > 0 && (
        <div className="bg-sand p-3 rounded text-center">
          <p className="font-semibold">Total Price</p>
          <p className="text-xl font-bold text-palmGreen">
            ₹{totalPrice}
          </p>
        </div>
      )}

      {/* BOOK NOW */}
      <button
  onClick={checkAvailability}
  disabled={!checkIn || !checkOut || !selectedRoom || checking}
  className={`w-full py-3 rounded text-lg text-white ${
    checking
      ? "bg-gray-400"
      : "bg-rusticBrown"
  }`}
>
  {checking ? "Checking..." : "Check Availability"}
</button>
{availabilityMsg && (
  <p
    className={`mt-3 text-sm font-semibold ${
      availability ? "text-green-700" : "text-red-600"
    }`}
  >
    {availabilityMsg}
  </p>
)}
{showPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setShowPopup(false)}
        className="absolute top-3 right-3 text-gray-500 text-xl"
      >
        ✕
      </button>

      {/* ICON */}
      <div className="text-center">
        <div className="text-4xl mb-3">📞</div>

        <h2 className="font-heading text-xl text-gray-800">
          Booking Unavailable
        </h2>

        <p className="text-gray-600 mt-3">
          Currently online booking is not available.
        </p>

        <p className="text-gray-800 font-semibold mt-2">
          Contact for booking:
        </p>

        <a
          href="tel:8975995125"
          className="text-palmGreen font-bold text-lg mt-1 block"
        >
          📱 8975995125
        </a>

        {/* ACTION BUTTON */}
        <button
          onClick={() => setShowPopup(false)}
          className="mt-6 w-full bg-palmGreen text-white py-3 rounded-lg font-medium"
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}

      <button
        disabled={!availability}
        className={`w-full py-3 rounded text-lg text-white ${
          availability
            ? "bg-rusticBrown"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        onClick={() =>
          nav(
            `/booking?hotelId=${id}` +
            `&roomId=${selectedRoom.id}` +
            `&roomType=${selectedRoom.type}` +
            `&acType=${selectedRoom.acType}` +
            `&price=${selectedRoom.price}` +
            `&rooms=${rooms}` + 
            `&checkIn=${checkIn}` +
            `&checkOut=${checkOut}` +
            `&guests=${guests}`
          )
        }
      >
        Book Now
      </button>
    </div>
  </div>
</div>
 

{nearbyHotels.length > 0 && (
  <div className="mt-16">
    <h2 className="font-heading text-3xl mb-6 text-palmGreen">
      Nearby & Similar Hotels
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {nearbyHotels.map(h => (
        <div
          key={h.id}
          className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
        >
          <img
            src={h.hotelimage?.[0]?.url || "/hotel.jpg"}
            className="w-full h-48 object-cover"
            alt={h.name}
          />

          <div className="p-4">
            <h3 className="font-heading text-lg">{h.name}</h3>

            <p className="text-gray-500 text-sm">
              📍 {h.nearby || h.location}
            </p>

            <p className="text-palmGreen font-bold mt-2">
              ₹{h.room?.[0]?.price || "—"} / night
            </p>

            <button
              onClick={() => nav(`/hotels/${h.id}`)}
              className="mt-3 w-full bg-palmGreen text-white py-2 rounded"
            >
              View Hotel
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      </div>
     <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
<AddReviews hotelId={hotel.id} onReviewAdded={() => {}} />
{/* <Reviews hotelId={hotel.id} /> */}
  </div>
    </div>
  );
}
