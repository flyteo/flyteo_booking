import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext"

export default function AdminTopbar() {
  const nav = useNavigate();
  const { user, loading } = useAuth();

if (loading) return null;

if (!user || user.role !== "admin") return null;

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     nav("/");
//   };


  return (
    <div className="w-full bg-white shadow p-4 flex justify-between items-center">
      <h2 className="font-heading text-xl text-palmGreen">
        Welcome, {user.name}
      </h2>

      
    </div>
  );
}
