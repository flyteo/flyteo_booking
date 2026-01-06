import mongoose from "mongoose";

const CampingSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
  location: String,

  // Inclusions & Exclusions
  inclusions: [String],
  exclusions: [String],

  // Activities list
  activities: [String],

  // Itinerary (Day 1, Day 2, Day 3...)
  itinerary: [
    {
      day: String,     // "Day 1"
      description: [String]
    }
  ],

  // Day-wise Pricing
  pricingByDay: {
    type: Object,   // Example: { Sunday: 999, Monday: 1299 }
    default: {}
  },

  defaultPrice: { type: Number, default: 999 }
});

export default mongoose.model("Camping", CampingSchema);
