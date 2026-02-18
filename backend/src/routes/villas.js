import express from "express";
import auth, { adminOnly } from "../middlewares/auth.js";
import prisma from '../prisma.js';
import bcrypt from "bcryptjs";

const router = express.Router();



router.get("/", async (req, res) => {
  try {
    const villas = await prisma.villa.findMany({
      include: {
        villaimage: true,
        villalayout: true,

        // ✅ AMENITIES
        villaamenity: {
          include: {
            amenity: true
          }
        },

        // ✅ OFFERS
        villaoffer: {
          include: {
            offer: true
          }
        },

        // ✅ COUPONS
        villacoupon: {
          include: {
            coupon: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(villas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch villas" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const villa = await prisma.villa.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        villaimage: true,
        villalayout: true,
        day_wise_percentage:true,

        // ✅ AMENITIES
        villaamenity: {
          include: {
            amenity: true
          }
        },

        // ✅ OFFERS
        villaoffer: {
          include: {
            offer: true
          }
        },

        // ✅ COUPONS
        villacoupon: {
          include: {
            coupon: true
          }
        }
      }
    });

    if (!villa) {
      return res.status(404).json({ msg: "Villa not found" });
    }

    res.json(villa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load villa" });
  }
});

router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      email,
      address,
      taxes,
      mapLocation,
      discount,
      advancePaymentAllowed,
      advancePercent,
      dayWisePercentage,

      maxGuests,
      includedGuests,
      basePrice,
      extraGuestPrice,

      checkInTime,
      checkOutTime,
      cancellationPolicy,
      securityDeposit,
      adminEmail,
      adminPassword,

      images = [],
      villaoffer = [],
      villacoupon = [],
      villaamenity = [],
      layout
    } = req.body;

const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const resultVilla = await prisma.$transaction(async (tx) => {
    const villa = await prisma.villa.create({
      data: {
        name,
        description,
        location,
        email,
        taxes:Number(taxes),
         advancePaymentAllowed: Boolean(advancePaymentAllowed),
      advancePercent:
        advancePaymentAllowed && advancePercent
          ? Number(advancePercent)
          : null,
        address,
        mapLocation,
        discount: Number(discount),
          villaamenity: villaamenity?.length
  ? {
      create: villaamenity.map(id => ({
        amenity: { connect: { id: Number(id) } }
      }))
    }
  : undefined,

        // ✅ CAST NUMBERS
        maxGuests: Number(maxGuests),
        includedGuests: Number(includedGuests),
        basePrice: Number(basePrice),
        extraGuestPrice: Number(extraGuestPrice),

        checkInTime: checkInTime || null,
        checkOutTime: checkOutTime || null,
        cancellationPolicy: cancellationPolicy || null,
        securityDeposit: securityDeposit
          ? Number(securityDeposit)
          : null,

        villaimage: images.length
          ? {
              create: images.map(url => ({ url }))
            }
          : undefined,


        villalayout: layout
          ? {
              create: {
                bedrooms: Number(layout.bedrooms),
                bathrooms: Number(layout.bathrooms),
                beds: Number(layout.beds),
                livingRoom: Boolean(layout.livingRoom),
                kitchen: Boolean(layout.kitchen),
                privatePool: Boolean(layout.privatePool),
                garden: Boolean(layout.garden),
                parkingSlots: layout.parkingSlots
                  ? Number(layout.parkingSlots)
                  : null
              }
            }
          : undefined,
            villaoffer: villaoffer?.length
  ? {
      create: villaoffer.map(id => ({
        offer: { connect: { id: Number(id) } }
      }))
    }
  : undefined,

          villacoupon: villacoupon?.length
  ? {
      create: villacoupon.map(id => ({
        coupon: { connect: { id: Number(id) } }
      }))
    }
  : undefined,
day_wise_percentage: dayWisePercentage
          ? {
              create: Object.entries(dayWisePercentage)
                .filter(([_, v]) => Number(v) > 0)
                .map(([day, percentage]) => ({
                  day,
                  percentage: Number(percentage)
                }))
            }
          : undefined
  
      }
    });

     const villaAdmin = await tx.user.create({
        data: {
          name: `${name} Villa Admin`,
          email: adminEmail,
          passwordHash: hashedPassword,
          role: "villa-admin",
          villaId: villa.id
        }
      });

      await tx.user.update({
    where: { id: villaAdmin.id },
    data: {
      villaId: villa.id
    }
  });

      return villa;
  })

      res.json({ msg: "Villa added successfully", villa: resultVilla });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Villa creation failed" });
  }
});



