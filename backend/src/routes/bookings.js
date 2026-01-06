import express from "express";
import auth from "../middlewares/auth.js";
import prisma from "../prisma.js";

const router = express.Router();

/* ============================
   CREATE BOOKING
============================ */
router.post("/", auth, async (req, res) => {
  try {
    const {
      type,
      hotel,
      camping,
      villa,
      roomType,
      acType,
      checkIn,
      checkOut,
      guests,
      fullname,
      mobileno,
      roomCount,
      totalAmount // 👈 frontend sends ONLY final total
    } = req.body;

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ msg: "Invalid total amount" });
    }

    /* ==========================
       ROOM VALIDATION (HOTEL)
    ========================== */
   if (type === "hotel" && hotel) {

  if (!roomCount || roomCount < 1) {
    return res.status(400).json({ msg: "Invalid room count" });
  }

  const room = await prisma.room.findFirst({
    where: {
      hotelId: Number(hotel),
      type: roomType,
      acType
    }
  });

  if (!room) {
    return res.status(400).json({ msg: "Invalid room selected" });
  }

  const booked = await prisma.booking.aggregate({
    _sum: { roomCount: true },
    where: {
      hotelId: Number(hotel),
      roomType,
      acType,
      paymentStatus: { not: "cancelled" },
      AND: [
        { checkIn: { lt: new Date(checkOut) } },
        { checkOut: { gt: new Date(checkIn) } }
      ]
    }
  });

  const bookedRooms = booked._sum.roomCount || 0;
  const availableRooms = room.totalRooms - bookedRooms;

  if (roomCount > availableRooms) {
    return res.status(400).json({
      msg: `Only ${availableRooms} room(s) available`
    });
  }

  const maxAllowedGuests = room.maxPersons * roomCount;

  if (guests > maxAllowedGuests) {
    return res.status(400).json({
      msg: `Maximum ${maxAllowedGuests} guests allowed for ${roomCount} room(s)`
    });
  }
}

    /* ==========================
       FETCH ADVANCE SETTINGS
    ========================== */
    let advanceAllowed = false;
    let advancePercent = null;

    if (type === "hotel" && hotel) {
      const h = await prisma.hotel.findUnique({
        where: { id: Number(hotel) },
        select: { advancePaymentAllowed: true, advancePercent: true }
      });
      advanceAllowed = h?.advancePaymentAllowed || false;
      advancePercent = h?.advancePercent ?? null;
    }

    if (type === "camping" && camping) {
      const c = await prisma.camping.findUnique({
        where: { id: Number(camping) },
        select: { advancePaymentAllowed: true, advancePercent: true }
      });
      advanceAllowed = c?.advancePaymentAllowed || false;
      advancePercent = c?.advancePercent ?? null;
    }

    if (type === "villa" && villa) {
      const v = await prisma.villa.findUnique({
        where: { id: Number(villa)},
        select: { advancePaymentAllowed: true, advancePercent: true }
      });
      advanceAllowed = v?.advancePaymentAllowed || false;
      advancePercent = v?.advancePercent ?? null;
    }

    /* ==========================
       PAYMENT CALCULATION
    ========================== */
    let paidAmount = totalAmount;
    let remainingAmount = 0;
    let paymentType = "full";
    let paymentStatus = "paid";

    if (advanceAllowed && advancePercent && advancePercent > 0) {
      paidAmount = Math.round((totalAmount * advancePercent) / 100);
      remainingAmount = totalAmount - paidAmount;
      paymentType = "partial";
      paymentStatus = "partial";
    }

     
    /* ==========================
       CREATE BOOKING
    ========================== */
    const booking = await prisma.booking.create({
      data: {
        type,
        roomType,
        acType,
        checkIn: new Date(checkIn),
        checkOut: checkOut ? new Date(checkOut) : null,
        guests,
        fullname,
        mobileno,
        roomCount,

        totalAmount,
        paidAmount,
        remainingAmount,
        paymentType,
        paymentStatus,
        advancePercent,
    

        user: {
          connect: { id: req.user.id }
        },

        ...(type === "hotel" && hotel
          ? { hotel: { connect: { id: Number(hotel) } } }
          : {}),

        ...(type === "camping" && camping
          ? { camping: { connect: { id: Number(camping) } } }
          : {}),

        ...(type === "villa" && villa
          ? { villa: { connect: { id: Number(villa) } } }
          : {})
      }
    });

   

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Booking failed" });
  }
});


/* ============================
   MY BOOKINGS
============================ */
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        hotel: true,
        camping: true
       
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load bookings" });
  }
});

/* ============================
   MARK AS PAID
============================ */
router.put("/:id/pay", auth, async (req, res) => {
  try {
    const bookingId = Number(req.params.id);

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: "paid" }
    });

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Payment update failed" });
  }
});

export default router;
