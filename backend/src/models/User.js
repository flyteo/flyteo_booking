import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  passwordHash: String,
 role: {
  type: String,
  enum: ["user", "admin", "hotel-admin"],
  default: "user"
},
hotelId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Hotel",
  default: null
}
});

export default mongoose.model("User", UserSchema);
