import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { sendWelcomeEmail } from "../utils/mailer.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/me", async (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ msg: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        mobileNo: true,
        role: true,
        hotelId: true,
        villaId: true
      }
    });

    res.json(user);
    // res.json(decoded);
    
  } catch {
    return res.status(401).json({ msg: "Invalid token" });
  }
});

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
    
 sendWelcomeEmail({ name, email ,password}).catch(console.error);
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

    // Access Token (short-lived)
    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
        hotelId: user.hotelId,
        villaId: user.villaId
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Refresh Token (long-lived)
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,        // true in production
      sameSite: "Strict",  // or "None" if cross-domain
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,        // true in production
      sameSite: "Strict",  // or "None" if cross-domain
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        hotelId: user.hotelId,
        villaId: user.villaId
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Login failed" });
  }
});

router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ msg: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000
    });

    res.json({ msg: "Token refreshed" });

  } catch {
    return res.status(403).json({ msg: "Invalid refresh token" });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ msg: "Logged out successfully" });
});


export default router;
