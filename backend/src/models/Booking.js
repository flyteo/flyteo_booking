import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
  camping: { type: mongoose.Schema.Types.ObjectId, ref: "Camping" },
  startDate: Date,
  endDate: Date,
  price: Number,
  paymentStatus: { type: String, default: "pending" }
});

export default mongoose.model("Booking", BookingSchema);
