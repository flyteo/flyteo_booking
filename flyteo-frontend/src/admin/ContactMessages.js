import { useEffect, useState } from "react";
import axios from "../axios";
import AdminSidebar from "./AdminSidebar";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("/contact").then(res => setMessages(res.data));
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="p-8 w-full">
        <h1 className="text-3xl font-heading mb-6">
          Contact Messages
        </h1>

        <div className="space-y-4">
          {messages.map(m => (
            <div
              key={m.id}
              className={`p-4 rounded shadow ${
                m.isResolved ? "bg-green-50" : "bg-white"
              }`}
            >
              <h3 className="font-bold">{m.name}</h3>
              <p className="text-sm text-gray-600">{m.email}</p>
              <p className="mt-2">{m.message}</p>

              <button
                onClick={() =>
                  axios.put(`/contact/${m.id}/resolve`)
                }
                className="mt-3 text-sm bg-palmGreen text-white px-3 py-1 rounded"
              >
                Mark Resolved
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
