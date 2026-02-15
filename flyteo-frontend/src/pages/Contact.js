import { useState } from "react";
import api from "../axios";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileNo: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/contact", form);
    alert("Message sent successfully!");
    setForm({ name: "", email: "", mobileNo: "", subject: "", message: "" });
  };
return (
  <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#eef1f5] py-12 px-4">

    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

      {/* ================= LEFT INFO SECTION ================= */}
      <div className="space-y-6">

        <h1 className="text-4xl font-heading text-palmGreen">
          Get in Touch
        </h1>

        <p className="text-gray-600 leading-relaxed">
          Have questions about bookings, hotels, camping, or villas?
          Our team is here to help you anytime.
        </p>

        {/* Contact Info Cards */}
        <div className="space-y-4">

          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4 hover:shadow-lg transition">
            <div className="bg-palmGreen/10 p-3 rounded-full text-palmGreen text-xl">
              📞
            </div>
            <div>
              <p className="font-semibold text-gray-800">Call Us</p>
              <p className="text-gray-600 text-sm">+91 8975995125</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4 hover:shadow-lg transition">
            <div className="bg-palmGreen/10 p-3 rounded-full text-palmGreen text-xl">
              💬
            </div>
            <div>
              <p className="font-semibold text-gray-800">WhatsApp</p>
              <p className="text-gray-600 text-sm">Quick Support Available</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4 hover:shadow-lg transition">
            <div className="bg-palmGreen/10 p-3 rounded-full text-palmGreen text-xl">
              📧
            </div>
            <div>
              <p className="font-semibold text-gray-800">Email</p>
              <p className="text-gray-600 text-sm">flyteotravels@gmail.com</p>
            </div>
          </div>

        </div>
      </div>


      {/* ================= RIGHT FORM SECTION ================= */}
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-gray-100">

        <h2 className="text-2xl font-heading text-gray-800 mb-6">
          Send Us a Message
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-palmGreen outline-none transition"
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-palmGreen outline-none transition"
            placeholder="Email Address"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="tel"
            className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-palmGreen outline-none transition"
            placeholder="Mobile Number (Optional)"
            value={form.mobileNo}
            onChange={e => setForm({ ...form, mobileNo: e.target.value })}
          />

          <input
            className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-palmGreen outline-none transition"
            placeholder="Subject"
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
          />

          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 h-32 focus:ring-2 focus:ring-palmGreen outline-none transition resize-none"
            placeholder="Write your message..."
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            required
          />

          <button
            type="submit"
            className="w-full bg-palmGreen hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition active:scale-95 shadow-lg"
          >
            Send Message
          </button>

        </form>
      </div>

    </div>
  </div>
);

}
