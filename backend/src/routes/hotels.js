import express from "express";
import Hotel from "../models/Hotel.js";
import auth, { adminOnly } from "../middlewares/auth.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
// import slugify from "slugify";
import generateUniqueSlug from "../seed/generateSlug.js";
import prisma from '../prisma.js';

const router = express.Router();

router.get("/amenities", async (req, res) => {
  const amenities = await prisma.amenity.findMany({
    orderBy: { name: "asc" }
  });
  res.json(amenities);
});

router.get("/", async (req, res) => {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        hotelimage: true,
        room: true,
        hotelamenity: { include: { amenity: true } },
        hoteloffer: { include: { offer: true } },
        hotelcoupon: { include: { coupon: true } },
        // rating: true
      }
    });

    res.json(hotels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch hotels" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const hotelId = Number(req.params.id);

    if (!hotelId || isNaN(hotelId)) {
      return res.status(400).json({ msg: "Invalid hotel ID" });
    }

    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        hotelimage: true,
        room: { include: { roomimage: true } },
        hotelamenity: { include: { amenity: true } },
        hoteloffer: { include: { offer: true } },
        hotelcoupon: { include: { coupon: true } },
        hotelpolicy: true,
        hotelsafety: true,
        hotelrule: true,
        hotelhighlight: true
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

// ADD HOTEL
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const {
      name,
      location,
      description,
      phone,
      email,
      address,
      taxes,
      mapLocation,
      nearby,
      hotelamenity,
      hotelimage,
      room,
      hotelhighlight,
      adminEmail,
      adminPassword,
      hotelType,
      starCategory,
      discount,
      hotelpolicy,
      hotelsafety,
      hotelrule,
      hoteloffer,
      hotelcoupon,
      advancePaymentAllowed,
      advancePercent
    } = req.body;

    if (!name || !location || !description) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    if (!adminEmail || !adminPassword) {
      return res.status(400).json({ msg: "Admin email & password required" });
    }

    const slug = await generateUniqueSlug(name);
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const result = await prisma.$transaction(async (tx) => {
      const hotel = await tx.hotel.create({
        data: {
          name,
          location,
          description,
          phone,
          email,
          address,
          mapLocation,
          nearby,
          hotelType,
          starCategory,
          discount,
          taxes,
          slug,
           advancePaymentAllowed: Boolean(advancePaymentAllowed),
      advancePercent:
        advancePaymentAllowed && advancePercent
          ? Number(advancePercent)
          : null,

         hotelamenity: hotelamenity?.length
  ? {
      create: hotelamenity.map(id => ({
        amenity: { connect: { id: Number(id) } }
      }))
    }
  : undefined,

          hotelimage: {
            create: hotelimage?.map((url) => ({ url }))
          },

          room: {
            create: room?.map((r) => ({
              type: r.type,
              acType: r.acType,
              price: r.price,
              maxPersons: r.maxPersons,
              totalRooms: r.totalRooms,
               roomimage: r.roomimage?.length
      ? {
          create: r.roomimage.map((url) => ({ url }))
        }
      : undefined
  
            }))
          },

          hotelhighlight: {
            create: hotelhighlight?.map((text) => ({ text }))
          },

          hotelpolicy: hotelpolicy ? { create: hotelpolicy } : undefined,
          hotelsafety: hotelsafety ? { create: hotelsafety } : undefined,
          hotelrule: hotelrule ? { create: hotelrule } : undefined,

          hoteloffer: hoteloffer?.length
  ? {
      create: hoteloffer.map(id => ({
        offer: { connect: { id: Number(id) } }
      }))
    }
  : undefined,

          hotelcoupon: hotelcoupon?.length
  ? {
      create: hotelcoupon.map(id => ({
        coupon: { connect: { id: Number(id) } }
      }))
    }
  : undefined,

        }
      });

      const hotelAdmin = await tx.user.create({
        data: {
          name: `${name} Hotel Admin`,
          email: adminEmail,
          passwordHash: hashedPassword,
          role: "hotel-admin",
          hotelId: hotel.id
        }
      });

      await tx.user.update({
    where: { id: hotelAdmin.id },
    data: {
      hotelId: hotel.id
    }
  });

      return hotel;
    });

    res.json({ msg: "Hotel added successfully", hotel: result });

  } catch (err) {
    console.error("Add Hotel Error:", err);
    res.status(500).json({ msg: err.message });
  }
});



