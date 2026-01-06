import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const nav = useNavigate();

  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/login", data);

      if (res.data.user.role !== "admin") {
        setError("Not an admin account");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.user));

      nav("/admin/dashboard");

    } catch (err) {
      setError("Invalid login");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white mt-10 p-8 rounded-xl shadow">
      <h1 className="font-heading text-3xl text-palmGreen mb-4 text-center">
        Admin Login
      </h1>

      {error && <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>}

      <form onSubmit={submit} className="space-y-4 mt-4">
        <input
          type="email"
          placeholder="Admin Email"
          className="w-full p-3 border rounded"
          onChange={(e)=> setData({...data, email:e.target.value})}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded"
          onChange={(e)=> setData({...data, password:e.target.value})}
        />

        <button className="w-full bg-rusticBrown text-white py-3 rounded">
          Login as Admin
        </button>
      </form>
    </div>
  );
}
