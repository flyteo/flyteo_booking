import { Cashfree ,CFEnvironment} from "cashfree-pg";
import express from "express";
import auth from "../middlewares/auth.js";
import prisma from "../prisma.js";
import crypto from "crypto";
const router = express.Router();

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;


function genrateOrderId(){
  const uniqueId=crypto.randomBytes(16).toString('hex');

  const hash = crypto.createHash('sha256');

  hash.update(uniqueId);

  const orderId = hash.digest('hex');
  return orderId.substr(0,12);
}

router.post("/create-order", auth, async (req, res) => {
  try {
     const {
    type,
    hotel,
    villa,
    camping,
    roomType,
    acType,
    checkIn,
    checkOut,
    guests,
    roomCount,
    fullname,
    mobileno,
    totalAmount,
    paymentChoice
  } = req.body;

   const checkInDate = new Date(checkIn);
  const checkOutDate = checkOut ? new Date(checkOut) : null;
  const booking = await prisma.$transaction(async (tx) => {

      /* ==========================
         HOTEL AVAILABILITY CHECK
      ========================== */
      if (type === "hotel") {
        if (!roomCount || roomCount < 1) {
          throw new Error("Invalid room count");
        }

        const room = await tx.room.findFirst({
          where: {
            hotelId: Number(hotel),
            type: roomType,
            acType
          }
        });

        if (!room) throw new Error("Invalid room selected");

        // 🔹 Booked rooms
        const booked = await tx.booking.aggregate({
          _sum: { roomCount: true },
          where: {
            hotelId: Number(hotel),
            roomType,
            acType,
            paymentStatus: { not: "cancelled" },
            AND: [
              { checkIn: { lt: checkOutDate } },
              { checkOut: { gt: checkInDate } }
            ]
          }
        });

        const bookedRooms = booked._sum.roomCount || 0;

        // 🔹 Blocked rooms (admin / hotel-admin)
        const blocked = await tx.room_availability.findMany({
          where: {
            roomId: room.id,
            date: {
              gte: checkInDate,
              lt: checkOutDate
            }
          },
          select: { blocked_rooms: true }
        });

        // 🔹 Find max blocked on any day (safe rule)
const blockedRooms = blocked.reduce(
  (max, b) => Math.max(max, b.blocked_rooms),
  0
);

        const availableRooms =
          room.totalRooms - bookedRooms - blockedRooms;

        if (roomCount > availableRooms) {
          throw new Error(
            `Only ${availableRooms} room(s) available`
          );
        }

        const maxGuests = room.maxPersons * roomCount;
        if (guests > maxGuests) {
          throw new Error(
            `Maximum ${maxGuests} guests allowed`
          );
        }
      }

      /* ==========================
         VILLA AVAILABILITY CHECK
      ========================== */
      if (type === "villa") {
        const overlappingBooking = await tx.booking.findFirst({
          where: {
            villaId: Number(villa),
            paymentStatus: { not: "cancelled" },
            AND: [
              { checkIn: { lt: checkOutDate } },
              { checkOut: { gt: checkInDate } }
            ]
          }
        });

        if (overlappingBooking) {
          throw new Error("Villa not available for selected dates");
        }

        const blocked = await tx.villa_availability.findFirst({
          where: {
            villaId: Number(villa),
            date: {
              gte: checkInDate,
              lt: checkOutDate
            },
            status:"blocked"
          }
        });

        if (blocked) {
          throw new Error("Villa Sold Out / Blocked for selected date");
        }
      }

      if (type === "camping") {
  const blocked = await prisma.camping_availability.findFirst({
    where: {
      campingId: Number(camping),
      date: checkInDate,
      status: "blocked"
    }
  });

  if (blocked) {
    throw new Error("Camping not available on selected date");
  }
}

      /* ==========================
         ADVANCE PAYMENT
      ========================== */
      let advanceAllowed = false;
      let advancePercent = null;

      if (type === "hotel") {
        const h = await tx.hotel.findUnique({
          where: { id: Number(hotel) },
          select: {
            advancePaymentAllowed: true,
            advancePercent: true
          }
        });
        advanceAllowed = h?.advancePaymentAllowed;
        advancePercent = h?.advancePercent;
      }
      
       if (type === "camping" && camping) {
      const c = await prisma.camping.findUnique({
        where: { id: Number(camping) },
        select: { advancePaymentAllowed: true, advancePercent: true }
      });
      advanceAllowed = c?.advancePaymentAllowed || false;
      advancePercent = c?.advancePercent ?? null;
    }

      if (type === "villa") {
        const v = await tx.villa.findUnique({
          where: { id: Number(villa) },
          select: {
            advancePaymentAllowed: true,
            advancePercent: true
          }
        });
        advanceAllowed = v?.advancePaymentAllowed;
        advancePercent = v?.advancePercent;
      }

      let paidAmount = totalAmount;
      let paymentType = "full";
      let remainingAmount = 0;
      let paymentStatus = "paid";

      if (advanceAllowed && paymentChoice === "advance") {
        const percent =Number(advancePercent || 0)
        paidAmount = Math.round((totalAmount * percent) / 100);
        remainingAmount = totalAmount - paidAmount;
        paymentType = "partial";
        paymentStatus = "partial";
      }

      /* ==========================
         CREATE BOOKING
      ========================== */
      return await tx.booking.create({
        data: {
          type,
          roomType,
          acType,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests,
          fullname,
          mobileno,
          roomCount,

          totalAmount,
          remainingAmount,
          paidAmount,
          paymentType,
          paymentStatus,
          advancePercent,
          paymentChoice,

          user: { connect: { id: req.user.id } },

          ...(type === "hotel"
            ? { hotel: { connect: { id: Number(hotel) } } }
            : {}),
          ...(type === "villa"
            ? { villa: { connect: { id: Number(villa) } } }
            : {}),
          ...(type === "camping" 
            ? { camping: { connect: { id: Number(camping) } } }
            : {}),
        }
      });
    });

    let payNowAmount = totalAmount;
    let remainingAmount = 0;

    if (paymentChoice === "advance") {
      const percent = 20; // fetch dynamically
      payNowAmount = Math.round((totalAmount * percent) / 100);
      remainingAmount = totalAmount - payNowAmount;
    }
    const orderID = await genrateOrderId();
// Save temp order (IMPORTANT)
  // await prisma.payment_order.create({
  //   data: {
  //     orderId: orderID,
  //     userId: req.user.id,
  //     payload: req.body, // store full booking payload
  //     amount: totalAmount,
  //     status: "PENDING"
  //   }
  // });
  
    const response = await Cashfree.PGCreateOrder({
      order_id: orderID,
      order_amount: payNowAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: String(req.user.id),
        customer_name: fullname,
        customer_phone: mobileno,
        customer_email: "test@gmail.com"
      }
    });


    res.json({
      payment_session_id: response.data.payment_session_id,orderID
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create payment order" });
  }
});

router.post("/cashfree/webhook", async (req, res) => {
  try {
    const event = req.body;

    if (event.type !== "PAYMENT_SUCCESS") {
      return res.sendStatus(200);
    }

    const orderId = event.data.order.order_id;
    const paidAmount = Number(event.data.payment.payment_amount);

    const pending = await prisma.pending_payment.findUnique({
      where: { orderId }
    });

    if (!pending) return res.sendStatus(200);

    const payload = JSON.parse(pending.payload);

    await prisma.booking.create({
      data: {
        ...payload,
        paidAmount,
        remainingAmount: pending.remainingAmount,
        paymentStatus:
          pending.remainingAmount === 0 ? "paid" : "partial",
        paymentType:
          pending.remainingAmount === 0 ? "full" : "partial"
      }
    });

    await prisma.pending_payment.delete({
      where: { orderId }
    });

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});


export default router;