import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Storage: save files in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // backend/uploads folder
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_")
    );
  }
});

const upload = multer({ storage });

// POST /api/upload
router.post("/", upload.single("image"), (req, res) => {
  const fileUrl = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

export default router;
