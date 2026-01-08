import bcrypt from "bcryptjs";
import prisma from "../prisma.js";
import dotnenv from "dotenv";
dotnenv.config();

async function createAdmin() {
  const email = process.env.ADMIN_ID ;
  const password = process.env.ADMIN_PASS;

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email,
      passwordHash: hash,
      role: "admin"
    }
  });

  console.log("Admin created:", admin.email);
  process.exit(0);
}

createAdmin();
