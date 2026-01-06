import { useState } from "react";
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      alert("Registered successfully!");
      nav("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="font-heading text-3xl text-palmGreen mb-6 text-center">
        Create an Account
      </h1>

      {error && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-medium">Full Name</label>
          <input
            type="text"
            required
            className="w-full mt-1 p-3 border rounded"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </div>

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

        <div>
          <label className="font-medium">Confirm Password</label>
          <input
            type="password"
            required
            className="w-full mt-1 p-3 border rounded"
            value={data.confirm}
            onChange={(e) => setData({ ...data, confirm: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-palmGreen text-white py-3 rounded mt-4 text-lg"
        >
          Register
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-rusticBrown font-semibold">
          Login
        </Link>
      </p>
    </div>
  );
}
