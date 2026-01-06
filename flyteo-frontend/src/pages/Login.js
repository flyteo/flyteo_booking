import { useState ,useEffect } from "react";
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("/auth/login", data);

    // Save token + user
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    const role = res.data.user.role;

    // ROLE BASED NAVIGATION
    if (role === "admin") {
      nav("/admin/dashboard");

    } else if (role === "hotel-admin") {
      nav("/hotel-admin/dashboard");

    } else {
      nav("/");
    }

  } catch (err) {
    setError(err.response?.data?.msg || "Login failed");
  }
};

 useEffect(() => {
  const u = JSON.parse(localStorage.getItem("user"));
  if (!u) return;

  if (u.role === "admin") {
    nav("/admin/dashboard");
  } else if (u.role === "hotel-admin") {
    nav("/hotel-admin/dashboard");
  }
}, []);

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="font-heading text-3xl text-palmGreen mb-6 text-center">
        Welcome Back
      </h1>

      {error && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-medium">Email</label>
          <input
            type="email"
            required
            className="w-full mt-1 p-3 border rounded"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>

        <div>
          <label className="font-medium">Password</label>
          <input
            type="password"
            required
            className="w-full mt-1 p-3 border rounded"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-rusticBrown text-white py-3 rounded mt-4 text-lg"
        >
          Login
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        Don't have an account?{" "}
        <Link to="/" className="text-palmGreen font-semibold">
          Register Now
        </Link>
      </p>
    </div>
  );
}
