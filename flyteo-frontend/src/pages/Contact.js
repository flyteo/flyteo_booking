import { useState } from "react";
import axios from "../axios";

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

    await axios.post("/api/contact", form);
    alert("Message sent successfully!");
    setForm({ name: "", email: "", mobileNo: "", subject: "", message: "" });
  };

  return (
    <div className="mx-auto bg-white p-8 rounded-xl shadow mt-12">
      <h1 className="text-3xl font-heading text-palmGreen mb-6">
        Contact Us
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="input" placeholder="Full Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />

        <input className="input" placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />

        <input className="input" placeholder="Mobile Number"
          value={form.mobileNo}
          onChange={e => setForm({ ...form, mobileNo: e.target.value })}
        />

        <input className="input" placeholder="Subject"
          value={form.subject}
          onChange={e => setForm({ ...form, subject: e.target.value })}
        />

        <textarea className="input h-32" placeholder="Message"
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          required
        />

        <button className="w-full bg-palmGreen text-white py-3 rounded">
          Send Message
        </button>
      </form>
    </div>
  );
}
