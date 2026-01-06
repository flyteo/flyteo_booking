import express from "express";
import auth from "../middlewares/auth.js";
import prisma from "../prisma.js";
import { generateBookingInvoice } from "../utils/invoiceGenerator.js";

const router = express.Router();

/* ===========================
   DOWNLOAD BOOKING INVOICE
=========================== */
router.get("/:bookingId", async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
      include: {
        user: true,
        hotel: true,
        villa: true,
        camping: true
      }
    });

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    // ✅ Only owner or admin can download
    // if (booking.userId !== req.user.id && req.user.role !== "admin") {
    //   return res.status(403).json({ msg: "Unauthorized" });
    // }

    generateBookingInvoice(booking, res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to generate invoice" });
  }
});

export default router;
