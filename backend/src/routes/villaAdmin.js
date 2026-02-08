import express from "express";
import prisma from "../prisma.js";
import auth, { villaAdminOnly } from "../middlewares/auth.js";


const router = express.Router();

router.get("/my-villa", auth, villaAdminOnly, async (req, res) => {
  const villa = await prisma.villa.findUnique({
    where: { id: req.user.villaId }
  });

  res.json(villa);
});

router.get("/bookings", auth, villaAdminOnly, async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: {
      villaId: req.user.villaId
    },
    include: {
      user: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(bookings);
});

router.post("/block-dates", auth, villaAdminOnly, async (req, res) => {
  const { dates } = req.body; // ["2026-02-01", "2026-02-02"]

  // if (!dates && date) {
  //   dates = [date];
  // }

   if (!Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({
        msg: "dates must be a non-empty array"
      });
    }

  await prisma.$transaction(
    dates.map(date =>
      prisma.villa_availability.upsert({
        where: {
          villaId_date: {
            villaId: req.user.villaId,
            date: new Date(date)
          }
        },
        update: { status: "blocked" },
        create: {
          villaId: req.user.villaId,
          date: new Date(date),
          status: "blocked"
        }
      })
    )
  );

  res.json({ msg: "Dates blocked" });
});

// DELETE /api/villa-admin/unblock-date/:date
router.delete(
  "/unblock-date/:date",
  auth,
  villaAdminOnly,
  async (req, res) => {
    try {
      const { date } = req.params;
      const villaId = req.user.villaId;

      if (!date) {
        return res.status(400).json({ msg: "Date is required" });
      }

      const existing = await prisma.villa_availability.findUnique({
        where: {
          villaId_date: {
            villaId,
            date: new Date(date)
          }
        }
      });

      if (!existing) {
        return res.status(404).json({
          msg: "Date is not blocked"
        });
      }

      // 🚫 never unblock booked dates
      if (existing.status === "booked") {
        return res.status(400).json({
          msg: "Booked dates cannot be unblocked"
        });
      }

      await prisma.villa_availability.delete({
        where: {
          villaId_date: {
            villaId,
            date: new Date(date)
          }
        }
      });

      res.json({ msg: "Date unblocked successfully" });

    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Failed to unblock date" });
    }
  }
);

router.post("/check-availability", async (req, res) => {
  const { villaId, checkIn, checkOut } = req.body;

  const conflict = await prisma.villa_availability.findFirst({
    where: {
      villaId,
      date: {
        gte: new Date(checkIn),
        lt: new Date(checkOut)
      },
      status: { in: ["booked", "blocked"] }
    }
  });

  res.json({ available: !conflict });
});


router.get("/availability", auth, villaAdminOnly, async (req, res) => {
  try {
    const { month, year } = req.query;
    const villaId = req.user.villaId;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    /* 1️⃣ Blocked dates (manual) */
    const blocked = await prisma.villa_availability.findMany({
      where: {
        villaId,
        date: { gte: start, lte: end }
      }
    });
const formatLocalDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
    /* 2️⃣ Booked ranges (confirmed bookings only) */
    const bookings = await prisma.booking.findMany({
      where: {
        villaId,
        checkInStatus: { not: "cancelled" },
        OR: [
          {
            checkIn: { lte: end },
            checkOut: { gte: start }
          }
        ]
      },
      select: {
        checkIn: true,
        checkOut: true
      }
    });

    /* 3️⃣ Expand bookings → individual booked dates */
    const bookedDates = new Set();

    bookings.forEach(b => {
      let d = new Date(b.checkIn);
      d.setHours(0, 0, 0, 0);

      const last = new Date(b.checkOut);
      last.setHours(0, 0, 0, 0);

      // ❗ checkOut day NOT booked (hotel rule)
      while (d < last) {
        bookedDates.add(formatLocalDate(d));
        d.setDate(d.getDate() + 1);
      }
    });

    /* 4️⃣ Merge result */
    const resultMap = new Map();

    // blocked first
    blocked.forEach(b => {
      const key = b.date.toISOString().slice(0, 10);
      resultMap.set(key, {
        date: key,
        status: b.status // "blocked"
      });
    });

    // booked overrides blocked
    bookedDates.forEach(date => {
      resultMap.set(date, {
        date,
        status: "booked"
      });
    });

    res.json([...resultMap.values()]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load availability" });
  }
});



router.put("/check-in/:bookingId", auth, villaAdminOnly, async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const collectedAmount = Number(req.body.collectedAmount || 0);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking || booking.villaId !== req.user.villaId) {
      return res.status(403).json({ msg: "Unauthorized booking" });
    }

    if (booking.checkInStatus !== "BOOKED") {
      return res.status(400).json({ msg: "Invalid booking state" });
    }

    const newPaid = Math.min(
      booking.paidAmount + collectedAmount,
      booking.totalAmount
    );

    const remaining = booking.totalAmount - newPaid;

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paidAmount: newPaid,
        remainingAmount: remaining,
        paymentStatus: remaining <= 0 ? "paid" : "partial",
        checkInStatus: "checked_in",
        checkinAt: new Date()
      }
    });

    res.json({ msg: "Villa guest checked in successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Villa check-in failed" });
  }
});


router.put("/check-out/:bookingId", auth, villaAdminOnly, async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking || booking.villaId !== req.user.villaId) {
      return res.status(403).json({ msg: "Unauthorized booking" });
    }

    if (booking.checkInStatus !== "checked_in") {
      return res.status(400).json({ msg: "Guest not checked in" });
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        checkInStatus: "checked_out",
        paymentStatus: "paid",
        remainingAmount: 0,
        checkoutAt: new Date()
      }
    });

    res.json({ msg: "Villa check-out completed" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Check-out failed" });
  }
});



export default router;