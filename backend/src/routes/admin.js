import express from "express";
import auth, { adminOnly } from "../middlewares/auth.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/admin/stats
router.get("/stats", auth, adminOnly, async (req, res) => {
  try {
    /* ========================
       BASIC COUNTS
    ======================== */

    const [
      hotelsCount,
      campingCount,
      bookingsCount,
      usersCount
    ] = await Promise.all([
      prisma.hotel.count(),
      prisma.camping.count(),
      prisma.booking.count(),
      prisma.user.count()
    ]);

    /* ========================
       REVENUE CALCULATION
    ======================== */

    const paidBookings = await prisma.booking.findMany({
      where: { paymentStatus: "paid" },
      select: { totalAmount: true, type: true }
    });
 const messages = await prisma.contactmessage.findMany({
    orderBy: { createdAt: "desc" }
  });
  if(!messages){
    console.log("No messages found");
  }
    const totalRevenue = paidBookings.reduce(
      (sum, b) => sum + (b.totalAmount || 0),
      0
    );

    const hotelRevenue = paidBookings
      .filter((b) => b.type === "hotel")
      .reduce((s, b) => s + (b.totalAmount || 0), 0);

    const campingRevenue = paidBookings
      .filter((b) => b.type === "camping")
      .reduce((s, b) => s + (b.totalAmount || 0), 0);
    /* ========================
       BOOKINGS PER MONTH (LAST 6)
    ======================== */

    const now = new Date();
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - 5,
      1
    );

    const grouped = await prisma.booking.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: { id: true }
    });

    // Prepare last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label: d.toLocaleString("default", {
          month: "short",
          year: "numeric"
        })
      });
    }

    const bookingsByMonths = months.map((m) => {
      const count = grouped.filter((g) => {
        const d = new Date(g.createdAt);
        return d.getFullYear() === m.year && d.getMonth() === m.month;
      }).length;

      return {
        label: m.label,
        count
      };
    });

    /* ========================
       RESPONSE
    ======================== */

    res.json({
      hotelsCount,
      campingCount,
      bookingsCount,
      usersCount,
      totalRevenue,
      hotelRevenue,
      campingRevenue,
      bookingsByMonths,
      messages
    });

  } catch (err) {
    console.error("Admin Stats Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
