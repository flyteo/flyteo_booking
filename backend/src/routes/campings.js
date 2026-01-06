import express from "express";
import prisma from "../prisma.js";
import auth, { adminOnly } from "../middlewares/auth.js";

const router = express.Router();

/* ======================
   GET ALL CAMPINGS
====================== */
router.get("/", async (req, res) => {
  try {
    const campings = await prisma.camping.findMany({
      include: {
        campingimage: true,
        campinginclusion: true,
        campingexclusion: true,
        campingactivity: true,
        campingitinerary: { include: { campingitinerarypoint: true } },
        campingpricing: true
      }
    });

    res.json(campings);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch campings" });
  }
});

/* ======================
   GET SINGLE CAMPING
====================== */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const camping = await prisma.camping.findUnique({
      where: { id },
      include: {
        campingimage: true,
        campinginclusion: true,
        campingexclusion: true,
        campingactivity: true,
        campingitinerary: { include: { campingitinerarypoint: true } },
        campingpricing: true
      }
    });

    if (!camping) return res.status(404).json({ msg: "Camping not found" });

    res.json(camping);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch camping" });
  }
});

/* ======================
   ADD CAMPING
====================== */
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      campingimage,
      campinginclusion,
      campingexclusion,
      campingactivity,
      campingitinerary,
      campingpricing,
      advancePaymentAllowed,
      advancePercent
      // defaultPrice
    } = req.body;

    const camp = await prisma.camping.create({
      data: {
        name,
        description,
        location,
        advancePaymentAllowed: Boolean(advancePaymentAllowed),
      advancePercent:
        advancePaymentAllowed && advancePercent
          ? Number(advancePercent)
          : null,
        // defaultPrice,
        campingimage: {
          create: campingimage?.map((url) => ({ url }))
        },

        campinginclusion: {
          create: campinginclusion?.map((t) => ({ text: t }))
        },

        campingexclusion: {
          create: campingexclusion?.map((t) => ({ text: t }))
        },

        campingactivity: {
          create: campingactivity?.map((t) => ({ text: t }))
        },

        campingitinerary: {
          create: campingitinerary?.map((d) => ({
            day: d.day,
            campingitinerarypoint: {
              create: d.description.map((p) => ({ text: p }))
            }
          }))
        },

        campingpricing: {
          create: Object.entries(campingpricing || {})
            .filter(([_, v]) => v && v.adultPrice !== null)
            .map(([day, v]) => ({
              day,
              adultPrice: Number(v.adultPrice),
              childPrice: Number(v.childPrice)
            }))
        }
      }
    });

    res.json({ msg: "Camping added", camp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Camping add failed" });
  }
});

/* ======================
   UPDATE CAMPING
====================== */
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.camping.update({
      where: { id },
      data: {
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        advancePaymentAllowed: Boolean(advancePaymentAllowed),
    advancePercent:
      advancePaymentAllowed && advancePercent
        ? Number(advancePercent)
        : null,

        campingimage: {
          deleteMany: {},
          create: req.body.campingimage?.map((url) => ({ url }))
        },

        campinginclusion: {
          deleteMany: {},
          create: req.body.campinginclusions?.map((t) => ({ text: t }))
        },

        campingexclusion: {
          deleteMany: {},
          create: req.body.campingexclusions?.map((t) => ({ text: t }))
        },

        campingactivity: {
          deleteMany: {},
          create: req.body.campingactivities?.map((t) => ({ text: t }))
        },

        campingitinerary: {
          deleteMany: {},
          create: req.body.campingitinerary?.map((d) => ({
            day: d.day,
            campingitinerarypoint: {
              create: d.description.map((p) => ({ text: p }))
            }
          }))
        },

        campingpricing: {
          deleteMany: {},
          create: Object.entries(req.body.campingpricing || {}).map(
            ([day, price]) => ({ day, price })
          )
        }
      }
    });

    res.json({ msg: "Camping updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Camping update failed" });
  }
});

/* ======================
   DELETE CAMPING
====================== */
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await prisma.camping.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ msg: "Camping deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
});

export default router;
