import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

/**
 * GET /api/search
 * ?location=Mumbai&guests=2
 */
router.get("/", async (req, res) => {
  try {
    const { location = "", guests = 1 } = req.query;

    const hotels = await prisma.hotel.findMany({
      where: {
        location: {
          contains: location
        }
      },
      include: {
         hotelamenity: { include: { amenity: true } },
        hotelimage: true,
        room: {
          take: 1,
          orderBy: { price: "asc" }
        }
      }
    });

    const villas = await prisma.villa.findMany({
      where: {
        location: {
          contains: location
        },
        // maxGuests: { gte: Number(guests) }
      },
      include: {
        villaimage: true,
        villalayout: true
      }
    });

    res.json({
      hotels,
      villas
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Search failed" });
  }
});

/**
 * GET /api/offers/active
 */
router.get("/activeoffers", async (req, res) => {
  try {
    const today = new Date();

    const offers = await prisma.offer.findMany({
      where: {
        isActive: true,
        validFrom: { lte: today },
        validTo: { gte: today }
      },
      orderBy: {
        discountPercent: "desc"
      }
    });

    res.status(200).json(offers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch offers" });
  }
});


/**
 * GET /api/coupons/active
 */
router.get("/activecoupons", async (req, res) => {
  try {
    const today = new Date();

    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        validFrom: { lte: today },
        validTo: { gte: today }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(coupons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch coupons" });
  }
});




export default router;
