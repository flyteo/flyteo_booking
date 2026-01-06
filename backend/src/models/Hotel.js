import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  type: String,           // Deluxe, Double, Single
  acType: String,         // AC / Non-AC
  price: Number,
  maxPersons: Number,
  totalRooms: Number,
  images: [String]        // room images
});

const HotelSchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  address: String,
  email: String,
  phone: String,

  amenities: [String],

  images: [String],       // main hotel images
  roomImages: [String],   // optional

  pricePerNight: Number,  // base price (can remove later)

  rooms: [RoomSchema],    // ALL ROOM DETAILS HERE
  mapLocation: String,
  nearby:String,

  hotelAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  // ⭐ NEW FIELDS
  discount: {
    type: Number,   // % discount for all rooms
    default: 0
  },

 offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offer" }],
coupons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coupon" }],
   // ⭐ NEW IMPORTANT FIELDS

  hotelPolicies: {
    checkIn: String,
    checkOut: String,
    cancellationPolicy: String,
    childPolicy: String,
    petPolicy: String,
    coupleFriendly: Boolean
  },

  highlights: [String],

  safetyAndHygiene: {
    sanitizedRooms: Boolean,
    staffVaccinated: Boolean,
    fireSafety: Boolean,
    cctv: Boolean,
    contactlessCheckin: Boolean
  },

  hotelType: String,     
  starCategory: Number,   

  // distances: [
  //   {
  //     place: String,
  //     distance: String
  //   }
  // ],

  rules: {
    smokingAllowed: Boolean,
    alcoholAllowed: Boolean,
    visitorsAllowed: Boolean,
    loudMusicAllowed: Boolean
  },

  // paymentOptions: [String],

  // ownerDetails: {
  //   name: String,
  //   gstNumber: String,
  //   panNumber: String
  // },

  slug: {
    type: String,
  },

  rating: {
    average: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  }
});

export default mongoose.model("Hotel", HotelSchema);
