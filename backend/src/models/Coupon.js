import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },

  discountType: { type: String, enum: ["percent", "flat"], required: true },
  amount: { type: Number, required: true },
  minBookingAmount: { type: Number, default: 0 },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  isActive: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Coupon", CouponSchema);
