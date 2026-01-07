import { useEffect, useState } from "react";
import api from "../axios";

export default function Reviews({ hotelId ,campingId, villaId}) {
  const [reviews, setReviews] = useState([]);

const loadReviews = async () => {
  let type = "hotel";
  let id = hotelId;

  if (campingId) {
    type = "camping";
    id = campingId;
  }

  if (villaId) {
    type = "villa";
    id = villaId;
  }

  const res = await api.get(
    `/reviews?type=${type}&id=${id}`
  );

  setReviews(res.data);
};

useEffect(() => {
  loadReviews();
}, [hotelId, campingId, villaId]);


  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Guest Reviews</h2>

      {reviews.length === 0 && (
        <p className="text-gray-500">No reviews yet</p>
      )}

       {reviews.map((r) => (
        <div
          key={r.id}
          className="bg-white p-4 rounded-xl shadow border"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">{r.user.name}</h4>
            <span className="text-yellow-500">
              {"⭐".repeat(r.rating)}
            </span>
          </div>

          {r.comment && (
            <p className="text-gray-600 mt-2">{r.comment}</p>
          )}

          <p className="text-xs text-gray-400 mt-1">
            {new Date(r.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
