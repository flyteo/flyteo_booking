import express from "express";
import prisma from "../prisma.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d); // local midnight
}

function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

router.get("/calendar", auth, async (req, res) => {
  const isAdmin = req.user.role === "admin";
  const hotelId = isAdmin
    ? Number(req.query.hotelId)
    : req.user.hotelId;

  // ✅ SAFE parsing
  const from = parseLocalDate(req.query.from);
  const to = parseLocalDate(req.query.to);

  const rooms = await prisma.room.findMany({
    where: { hotelId }
  });

  const bookings = await prisma.booking.findMany({
    where: {
      hotelId,
      checkIn: { lt: to },
      checkOut: { gt: from },
      checkInStatus: { not: "cancelled" }
    }
  });

  const blocks = await prisma.room_availability.findMany({
    where: {
      hotelId,
      date: { gte: from, lte: to }
    }
  });

  const calendar = [];

  for (
    let d = new Date(from);
    d <= to;
    d.setDate(d.getDate() + 1)
  ) {
    const day = new Date(d);

    const dayKey = formatLocalDate(day);

    const dayData = rooms.map(room => {
      const booked = bookings
        .filter(
          b =>
            b.roomType === room.type &&
            day >= b.checkIn &&
            day < b.checkOut
        )
        .reduce((s, b) => s + (b.roomCount || 1), 0);

      const blocked =
        blocks.find(
          b =>
            b.roomId === room.id &&
            formatLocalDate(b.date) === dayKey
        )?.blocked_rooms || 0;

      const available =
        room.totalRooms - booked - blocked;

      return {
        roomId: room.id,
        roomType: room.type,
        total: room.totalRooms,
        booked,
        blocked,
        available,
        status:
          available <= 0
            ? "FULL"
            : blocked === room.totalRooms
            ? "CLOSED"
            : "AVAILABLE"
      };
    });

    calendar.push({
      date: dayKey,   // ✅ NO toISOString
      rooms: dayData
    });
  }

  res.json(calendar);
});


export default router;