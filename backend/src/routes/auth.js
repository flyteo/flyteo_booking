import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { sendWelcomeEmail } from "../utils/mailer.js";

const router = express.Router();
const prisma = new PrismaClient();


router.post("/register", async (req, res) => {
  try {
    const { name, email,mobileNo, password, role } = req.body;

    // Check existing user
    const exist = await prisma.user.findUnique({
      where: { email }
    });

    if (exist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobileNo,
        passwordHash: hash,
        role: role || "user"
      }
    });
    
 sendWelcomeEmail({ name, email }).catch(console.error);
    res.json({ msg: "Registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Registration failed" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // JWT token
    const token = jwt.sign(
      {
        id: user.id,          // ✅ Prisma uses id
        email: user.email,
        role: user.role,
        hotelId: user.hotelId // useful for hotel-admin
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        hotelId: user.hotelId
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Login failed" });
  }
});


export default router;
