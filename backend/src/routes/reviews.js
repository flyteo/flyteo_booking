import express from "express";
import auth from "../middlewares/auth.js";
import prisma from "../prisma.js";

const router = express.Router();

/* =========================
   ADD OR UPDATE REVIEW
========================= */


router.post("/", auth, async (req, res) => {
  try {
    const { type, targetId, rating, comment } = req.body;

    if (!type || !targetId || !rating) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const data = {
      rating,
      comment,
      userId: req.user.id
    };

    if (type === "hotel") data.hotelId = Number(targetId);
    if (type === "camping") data.campingId = Number(targetId);
    if (type === "villa") data.villaId = Number(targetId);

    const review = await prisma.reviews.create({ data });
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Review failed" });
  }
});


/* =========================
   GET HOTEL REVIEWS
========================= */


router.get("/", async (req, res) => {
  try {
    const { type, id } = req.query;

    if (!type || !id) {
      return res.status(400).json({ msg: "type and id are required" });
    }

    let where = {};

    if (type === "hotel") where.hotelId = Number(id);
    if (type === "camping") where.campingId = Number(id);
    if (type === "villa") where.villaId = Number(id);

    const reviews = await prisma.reviews.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load reviews" });
  }
});


export default router;
