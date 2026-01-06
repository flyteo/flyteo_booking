import express from "express";
import auth, { adminOnly } from "../middlewares/auth.js";
import prisma from "../prisma.js";

const router = express.Router();

/* =========================
   CREATE COUPON
========================= */
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const coupon = await prisma.coupon.create({
      data: req.body
    });

    res.json({ msg: "Coupon created", coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Create coupon failed" });
  }
});

/* =========================
   GET ALL COUPONS
========================= */
router.get("/", async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" }
    });

    if (coupons.length === 0) {
      return res.status(404).json({ msg: "No coupons found" });
    }

    res.json(coupons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Fetch failed" });
  }
});

/* =========================
   UPDATE COUPON
========================= */
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const coupon = await prisma.coupon.update({
      where: { id },
      data: req.body
    });

    res.json({ msg: "Coupon updated", coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Update failed" });
  }
});

/* =========================
   DELETE COUPON
========================= */
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.coupon.delete({
      where: { id }
    });

    res.json({ msg: "Coupon deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Delete failed" });
  }
});

export default router;
