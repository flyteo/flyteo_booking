// routes/availability.js
import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

router.post("/hotel-room", async (req, res) => {
 try {
  const {
    hotelId,
    roomType,
    acType,
    checkIn,
    checkOut,
    roomsRequested
  } = req.body;

  if (
    !hotelId ||
    !roomType ||
    !acType ||
    !checkIn ||
    !checkOut ||
    !roomsRequested
  ) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  // 1️⃣ Get room info
  const room = await prisma.room.findFirst({
    where: {
      hotelId: Number(hotelId),
      type: roomType,
      acType
    }
  });

  if (!room) {
    return res.status(404).json({
      available: false,
      msg: "Room not found"
    });
  }

  // 2️⃣ Fetch overlapping bookings
  const bookings = await prisma.booking.findMany({
    where: {
      hotelId: Number(hotelId),
      roomType,
      acType,
      paymentStatus: { not: "cancelled" },
      AND: [
        { checkIn: { lt: new Date(checkOut) } },
        { checkOut: { gt: new Date(checkIn) } }
      ]
    },
    select: {
      roomCount: true   // ✅ CORRECT FIELD
    }
  });

  // 3️⃣ Sum booked rooms
  const bookedRooms = bookings.reduce(
    (sum, b) => sum + (b.roomCount || 0),
    0
  );

  const availableRooms = room.totalRooms - bookedRooms;

  res.json({
    available: availableRooms >= roomsRequested,
    availableRooms,
    requested: roomsRequested
  });

} catch (err) {
  console.error(err);
  res.status(500).json({ msg: "Availability check failed" });
}

});

export default router;
