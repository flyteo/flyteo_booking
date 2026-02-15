import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ msg: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
}


export const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: "Not logged in" });
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Admin Only Access" });

  next();
};
export const hotelAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: "Not logged in" });
  }

  if (req.user.role !== "hotel-admin") {
    return res.status(403).json({ msg: "Hotel admin access only" });
  }

  if (!req.user.hotelId) {
    return res.status(403).json({ msg: "Hotel not assigned" });
  }

  next();
};
export const villaAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: "Not logged in" });
  }

  if (req.user.role !== "villa-admin") {
    return res.status(403).json({ msg: "Villa admin access only" });
  }

  if (!req.user.villaId) {
    return res.status(403).json({ msg: "Villa not assigned" });
  }

  next();
};
