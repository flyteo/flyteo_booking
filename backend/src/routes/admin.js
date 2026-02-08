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
/**
 * GET /api/admin/room-availability?hotelId=1&date=2026-01-20
 */
router.get("/room-availability", auth, adminOnly, async (req, res) => {
   const hotelId = Number(req.query.hotelId);
  const date = req.query.date ? new Date(req.query.date) : new Date();;

  try {

    const rooms = await prisma.room.findMany({
      where: { hotelId }
    });

    const bookings = await prisma.booking.findMany({
      where: {
        hotelId,
        checkIn: { lte: date },
        checkOut: { gt: date },
        checkInStatus: { notIn: ["cancelled", "checked_out"] }
      }
    });

    const blocks = await prisma.room_availability.findMany({
      where: {
        hotelId,
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
 * POST /api/admin/room-availability
 */
function normalizeDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);

  // month - 1 because JS months are 0-based
  return new Date(year, month - 1, day);
}

router.post("/room-availability", auth, adminOnly, async (req, res) => {
  try {
    const hotelId=Number(req.body.hotelId);
    const {  roomId, date, blockedRooms } = req.body;

    if (!hotelId || !roomId || !date) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    if (blockedRooms < 0) {
         return res.status(400).json({ msg: "Blocked rooms cannot be negative" });
       }
   
       const room = await prisma.room.findUnique({
         where: { id: roomId }
       });
   
      //  if (!room || hotelId !== req.user.hotelId) {
      //    return res.status(403).json({ msg: "Unauthorized room" });
      //  }
   
       const blockDate = normalizeDate(date);
       blockDate.setHours(0,0,0,0);
       
        const start = blockDate;
       const end = new Date(blockDate);
       end.setDate(end.getDate() + 1);
       /* 1️⃣ Count booked rooms for that day */
       const booked = await prisma.booking.aggregate({
         _sum: { roomCount: true },
         where: {
           hotelId,
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
           hotelId,
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
         hotelId,
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

router.get("/villa-availability", auth, adminOnly, async (req, res) => {
  const { villaId, month, year } = req.query;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  const data = await prisma.villa_availability.findMany({
    where: {
      villaId: Number(villaId),
      date: { gte: start, lte: end }
    }
  });

  res.json(data);
});

router.post("/villa-block-date", auth, adminOnly, async (req, res) => {
  const { villaId, date } = req.body;

  if (!villaId || !date) {
    return res.status(400).json({ msg: "villaId and date required" });
  }

  await prisma.villa_availability.upsert({
    where: {
      villaId_date: {
        villaId: Number(villaId),
        date: new Date(date)
      }
    },
    update: { status: "blocked" },
    create: {
      villaId: Number(villaId),
      date: new Date(date),
      status: "blocked"
    }
  });

  res.json({ msg: "Villa date blocked by admin" });
});

router.delete("/villa-unblock-date", auth, adminOnly, async (req, res) => {
  const { villaId, date } = req.body;

  await prisma.villa_availability.deleteMany({
    where: {
      villaId: Number(villaId),
      date: new Date(date)
    }
  });

  res.json({ msg: "Villa date unblocked by admin" });
});

router.post("/camping-availability/block", auth, adminOnly, async (req, res) => {
  const { campingId, date } = req.body;

  if (!campingId || !date) {
    return res.status(400).json({ msg: "campingId and date required" });
  }

  const d = new Date(date);
  d.setHours(0,0,0,0);

  await prisma.camping_availability.upsert({
    where: {
      campingId_date: {
        campingId: Number(campingId),
        date: new Date(date)
      }
    },
    update: { status: "blocked" },
    create: {
      campingId: Number(campingId),
      date: new Date(date),
      status: "blocked"
    }
  });

  res.json({ msg: "Camping booking blocked for this date" });
});


router.post("/camping-availability/unblock", auth, adminOnly, async (req, res) => {
  const { campingId, date } = req.body;


  await prisma.camping_availability.deleteMany({
    where: {
      campingId: Number(campingId),
      date: new Date(date)
    }
  });

  res.json({ msg: "Camping booking opened for this date" });
});

router.get("/camping-availability", auth, adminOnly, async (req, res) => {
  const { campingId, month, year } = req.query;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  const data = await prisma.camping_availability.findMany({
    where: {
      campingId: Number(campingId),
      date: { gte: start, lte: end }
    }
  });

  res.json(data);
});

export default router;
