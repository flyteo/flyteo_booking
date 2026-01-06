import { useState } from "react";
import axios from "../axios";

export default function AddReviews({
  hotelId,
  campingId,
  villaId,
  onReviewAdded
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add a review");
      return;
    }

    let type = null;
    let targetId = null;

    if (hotelId) {
      type = "hotel";
      targetId = hotelId;
    } else if (campingId) {
      type = "camping";
      targetId = campingId;
    } else if (villaId) {
      type = "villa";
      targetId = villaId;
    }

    if (!type || !targetId) {
      alert("Invalid review target");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "/reviews",
        {
          type,
          targetId,
          rating,
          comment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setComment("");
      setRating(5);
      onReviewAdded?.();
      alert("Review submitted successfully");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border">
      <h3 className="font-heading text-lg mb-3">Write a Review</h3>

      {/* STAR RATING */}
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border p-2 rounded w-full mb-3"
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Star{r > 1 && "s"}
          </option>
        ))}
      </select>

      {/* COMMENT */}
      <textarea
        className="w-full border p-3 rounded"
        rows="4"
        placeholder="Share your experience"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        onClick={submitReview}
        disabled={loading}
        className="mt-4 bg-palmGreen text-white px-5 py-2 rounded w-full hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
