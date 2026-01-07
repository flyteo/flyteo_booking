import api from "../axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import AddReviews from "./AddReviews";
import Reviews from "./Reviews";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CancellationPolicy from "./CancellationPolicy";

export default function CampingDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [camp, setCamp] = useState(null);
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    api.get(`/campings/${id}`)
      .then((res) => setCamp(res.data))
      .catch(console.error);
  }, [id]);

  if (!camp) return <div className="p-10 text-center">Loading...</div>;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayPrice = camp.campingpricing?.find(p => p.day === today);

  const adultPrice = todayPrice?.adultPrice || 0;
  const childPrice = todayPrice?.childPrice || 0;
  const total = adults * adultPrice + children * childPrice;

  return (
    <div className="bg-[#f9faf7]">
      {/* 🔥 HERO SLIDER */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500 }}
        loop
        className="h-[50vh] md:h-[70vh]"
      >
        {(camp.campingimage?.length > 0
          ? camp.campingimage
          : [{ url: "/camping.jpg" }]
        ).map((img, i) => (
          <SwiperSlide key={i}>
            <img src={img.url} className="w-full h-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🌲 CONTENT WRAPPER */}
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-8">

          {/* TITLE */}
          <div>
            <h1 className="font-heading text-4xl">{camp.name}</h1>
            <p className="text-gray-600 mt-2">{camp.location}</p>
          </div>

          <p className="text-gray-700 leading-relaxed">{camp.description}</p>

          {/* PRICE STRIP */}
          <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Starting From</p>
              <p className="text-3xl font-bold text-palmGreen">
                ₹{adultPrice}
                <span className="text-sm font-normal text-gray-600"> / adult</span>
              </p>
            </div>
            <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              {today}
            </span>
          </div>

          {/* INCLUSIONS */}
          {camp.campinginclusion?.length > 0 && (
            <Section title="What's Included">
              {camp.campinginclusion.map(i => (
                <li key={i.id}>{i.text}</li>
              ))}
            </Section>
          )}

          {/* EXCLUSIONS */}
          {camp.campingexclusion?.length > 0 && (
            <Section title="What's Not Included">
              {camp.campingexclusion.map(e => (
                <li key={e.id}>{e.text}</li>
              ))}
            </Section>
          )}

          {/* ACTIVITIES */}
          {camp.campingactivity?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-3">Activities</h2>
              <div className="flex flex-wrap gap-3">
                {camp.campingactivity.map(a => (
                  <span
                    key={a.id}
                    className="px-4 py-2 bg-sand rounded-full text-sm"
                  >
                    {a.text}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ITINERARY */}
          {camp.campingitinerary?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
              {camp.campingitinerary.map((d, i) => (
                <div key={i} className="mb-4">
                  <h3 className="font-semibold">{d.day}</h3>
                  <ul className="list-disc ml-5 text-gray-600">
                    {d.campingitinerarypoint.map(p => (
                      <li key={p.id}>{p.text}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* REVIEWS */}
          <div className="space-y-4">
            <AddReviews campingId={camp.id} onReviewAdded={() => {}} />
            <Reviews campingId={camp.id} />
          </div>

         
        </div>

        {/* RIGHT BOOKING CARD */}
        <div className="sticky top-24 h-fit">
          <div className="bg-white p-6 rounded-xl shadow-xl border">
            <h3 className="text-xl font-bold mb-4 text-palmGreen">
              Book This Camping
            </h3>

            <Input label="Select Date" type="date" value={date} onChange={setDate} />
            <Input label="Adults" type="number" value={adults} onChange={setAdults} min={1} />
            <Input label="Children" type="number" value={children} onChange={setChildren} min={0} />

            {/* PRICE */}
            <div className="bg-sand p-4 rounded mt-4 space-y-2">
              <Row label={`Adults × ${adults}`} value={`₹${adults * adultPrice}`} />
              <Row label={`Children × ${children}`} value={`₹${children * childPrice}`} />
              <hr />
              <Row label="Total Payable" value={`₹${total}`} bold />
            </div>

            {/* <button
              disabled={!date}
              onClick={() =>
                nav(`/booking?campingId=${id}&date=${date}&adults=${adults}&children=${children}`)
              }
              className="mt-4 w-full bg-palmGreen text-white py-3 rounded-lg text-lg disabled:opacity-50"
            >
              Proceed to Booking
            </button> */}
             <button
              disabled={!date}
              onClick={() =>
                setShowPopup(true)
              }
              className="mt-4 w-full bg-palmGreen text-white py-3 rounded-lg text-lg disabled:opacity-50"
            >
              Proceed to Booking
            </button>
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

          </div>
        </div>

      </div>
       <CancellationPolicy />
    </div>
  );
}


const Section = ({ title, children }) => (
  <section>
    <h2 className="text-2xl font-bold mb-3">{title}</h2>
    <ul className="list-disc ml-6 text-gray-600 space-y-1">{children}</ul>
  </section>
);

const Input = ({ label, type, value, onChange, min }) => (
  <div className="mb-3">
    <label className="font-medium">{label}</label>
    <input
      type={type}
      min={min}
      value={value}
      onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      className="w-full mt-1 p-3 border rounded"
    />
  </div>
);

const Row = ({ label, value, bold }) => (
  <div className={`flex justify-between ${bold ? "font-bold text-lg text-palmGreen" : ""}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

