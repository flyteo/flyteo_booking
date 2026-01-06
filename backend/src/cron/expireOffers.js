import cron from "node-cron";
import prisma from "../prisma.js";

cron.schedule("0 0 * * *", async () => {
  const now = new Date();

  // ✅ Expire Offers
  const expiredOffers = await prisma.offer.updateMany({
    where: {
      validTo: { lt: now },
      isActive: true
    },
    data: { isActive: false }
  });

  // ✅ Expire Coupons
  const expiredCoupons = await prisma.coupon.updateMany({
    where: {
      validTo: { lt: now },
      isActive: true
    },
    data: { isActive: false }
  });

  console.log(
    `Cron done → Offers expired: ${expiredOffers.count}, Coupons expired: ${expiredCoupons.count}`
  );
});
