import mongoose from "mongoose";
import dotenv from "dotenv";
import Hotel from "../models/Hotel.js";
import Camping from "../models/Camping.js";

dotenv.config();

const hotels = [
  {
    name: "Taj Mahal Palace",
    location: "Mumbai",
    description: "Luxury iconic hotel in Mumbai.",
    images: [],
    pricePerNight: 20000,
    amenities: ["Free Wifi", "Restaurant", "Swimming Pool", "Spa"],
    featured: true
  },
  {
    name: "The Oberoi Mumbai",
    location: "Mumbai",
    description: "Premium luxury hotel.",
    images: [],
    pricePerNight: 18000
  },
  {
    name: "Trident Nariman Point",
    location: "Mumbai",
    description: "Seafront luxury hotel.",
    images: [],
    pricePerNight: 15000
  }
];

const campings = [
  { name: "Pawna Lake Camping", description: "Lakeside camping.", images: [], pricePerNight: 999, location: "Mumbai" },
  { name: "Karnala Forest Camping", description: "Forest stay.", images: [], pricePerNight: 999, location: "Mumbai" }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Hotel.deleteMany({});
  await Camping.deleteMany({});

  await Hotel.insertMany(hotels);
  await Camping.insertMany(campings);

  console.log("Seed complete");
  process.exit(0);
}

seed();
