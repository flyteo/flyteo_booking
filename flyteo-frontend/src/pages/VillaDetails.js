import api from "../axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay ,Thumbs} from "swiper/modules";
import AddReviews from "./AddReviews";
import Reviews from "./Reviews";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import VillaBookingSidebar from "./VillaBookingSidebar";


export default function VillaDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [villa, setVilla] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
const [thumbsSwiper, setThumbsSwiper] = useState(null);


  useEffect(() => {
    api
      .get(`/villas/${id}`)
      .then(res => setVilla(res.data))
      .catch(console.error);
  }, [id]);

  if (!villa) return <div className="p-10 text-center">Loading…</div>;

  const layout = villa.villalayout;

  return (
    <div className="bg-gray-50">
      {/* HERO SLIDER */}
      <div className="relative">
        <Swiper
          modules={[ Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          slidesPerView={1}
          className="h-[62vh]"
        >
          {(villa.villaimage?.length > 0
            ? villa.villaimage
            : [{ url: "/villa.jpg" }]
          ).map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={img.url}
                alt={villa.name}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* FLOATING PRICE CARD */}
       
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2">
          <h1 className="font-heading text-4xl text-gray-900">
            {villa.name}
          </h1>

          <p className="mt-2 text-gray-600 flex items-center gap-2">
            📍 {villa.location}
          </p>

          <p className="mt-6 text-gray-700 leading-relaxed">
            {villa.description}
          </p>

          {/* HIGHLIGHTS */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Highlight label="Max Guests" value={villa.maxGuests} icon="👨‍👩‍👧‍👦" />
            {layout?.bedrooms && (
              <Highlight label="Bedrooms" value={layout.bedrooms} icon="🛏️" />
            )}
            {layout?.bathrooms && (
              <Highlight label="Bathrooms" value={layout.bathrooms} icon="🚿" />
            )}
            {layout?.beds && (
              <Highlight label="Beds" value={layout.beds} icon="🛌" />
            )}
          </div>

          {/* FEATURES */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Villa Features</h2>

            <div className="flex flex-wrap gap-3">
              {layout?.livingRoom && Feature("Living Room")}
              {layout?.kitchen && Feature("Fully Equipped Kitchen")}
              {layout?.privatePool && Feature("Private Pool")}
              {layout?.garden && Feature("Private Garden")}
              {layout?.parkingSlots && Feature("Parking Available")}
            </div>
          </div>
          {/* VILLA GALLERY */}
{villa.villaimage?.length > 0 && (
  <section className="mt-12">
    <h2 className="text-2xl font-bold mb-4">Villa Gallery</h2>

    {/* MAIN SLIDER */}
    <Swiper
      modules={[Navigation, Thumbs]}
      navigation
      thumbs={{ swiper: thumbsSwiper }}
      className="rounded-xl overflow-hidden h-[45vh]"
    >
      {villa.villaimage.map((img) => (
        <SwiperSlide key={img.id}>
          <img
            src={img.url}
            alt="Villa"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>

    {/* THUMBNAIL SLIDER */}
    <Swiper
      onSwiper={setThumbsSwiper}
      slidesPerView={5}
      spaceBetween={10}
      className="mt-4"
      breakpoints={{
        320: { slidesPerView: 3 },
        640: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
      }}
    >
      {villa.villaimage.map((img) => (
        <SwiperSlide key={img.id}>
          <img
            src={img.url}
            alt="Thumbnail"
            className="h-24 w-full object-cover rounded-lg cursor-pointer border hover:border-palmGreen transition"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
)}



          {/* POLICIES */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">House Rules & Policies</h2>

            <ul className="space-y-2 text-gray-600">
              {villa.checkInTime && (
                <li>⏰ Check-in: {villa.checkInTime}</li>
              )}
              {villa.checkOutTime && (
                <li>⏰ Check-out: {villa.checkOutTime}</li>
              )}
              {villa.cancellationPolicy && (
                <li>Cancellation : {villa.cancellationPolicy}</li>
              )}
              {/* {villa.securityDeposit && (
                <li>💰 Security Deposit: ₹{villa.securityDeposit}</li>
              )} */}
            </ul>
          </div>
        </div>

        <VillaBookingSidebar villa={villa}/>

        {/* MOBILE BOOK CARD */}
        {/* <div className="lg:hidden bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Starting from</p>
          <p className="text-3xl font-bold text-palmGreen">
            ₹{villa.basePrice}
          </p>
          <button
            onClick={() => nav(`/booking?villaId=${villa.id}`)}
            className="mt-4 w-full bg-rusticBrown text-white py-3 rounded-lg"
          >
            Book This Villa
          </button>
        </div> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
      <AddReviews villaId={villa.id} onReviewAdded={()=>{}} />
      <Reviews villaId={villa.id} />
        </div>
        {/* IMAGE PREVIEW MODAL */}
{selectedImage && (
  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    onClick={() => setSelectedImage(null)}
  >
    <img
      src={selectedImage}
      alt="Preview"
      className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
    />
  </div>
)}

    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

const Highlight = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow text-center">
    <div className="text-2xl">{icon}</div>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

const Feature = (text) => (
  <span className="px-4 py-2 bg-sand rounded-full text-sm">
    {text}
  </span>
);