router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const villaId = Number(req.params.id);
    const {
      name,
      description,
      location,
      address,
      email,
      taxes,
      mapLocation,
      discount,
      advancePaymentAllowed,
      advancePercent,

      maxGuests,
      includedGuests,
      basePrice,
      extraGuestPrice,
      dayWisePercentage,

      checkInTime,
      checkOutTime,
      cancellationPolicy,
      securityDeposit,

      images = [],
      villaoffer = [],
      villacoupon = [],
      villaamenity = [],
      layout
    } = req.body;

    await prisma.villa.update({
      where: { id: villaId },
      data: {
        name,
        description,
        location,
        address,
        email,
        mapLocation,
        taxes,
        discount: Number(discount),
        advancePaymentAllowed: Boolean(advancePaymentAllowed),
    advancePercent:
      advancePaymentAllowed && advancePercent
        ? Number(advancePercent)
        : null,

        maxGuests: Number(maxGuests),
        includedGuests: Number(includedGuests),
        basePrice: Number(basePrice),
        extraGuestPrice: Number(extraGuestPrice),

        checkInTime: checkInTime || null,
        checkOutTime: checkOutTime || null,
        cancellationPolicy: cancellationPolicy || null,
        securityDeposit: securityDeposit
          ? Number(securityDeposit)
          : null,

        villaimage: {
          deleteMany: {},
          create: images.map(url => ({ url }))
        },
         // ✅ villaamenity (M:N)
        villaamenity: villaamenity
          ? {
              deleteMany: {},
              create: villaamenity.map((amenityId) => ({
                amenity: { connect: { id: amenityId } }
              }))
            }
          : undefined,

        // ✅ Offers
        villaoffer: villaoffer
          ? {
              deleteMany: {},
              create: villaoffer.map((offerId) => ({
                offer: { connect: { id: offerId } }
              }))
            }
          : undefined,

        // ✅ Coupons
        villacoupon: villacoupon
          ? {
              deleteMany: {},
              create: villacoupon.map((couponId) => ({
                coupon: { connect: { id: couponId } }
              }))
            }
          : undefined,

        villalayout: layout
          ? {
              upsert: {
                create: {
                  bedrooms: Number(layout.bedrooms),
                  bathrooms: Number(layout.bathrooms),
                  beds: Number(layout.beds),
                  livingRoom: Boolean(layout.livingRoom),
                  kitchen: Boolean(layout.kitchen),
                  privatePool: Boolean(layout.privatePool),
                  garden: Boolean(layout.garden),
                  parkingSlots: layout.parkingSlots
                    ? Number(layout.parkingSlots)
                    : null
                },
                update: {
                  bedrooms: Number(layout.bedrooms),
                  bathrooms: Number(layout.bathrooms),
                  beds: Number(layout.beds),
                  livingRoom: Boolean(layout.livingRoom),
                  kitchen: Boolean(layout.kitchen),
                  privatePool: Boolean(layout.privatePool),
                  garden: Boolean(layout.garden),
                  parkingSlots: layout.parkingSlots
                    ? Number(layout.parkingSlots)
                    : null
                }
              }
            }
          : undefined,
          day_wise_percentage: {
          deleteMany: {},
          create: Object.entries(dayWisePercentage || {}).map(
            ([day, percentage]) => ({ day, percentage })
          )
        },

      }
    });

    res.json({ msg: "Villa updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Villa update failed" });
  }
});



router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const villaId = Number(req.params.id);

   await prisma.booking.deleteMany({
  where: { villaId }
});

await prisma.villa.delete({
  where: { id: villaId }
});


    res.json({ msg: "Villa deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Villa delete failed" });
  }
});



export default router;