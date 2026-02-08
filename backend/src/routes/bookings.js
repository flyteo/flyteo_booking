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
      totalAmount,
      // remainingAmount,
      paymentChoice
    } = req.body;

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ msg: "Invalid total amount" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = checkOut ? new Date(checkOut) : null;

    const booking = await prisma.$transaction(async (tx) => {

      /* ==========================
         HOTEL AVAILABILITY CHECK
      ========================== */
      if (type === "hotel") {
        if (!roomCount || roomCount < 1) {
          throw new Error("Invalid room count");
        }

        const room = await tx.room.findFirst({
          where: {
            hotelId: Number(hotel),
            type: roomType,
            acType
          }
        });

        if (!room) throw new Error("Invalid room selected");

        // 🔹 Booked rooms
        const booked = await tx.booking.aggregate({
          _sum: { roomCount: true },
          where: {
            hotelId: Number(hotel),
            roomType,
            acType,
            paymentStatus: { not: "cancelled" },
            AND: [
              { checkIn: { lt: checkOutDate } },
              { checkOut: { gt: checkInDate } }
            ]
          }
        });

        const bookedRooms = booked._sum.roomCount || 0;

        // 🔹 Blocked rooms (admin / hotel-admin)
        const blocked = await tx.room_availability.findMany({
          where: {
            roomId: room.id,
            date: {
              gte: checkInDate,
              lt: checkOutDate
            }
          },
          select: { blocked_rooms: true }
        });

        // 🔹 Find max blocked on any day (safe rule)
const blockedRooms = blocked.reduce(
  (max, b) => Math.max(max, b.blocked_rooms),
  0
);

        const availableRooms =
          room.totalRooms - bookedRooms - blockedRooms;

        if (roomCount > availableRooms) {
          throw new Error(
            `Only ${availableRooms} room(s) available`
          );
        }

        const maxGuests = room.maxPersons * roomCount;
        if (guests > maxGuests) {
          throw new Error(
            `Maximum ${maxGuests} guests allowed`
          );
        }
      }

      /* ==========================
         VILLA AVAILABILITY CHECK
      ========================== */
      if (type === "villa") {
        const overlappingBooking = await tx.booking.findFirst({
          where: {
            villaId: Number(villa),
            paymentStatus: { not: "cancelled" },
            AND: [
              { checkIn: { lt: checkOutDate } },
              { checkOut: { gt: checkInDate } }
            ]
          }
        });

        if (overlappingBooking) {
          throw new Error("Villa not available for selected dates");
        }

        const blocked = await tx.villa_availability.findFirst({
          where: {
            villaId: Number(villa),
            date: {
              gte: checkInDate,
              lt: checkOutDate
            },
            status:"blocked"
          }
        });

        if (blocked) {
          throw new Error("Villa Sold Out / Blocked for selected date");
        }
      }

      if (type === "camping") {
  const blocked = await prisma.camping_availability.findFirst({
    where: {
      campingId: Number(camping),
      date: checkInDate,
      status: "blocked"
    }
  });

  if (blocked) {
    throw new Error("Camping not available on selected date");
  }
}



      /* ==========================
         ADVANCE PAYMENT
      ========================== */
      let advanceAllowed = false;
      let advancePercent = null;

      if (type === "hotel") {
        const h = await tx.hotel.findUnique({
          where: { id: Number(hotel) },
          select: {
            advancePaymentAllowed: true,
            advancePercent: true
          }
        });
        advanceAllowed = h?.advancePaymentAllowed;
        advancePercent = h?.advancePercent;
      }
      
       if (type === "camping" && camping) {
      const c = await prisma.camping.findUnique({
        where: { id: Number(camping) },
        select: { advancePaymentAllowed: true, advancePercent: true }
      });
      advanceAllowed = c?.advancePaymentAllowed || false;
      advancePercent = c?.advancePercent ?? null;
    }

      if (type === "villa") {
        const v = await tx.villa.findUnique({
          where: { id: Number(villa) },
          select: {
            advancePaymentAllowed: true,
            advancePercent: true
          }
        });
        advanceAllowed = v?.advancePaymentAllowed;
        advancePercent = v?.advancePercent;
      }

      let paidAmount = totalAmount;
      let paymentType = "full";
      let remainingAmount = 0;
      let paymentStatus = "paid";

      if (advanceAllowed && paymentChoice === "advance") {
        const percent =Number(advancePercent || 0)
        paidAmount = Math.round((totalAmount * percent) / 100);
        remainingAmount = totalAmount - paidAmount;
        paymentType = "partial";
        paymentStatus = "partial";
      }

      /* ==========================
         CREATE BOOKING
      ========================== */
      return await tx.booking.create({
        data: {
          type,
          roomType,
          acType,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests,
          fullname,
          mobileno,
          roomCount,

          totalAmount,
          remainingAmount,
          paidAmount,
          paymentType,
          paymentStatus,
          advancePercent,
          paymentChoice,

          user: { connect: { id: req.user.id } },

          ...(type === "hotel"
            ? { hotel: { connect: { id: Number(hotel) } } }
            : {}),
          ...(type === "villa"
            ? { villa: { connect: { id: Number(villa) } } }
            : {}),
          ...(type === "camping" 
            ? { camping: { connect: { id: Number(camping) } } }
            : {}),
        }
      });
    });

    res.json(booking);

  } catch (err) {
    console.error(err);
    res.status(500).json({
msg: err.message || "Booking failed"
});
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

router.post("/collect-payment", auth, async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) }
    });

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    const newPaid = booking.paidAmount + Number(amount);
    const remaining = Math.max(
      booking.totalAmount - newPaid,
      0
    );

    let paymentStatus = "pending";
    if (remaining === 0) paymentStatus = "paid";
    else if (newPaid > 0) paymentStatus = "partial";

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paidAmount: newPaid,
        remainingAmount: remaining,
        paymentStatus
      }
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Payment update failed" });
  }
});

export default router;
