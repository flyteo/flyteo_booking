import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./src/routes/admin.js";
import hotelAdminRoutes from "./src/routes/hotelAdmin.js"
import cron from "node-cron";
import "./src/cron/expireOffers.js"

dotenv.config();

import authRoutes from "./src/routes/auth.js";
import hotelRoutes from "./src/routes/hotels.js";
import campingRoutes from "./src/routes/campings.js";
import bookingRoutes from "./src/routes/bookings.js";
import uploadRoutes from "./src/routes/upload.js";
import adminOffersRoutes from "./src/routes/adminOffers.js";
import adminCouponsRoutes from "./src/routes/adminCoupons.js";
import adminBookingsRoute from "./src/routes/adminBookings.js";
import villaRoutes from "./src/routes/villas.js";
import reviewRoutes from "./src/routes/reviews.js";
import availabilityRoutes from "./src/routes/availabilityRoom.js";
import searchableRoutes from "./src/routes/search.js";
import invoiceRoutes from "./src/routes/invoice.js";
import contactRoutes from "./src/routes/contact.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL_FLYTEO, credentials: true }));


app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/campings", campingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/offers", adminOffersRoutes);
app.use("/api/coupons", adminCouponsRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/upload", uploadRoutes);
app.use("/api/hotel-admin", hotelAdminRoutes);
app.use("/api/admin/bookings", adminBookingsRoute);
app.use("/api/villas", villaRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/check-availability", availabilityRoutes);
app.use("/api/search", searchableRoutes);
app.use("/api/ebill-booking", invoiceRoutes);
app.use("/api/contact", contactRoutes);

app.listen(process.env.PORT,"0.0.0.0", () =>
      console.log(`Backend running on port ${process.env.PORT}`)
    );
  

