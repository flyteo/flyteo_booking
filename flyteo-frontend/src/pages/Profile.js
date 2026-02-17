import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  if (!user)
    return (
      <p className="p-10 text-center text-red-600">
        Not authenticated
      </p>
    );

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow mt-10">
      <h1 className="text-3xl font-heading text-palmGreen mb-6 text-center">
        My Profile
      </h1>

      <div className="space-y-4 text-gray-700">

        <div>
          <label className="font-semibold">Full Name</label>
          <p className="border p-3 rounded mt-1 bg-gray-50">
            {user.name}
          </p>
        </div>

        <div>
          <label className="font-semibold">Email</label>
          <p className="border p-3 rounded mt-1 bg-gray-50">
            {user.email}
          </p>
        </div>

        <div>
          <label className="font-semibold">Mobile Number</label>
          <p className="border p-3 rounded mt-1 bg-gray-50">
            {user.mobileNo || "-"}
          </p>
        </div>

        <div>
          <label className="font-semibold">Role</label>
          <p className="border p-3 rounded mt-1 bg-gray-50 capitalize">
            {user.role}
          </p>
        </div>

      </div>
    </div>
  );
}
