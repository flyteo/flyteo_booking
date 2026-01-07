import { useEffect, useState } from "react";
import api from "../axios";
import HotelAdminSidebar from "./HotelAdminSidebar";

export default function HotelAdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    type: "",
    acType: "",
    price: "",
    maxPersons: "",
    totalRooms: ""
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get(
      "/hotel-admin/my-rooms",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setRooms(res.data);
  };

  const updateRoom = async (id, updatedRoom) => {
    const token = localStorage.getItem("token");

    await api.put(
      `/hotel-admin/rooms/${id}`,
      updatedRoom,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    loadRooms();
  };

  const deleteRoom = async (id) => {
    const token = localStorage.getItem("token");

    await api.put(
      `/hotel-admin/rooms/${id}`,
      { _delete: true }, // You will handle this in backend later
      { headers: { Authorization: `Bearer ${token}` } }
    );

    loadRooms();
  };

  const addRoom = async () => {
    const token = localStorage.getItem("token");

    await api.put(
      "/hotel-admin/update-hotel",
      { rooms: [...rooms, newRoom] },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNewRoom({ type: "", acType: "", price: "", maxPersons: "", totalRooms: "" });
    loadRooms();
  };

  return (
    <div className="flex">
      <HotelAdminSidebar />

      <div className="ml-72 w-full p-8">

        <h1 className="text-3xl text-palmGreen font-heading mb-6">
          Manage Rooms
        </h1>

        {/* EXISTING ROOMS */}
        <div className="space-y-6">

          {rooms.map((room) => (
            <div key={room._id} className="bg-white shadow p-6 rounded">
              <h2 className="font-heading text-xl mb-3">{room.type} ({room.acType})</h2>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    className="p-2 border rounded w-full"
                    value={room.price}
                    onChange={(e) =>
                      updateRoom(room._id, { ...room, price: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label>Max Persons</label>
                  <input
                    type="number"
                    className="p-2 border rounded w-full"
                    value={room.maxPersons}
                    onChange={(e) =>
                      updateRoom(room._id, { ...room, maxPersons: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label>Total Rooms</label>
                  <input
                    type="number"
                    className="p-2 border rounded w-full"
                    value={room.totalRooms}
                    onChange={(e) =>
                      updateRoom(room._id, { ...room, totalRooms: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => deleteRoom(room._id)}
              >
                Delete Room Type
              </button>
            </div>
          ))}

        </div>

        {/* ADD NEW ROOM */}
        <h2 className="font-heading text-xl mt-10 mb-3">Add New Room Type</h2>

        <div className="bg-white shadow p-6 rounded grid grid-cols-2 gap-4">

          <div>
            <label>Room Type</label>
            <select
              className="p-2 border rounded w-full"
              value={newRoom.type}
              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
            >
              <option>Deluxe</option>
              <option>Double Bed</option>
              <option>Single Bed</option>
            </select>
          </div>

          <div>
            <label>AC Type</label>
            <select
              className="p-2 border rounded w-full"
              value={newRoom.acType}
              onChange={(e) => setNewRoom({ ...newRoom, acType: e.target.value })}
            >
              <option>AC</option>
              <option>Non-AC</option>
            </select>
          </div>

          <div>
            <label>Price</label>
            <input
              type="number"
              className="p-2 border rounded w-full"
              value={newRoom.price}
              onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
            />
          </div>

          <div>
            <label>Max Persons</label>
            <input
              type="number"
              className="p-2 border rounded w-full"
              value={newRoom.maxPersons}
              onChange={(e) => setNewRoom({ ...newRoom, maxPersons: e.target.value })}
            />
          </div>

          <div>
            <label>Total Rooms</label>
            <input
              type="number"
              className="p-2 border rounded w-full"
              value={newRoom.totalRooms}
              onChange={(e) => setNewRoom({ ...newRoom, totalRooms: e.target.value })}
            />
          </div>
        </div>

        <button
          className="bg-palmGreen text-white px-6 py-3 rounded mt-4"
          onClick={addRoom}
        >
          + Add Room Type
        </button>

      </div>
    </div>
  );
}
