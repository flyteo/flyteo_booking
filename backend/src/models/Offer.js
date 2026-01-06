import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  discountPercent: { type: Number, required: true },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  isActive: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Offer", OfferSchema);
