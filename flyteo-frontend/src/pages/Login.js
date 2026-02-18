import { useState ,useEffect } from "react";
import api from "../axios";
import { Link, useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const {login} =useAuth();
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword,setShowPassword] =useState(false)

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
   await login(data.email, data.password);
window.location.href = "/";

    // Save token + user
    // localStorage.setItem("token", res.data.token);
    // localStorage.setItem("user", JSON.stringify(res.data.user));

    // const role = res.data.user.role;

    // ROLE BASED NAVIGATION
  

  } catch (err) {
    setError(err.response?.data?.msg || "Login failed");
  }
};

//  useEffect(() => {
//   const u = JSON.parse(localStorage.getItem("user"));
//   if (!u) return;

//   if (u.role === "admin") {
//     nav("/admin/dashboard");
//   } else if (u.role === "hotel-admin") {
//     nav("/hotel-admin/dashboard");
//   }
//   else if (u.role === "villa-admin") {
//     nav("/villa-admin/dashboard");
//   }
// }, []);

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] px-4">

    <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">

      {/* LEFT SIDE (DESKTOP IMAGE / BRAND SECTION) */}
      <div className="hidden md:flex flex-col justify-center items-center bg-palmGreen text-white p-10">
        <h2 className="text-4xl font-heading mb-4">Flyteo.in</h2>
        <p className="text-center text-sm opacity-90">
          Discover Hotels, Villas & Camping experiences with ease.
        </p>

        {/* <img
          src="/login-illustration.png"
          alt="Travel"
          className="mt-8 w-72 object-contain opacity-90"
        /> */}
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="p-8 md:p-12">

        <h1 className="font-heading text-3xl text-gray-800 mb-2">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Login to continue your journey
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

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
                placeholder="Enter your password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 cursor-pointer text-gray-400 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* FORGOT PASSWORD */}
          {/* <div className="text-right text-sm">
            <Link
              to="/forgot-password"
              className="text-orange-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div> */}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition"
          >
            Login
          </button>

        </form>

        {/* REGISTER LINK */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-palmGreen font-semibold hover:underline"
          >
            Register Now
          </Link>
        </p>

      </div>
    </div>
  </div>
);

}
