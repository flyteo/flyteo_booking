import { useNavigate } from "react-router-dom";

export default function AdminTopbar() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     nav("/");
//   };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="w-full bg-white shadow p-4 flex justify-between items-center">
      <h2 className="font-heading text-xl text-palmGreen">
        Welcome, {user.name}
      </h2>

      
    </div>
  );
}
