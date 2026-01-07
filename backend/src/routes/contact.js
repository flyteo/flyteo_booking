// routes/contact.js
import express from "express";
import prisma from "../prisma.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, mobileNo, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    const contact = await prisma.contactmessage.create({
      data: {
        name,
        email,
        mobileNo,
        subject,
        message
      }
    });

    res.json({ msg: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send message" });
  }
});

router.put("/:id/resolve", auth, async (req, res) => {
  await prisma.contactmessage.update({
    where: { id: Number(req.params.id) },
    data: { isResolved: true }
  });

  res.json({ msg: "Marked as resolved" });
});


export default router;
