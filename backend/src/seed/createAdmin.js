import bcrypt from "bcryptjs";
import prisma from "../prisma.js";

async function createAdmin() {
  const email = "admin@flyteo.com";
  const password = "Admin@123";

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
