import { useState } from "react";
import api from "../axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [showPassword,setShowPassword] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNo: "",
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
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        mobileNo: data.mobileNo
      });

      alert("Registered successfully!");
      nav("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] px-4">

    <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">

      {/* LEFT SIDE BRAND PANEL */}
      <div className="hidden md:flex flex-col justify-center items-center bg-palmGreen text-white p-12">
        <h2 className="text-4xl font-heading mb-4">Join Flyteo.in</h2>
        <p className="text-center text-sm opacity-90 max-w-sm">
          Book Hotels, Villas & Camping experiences at the best prices.
        </p>

        {/* <img
          src="/register-illustration.png"
          alt="Travel"
          className="mt-10 w-72 object-contain opacity-90"
        /> */}
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="p-8 md:p-12">

        <h1 className="font-heading text-3xl text-gray-800 mb-2">
          Create an Account 🚀
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Start your journey with Flyteo
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* FULL NAME */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              required
              value={data.name}
              onChange={(e) =>
                setData({ ...data, name: e.target.value })
              }
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition"
              placeholder="Enter your full name"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              required
              value={data.email}
              onChange={(e) =>
                setData({ ...data, email: e.target.value })
              }
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition"
              placeholder="Enter your email"
            />
          </div>

          {/* MOBILE */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Mobile Number
            </label>
            <input
              type="tel"
              value={data.mobileNo}
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]{10}"
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                if (onlyDigits.length <= 10) {
                  setData({ ...data, mobileNo: onlyDigits });
                }
              }}
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition"
              placeholder="Enter 10 digit mobile number"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={data.password}
                onChange={(e) =>
                  setData({ ...data, password: e.target.value })
                }
                className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition"
                placeholder="Create a password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 cursor-pointer text-gray-400 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={data.confirm}
              onChange={(e) =>
                setData({ ...data, confirm: e.target.value })
              }
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition"
              placeholder="Re-enter your password"
            />
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition"
          >
            Create Account
          </button>

        </form>

        {/* LOGIN LINK */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-palmGreen font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  </div>
);

}
