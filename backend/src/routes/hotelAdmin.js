import express from "express";
import prisma from "../prisma.js";
import auth, { hotelAdminOnly } from "../middlewares/auth.js";

const router = express.Router();

/**
 * 🔐 Only hotel-admin can access
 */

/**
 * GET /api/hotel-admin/my-hotel
 */
router.get("/my-hotel", auth, hotelAdminOnly, async (req, res) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: req.user.hotelId }
    });

    if (!hotel) {
      return res.status(404).json({ msg: "Hotel not found" });
    }

    res.json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch hotel" });
  }
});

/**
 * GET /api/hotel-admin/my-rooms
 */
router.get("/my-rooms", auth, hotelAdminOnly, async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        hotelId: req.user.hotelId
      }
    });

    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch rooms" });
  }
});

/**
 * GET /api/hotel-admin/bookings
 */
router.get("/bookings", auth, hotelAdminOnly, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        hotelId: req.user.hotelId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch bookings" });
  }
});

/**
 * GET /api/hotel-admin/availability?date=YYYY-MM-DD
 */
/**
 * GET /api/hotel-admin/availability?date=YYYY-MM-DD
 */
router.get("/availability", auth, hotelAdminOnly, async (req, res) => {
  try {
    const date = req.query.date
      ? new Date(req.query.date)
      : new Date();

    const rooms = await prisma.room.findMany({
      where: { hotelId: req.user.hotelId }
    });

    const bookings = await prisma.booking.findMany({
      where: {
        hotelId: req.user.hotelId,
        checkIn: { lte: date },
        checkOut: { gt: date },
        checkInStatus: { notIn: ["cancelled", "checked_out"] }
      }
    });

    const blocks = await prisma.room_availability.findMany({
      where: {
        hotelId: req.user.hotelId,
        date
      }
    });

    const availability = rooms.map(room => {
      const bookedRooms = bookings
        .filter(b => b.roomType === room.type)
        .reduce((sum, b) => sum + (b.roomCount || 1), 0);

      const blocked = blocks.find(b => b.roomId === room.id)?.blocked_rooms || 0;

      return {
        roomId: room.id,
        roomType: room.type,
        totalRooms: room.totalRooms,
        bookedRooms,
        blockedRooms: blocked,
        availableRooms: room.totalRooms - bookedRooms - blocked
      };
    });

    res.json(availability);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load availability" });
  }
});


/**
 * POST /api/hotel-admin/bookings/:id/check-in
 */
router.put("/bookings/:id/check-in", auth, hotelAdminOnly, async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const { collectedAmount = 0 } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking || booking.hotelId !== req.user.hotelId) {
      return res.status(403).json({ msg: "Unauthorized booking" });
    }
     if (booking.checkInStatus !== "BOOKED") {
      return res.status(400).json({ msg: "Invalid booking state" });
    }

    const paidAmount = booking.paidAmount + (collectedAmount || 0);
    const remainingAmount = booking.totalAmount - paidAmount;

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paidAmount,
        remainingAmount,
        paymentStatus: remainingAmount <= 0 ? "paid" : "partial",
        checkInStatus: "checked_in",
        checkinAt: new Date()
      }
    });

    res.json({ msg: "Customer checked in successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Check-in failed" });
  }
});
// PUT /api/hotel-admin/bookings/:id/check-out
router.put("/bookings/:id/check-out", auth, hotelAdminOnly, async (req, res) => {
  try {
    const bookingId = Number(req.params.id);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking || booking.hotelId !== req.user.hotelId) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (booking.checkInStatus !== "checked_in") {
      return res.status(400).json({ msg: "Guest not checked in" });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        checkInStatus: "checked_out",
        checkoutAt: new Date()
      }
    });

    res.json({ msg: "Guest checked out", booking: updated });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Check-out failed" });
  }
});

/**
 * POST /api/hotel-admin/availability/block
 */
function normalizeDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);

  // month - 1 because JS months are 0-based
  return new Date(year, month - 1, day);
}


router.post("/availability/block", auth, hotelAdminOnly, async (req, res) => {
  try {
    const { roomId, date, blockedRooms } = req.body;

    if (blockedRooms < 0) {
      return res.status(400).json({ msg: "Blocked rooms cannot be negative" });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });

    if (!room || room.hotelId !== req.user.hotelId) {
      return res.status(403).json({ msg: "Unauthorized room" });
    }

    const blockDate = normalizeDate(date);
    blockDate.setHours(0,0,0,0);
    
     const start = blockDate;
    const end = new Date(blockDate);
    end.setDate(end.getDate() + 1);
    /* 1️⃣ Count booked rooms for that day */
    const booked = await prisma.booking.aggregate({
      _sum: { roomCount: true },
      where: {
        hotelId: room.hotelId,
        roomType: room.type,
        acType: room.acType,
        checkIn: { lt: end },
        checkOut: { gt: start },
        paymentStatus: { not: "cancelled" }
      }
    });

    const bookedRooms = booked._sum.roomCount || 0;

    /* 2️⃣ Absolute max blockable */
    const maxBlockable = room.totalRooms - bookedRooms;

    if (blockedRooms > maxBlockable) {
      return res.status(400).json({
        msg: `Cannot block more than ${maxBlockable} rooms`
      });
    }

    /* 3️⃣ If admin sets blocked = 0 → remove row */
    if (blockedRooms === 0) {
      await prisma.room_availability.deleteMany({
        where: {
          roomId,
          date: blockDate
        }
      });

      return res.json({ msg: "Blocked rooms cleared" });
    }

    // 🔍 Check if row already exists (DATE-safe)
const existing = await prisma.room_availability.findFirst({
  where: {
    roomId,
    date: new Date(date)
  }
});

if (existing) {
  const dayStart = blockDate;
const dayEnd = new Date(blockDate);
dayEnd.setDate(dayEnd.getDate() + 1);

await prisma.$transaction(async (tx) => {
  // 1️⃣ Try update using DATE RANGE (THIS IS THE KEY FIX)
  const updated = await tx.room_availability.updateMany({
    where: {
      roomId,
      date: new Date(date)
    },
    data: {
      blocked_rooms: blockedRooms,
      updated_at: new Date()
    }
  });

  // 2️⃣ If nothing updated → create
  if (updated.count === 0) {
    await tx.room_availability.create({
      data: {
        roomId,
        hotelId: room.hotelId,
        date: dayStart,
        blocked_rooms: blockedRooms
      }
    });
  }
});
} else {
  // ✅ CREATE new row
  await prisma.room_availability.create({
    data: {
      roomId,
      hotelId: room.hotelId,
      date: new Date(date),
      blocked_rooms: blockedRooms
    }
  });
} 


    return res.json({ msg: "Blocked rooms updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Failed to update blocked rooms" });
  }
});



/**
 * PATCH /api/hotel-admin/rooms/:roomId/adjust
 */
router.patch("/rooms/:id/adjust", auth, hotelAdminOnly, async (req, res) => {
  try {
    const roomId = Number(req.params.id);
    const { totalRooms } = req.body;

    const room = await prisma.room.findUnique({ where: { id: roomId } });

    if (!room || room.hotelId !== req.user.hotelId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await prisma.room.update({
      where: { id: roomId },
      data: { totalRooms }
    });

    res.json({ msg: "Room availability updated" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update room availability" });
  }
});


export default router;