// UPDATE HOTEL (SAFELY)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const hotelId = Number(req.params.id);

    const {
      name,
      location,
      description,
      address,
      phone,
      email,
      mapLocation,
      nearby,
      discount,
      taxes,
      advancePaymentAllowed,
      advancePercent,

      hotelamenity, // [amenityId]
      hoteloffer,    // [offerId]
      hotelcoupon,   // [couponId]
      room,
      hotelimage,

      hotelpolicy,
      hotelsafety,
      hotelrule
    } = req.body;

    await prisma.hotel.update({
      where: { id: hotelId },
      data: {
        name,
        location,
        description,
        address,
        phone,
        email,
        mapLocation,
        nearby,
        discount,
        taxes,
        advancePaymentAllowed: Boolean(advancePaymentAllowed),
       advancePercent:
       advancePaymentAllowed && advancePercent
        ? Number(advancePercent)
        : null,

        // ✅ hotelamenity (M:N)
        hotelamenity: hotelamenity
          ? {
              deleteMany: {},
              create: hotelamenity.map((amenityId) => ({
                amenity: { connect: { id: amenityId } }
              }))
            }
          : undefined,

        // ✅ Offers
        hoteloffer: hoteloffer
          ? {
              deleteMany: {},
              create: hoteloffer.map((offerId) => ({
                offer: { connect: { id: offerId } }
              }))
            }
          : undefined,

        // ✅ Coupons
        hotelcoupon: hotelcoupon
          ? {
              deleteMany: {},
              create: hotelcoupon.map((couponId) => ({
                coupon: { connect: { id: couponId } }
              }))
            }
          : undefined,

        // ✅ Rooms
      room: {
  deleteMany: {},
  create: room?.map((r) => ({
     type: r.type,
      acType: r.acType,
      price: Number(r.price),
      maxPersons: Number(r.maxPersons),
      totalRooms: Number(r.totalRooms),
    roomimage: r.roomimage?.length
      ? { create: r.roomimage }
      : undefined
  }))
},
        // ✅ Images
      hotelimage: hotelimage
  ? {
      deleteMany: {},
      create: hotelimage.map((img) => ({ url: img.url ?? img }))
    }
  : undefined,


        // ✅ One-to-one tables
     hotelpolicy: hotelpolicy
  ? {
      upsert: {
        create: {
          checkIn: hotelpolicy.checkIn,
          checkOut: hotelpolicy.checkOut,
          cancellationPolicy: hotelpolicy.cancellationPolicy,
          childPolicy: hotelpolicy.childPolicy,
          petPolicy: hotelpolicy.petPolicy,
          coupleFriendly: hotelpolicy.coupleFriendly
        },
        update: {
          checkIn: hotelpolicy.checkIn,
          checkOut: hotelpolicy.checkOut,
          cancellationPolicy: hotelpolicy.cancellationPolicy,
          childPolicy: hotelpolicy.childPolicy,
          petPolicy: hotelpolicy.petPolicy,
          coupleFriendly: hotelpolicy.coupleFriendly
        }
      }
    }
  : undefined,


      hotelsafety: hotelsafety
  ? {
      upsert: {
        create: {
          sanitizedRooms: hotelsafety.sanitizedRooms,
          staffVaccinated: hotelsafety.staffVaccinated,
          fireSafety: hotelsafety.fireSafety,
          cctv: hotelsafety.cctv,
          contactlessCheckin: hotelsafety.contactlessCheckin
        },
        update: {
          sanitizedRooms: hotelsafety.sanitizedRooms,
          staffVaccinated: hotelsafety.staffVaccinated,
          fireSafety: hotelsafety.fireSafety,
          cctv: hotelsafety.cctv,
          contactlessCheckin: hotelsafety.contactlessCheckin
        }
      }
    }
  : undefined,


       hotelrule: hotelrule
  ? {
      upsert: {
        create: {
          smokingAllowed: hotelrule.smokingAllowed,
          alcoholAllowed: hotelrule.alcoholAllowed,
          visitorsAllowed: hotelrule.visitorsAllowed,
          loudMusicAllowed: hotelrule.loudMusicAllowed
        },
        update: {
          smokingAllowed: hotelrule.smokingAllowed,
          alcoholAllowed: hotelrule.alcoholAllowed,
          visitorsAllowed: hotelrule.visitorsAllowed,
          loudMusicAllowed: hotelrule.loudMusicAllowed
        }
      }
    }
  : undefined,

      }
    });

    res.json({ msg: "Hotel updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Hotel update failed" });
  }
});




// DELETE HOTEL
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const hotelId = Number(req.params.id);

    await prisma.hotel.delete({
      where: { id: hotelId }
    });

    res.json({ msg: "Hotel deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Delete failed" });
  }
});

router.get("/recommend", async (req, res) => {
  try {
    const {
      hotelId,
      location,
      nearby,
      minPrice,
      maxPrice
    } = req.query;

    const priceFilter =
      minPrice || maxPrice
        ? {
            room: {
              some: {
                price: {
                  gte: minPrice ? Number(minPrice) : 0,
                  lte: maxPrice ? Number(maxPrice) : 999999
                }
              }
            }
          }
        : {};

    const hotels = await prisma.hotel.findMany({
      where: {
        id: { not: Number(hotelId) },

        AND: [
          // 🟢 SAME LOCATION
          location ? { location } : {},

          // 🟢 NEARBY MATCH (OPTIONAL)
          nearby ? { nearby: { contains: nearby } } : {},

          priceFilter
        ]
      },

      include: {
        hotelimage: true,
        room: {
          take: 1,
          orderBy: { price: "asc" }
        }
      },

      take: 6,
      orderBy: { createdAt: "desc" }
    });

    res.json(hotels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load recommendations" });
  }
});


export default router;
