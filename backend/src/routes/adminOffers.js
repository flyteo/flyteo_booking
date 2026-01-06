import express from "express";
import auth, { adminOnly } from "../middlewares/auth.js";
import prisma from "../prisma.js";

const router = express.Router();

/* =========================
   CREATE OFFER
========================= */
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const offer = await prisma.offer.create({
      data: req.body
    });

    res.json({ msg: "Offer created", offer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Create offer failed" });
  }
});

/* =========================
   GET ALL OFFERS
========================= */
router.get("/", async (req, res) => {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: "desc" }
    });

    if (offers.length === 0) {
      return res.status(404).json({ msg: "No offers found" });
    }

    res.json(offers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Fetch failed" });
  }
});

/* =========================
   UPDATE OFFER
========================= */
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const offer = await prisma.offer.update({
      where: { id },
      data: req.body
    });

    res.json({ msg: "Offer updated", offer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Update failed" });
  }
});

/* =========================
   DELETE OFFER
========================= */
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.offer.delete({
      where: { id }
    });

    res.json({ msg: "Offer deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Delete failed" });
  }
});

export default router;
