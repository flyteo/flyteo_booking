import express from "express";
import prisma from "../prisma.js";
import auth, { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

/**
 * GET /api/admin/bookings
 * Filters:
 *  - fromDate
 *  - toDate
 *  - location
 *  - type (hotel | camping)
 *  - paymentStatus
 */
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const {
      fromDate,
      toDate,
      location,
      type,
      paymentStatus
    } = req.query;

    const where = {};

    if (type) where.type = type;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    if (fromDate || toDate) {
      where.checkIn = {};
      if (fromDate) where.checkIn.gte = new Date(fromDate);
      if (toDate) where.checkIn.lte = new Date(toDate);
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        hotel: { select: { name: true, location: true } },
        camping: { select: { name: true, location: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    // 🔎 Location filter (hotel or camping)
    const filtered = location
      ? bookings.filter(b =>
          b.hotel?.location?.toLowerCase().includes(location.toLowerCase()) ||
          b.campings?.location?.toLowerCase().includes(location.toLowerCase())
        )
      : bookings;

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load bookings" });
  }
});

export default router;
