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
      where: { id: req.user.hotelId },
      include: {
        images: true,
        rooms: true,
        amenities: { include: { amenity: true } },
        offers: { include: { offer: true } },
        coupons: { include: { coupon: true } },
        policies: true,
        safety: true,
        rules: true,
        highlights: true
      }
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
      },
      include: {
        images: true
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

export default router;
