import { Cashfree ,CFEnvironment} from "cashfree-pg";
import express, { request } from "express";
import auth from "../middlewares/auth.js";
import prisma from "../prisma.js";
import crypto from "crypto";
import { type } from "os";
const router = express.Router();

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);


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
     

      /* ==========================
         CREATE BOOKING
      ========================== */
      
    });
      let advanceAllowed = false;
      let advancePercent = null;

      if (type === "hotel") {
        const h = await prisma.hotel.findUnique({
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
        const v = await prisma.villa.findUnique({
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
     let payNowAmount = totalAmount;
    // let remainingAmount = 0;
    // let paymentType = "full";

    if (advanceAllowed && paymentChoice === "advance") {
      payNowAmount = Math.round((totalAmount * advancePercent) / 100);
      remainingAmount = totalAmount - payNowAmount;
      paymentType = "partial";
    }

    const orderID = await genrateOrderId();
// Save temp order (IMPORTANT)
  await prisma.payment_order.create({
    data: {
      orderId: orderID,
      userId: req.user.id,
      payload: req.body, // store full booking payload
      amount: totalAmount,
      status: "PENDING"
    }
  });
  const orderCashfree={
      order_id: orderID,
      order_amount: payNowAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: String(req.user.id),
        customer_name: fullname,
        customer_phone: `+91${mobileno}`,
      order_meta:{
        return_url:`${process.env.FRONTEND_URL_FLYTEO}/payment-success?order_id=${orderID}`
      }
  }
}
    const response = await cashfree.PGCreateOrder(orderCashfree);

    res.json({
      payment_session_id: response.data.payment_session_id,
      orderID
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create payment order" });
  }
});
// router.post("/create-order", auth, async (req, res) => {
//   try {
//     const { totalAmount, payload } = req.body;

//     if (!totalAmount || totalAmount <= 0) {
//       return res.status(400).json({ msg: "Invalid amount" });
//     }

//     const orderId = await genrateOrderId();

//     // 🔒 Save payment intent (NO booking yet)
//     await prisma.payment_order.create({
//       data: {
//         orderId,
//         userId: req.user.id,
//         payload,
//         amount: totalAmount
//       }
//     });

//     const response = await cashfree.PGCreateOrder({
//       order_id: orderId,
//       order_amount: Number(totalAmount),
//       order_currency: "INR",
//       customer_details: {
//         customer_id: String(req.user.id),
//         customer_name: payload.fullname,
//         customer_email: req.user.email || "test@flyteo.in",
//         customer_phone: payload.mobileno
//       }
//     });

//     res.json({
//       payment_session_id: response.data.payment_session_id,
//       orderId
//     });

//   } catch (err) {
//     console.error("Cashfree error:", err.response?.data || err);
//     res.status(500).json({ msg: "Payment initiation failed" });
//   }
// });

// router.post("/cashfree/webhook", async (req, res) => {
//   try {
//     const event = req.body;

//     if (event.type !== "PAYMENT_SUCCESS") {
//       return res.sendStatus(200);
//     }

//     const orderId = event.data.order.order_id;
//     const paidAmount = Number(event.data.payment.payment_amount);

//     const pending = await prisma.pending_payment.findUnique({
//       where: { orderId }
//     });

//     if (!pending) return res.sendStatus(200);

//     const payload = JSON.parse(pending.payload);

//     await prisma.booking.create({
//       data: {
//         ...payload,
//         paidAmount,
//         remainingAmount: pending.remainingAmount,
//         paymentStatus:
//           pending.remainingAmount === 0 ? "paid" : "partial",
//         paymentType:
//           pending.remainingAmount === 0 ? "full" : "partial"
//       }
//     });

//     await prisma.pending_payment.delete({
//       where: { orderId }
//     });

//     res.sendStatus(200);
//   } catch (err) {
//     console.error("Webhook error:", err);
//     res.sendStatus(500);
//   }
// });

router.post("/webhook", async (req, res) => {
  try {

    const event = req.body;

    if (event.type !== "PAYMENT_SUCCESS_WEBHOOK") {
      return res.sendStatus(200);
    }

    const orderId = event.data.order.order_id;

    const paymentOrder = await prisma.payment_order.findUnique({
      where: { orderId }
    });

    if (!paymentOrder || paymentOrder.status === "PAID") {
      return res.sendStatus(200);
    }

    const payload = paymentOrder.payload;

    const totalAmount = payload.totalAmount;
    const paidAmount = event.data.payment.payment_amount;

    let remainingAmount = totalAmount - paidAmount;
    let paymentType = remainingAmount > 0 ? "partial" : "full";
    let paymentStatus = remainingAmount > 0 ? "partial" : "paid";

    /* ==========================
       CREATE REAL BOOKING
    ========================== */

   const booking = await prisma.booking.create({
  data: {
    type: payload.type,
    roomType: payload.roomType,
    acType: payload.acType,
    checkIn: new Date(payload.checkIn),
    checkOut: payload.checkOut ? new Date(payload.checkOut) : null,
    guests: payload.guests,
    fullname: payload.fullname,
    mobileno: payload.mobileno,
    roomCount: payload.roomCount,

    totalAmount: payload.totalAmount,
    paidAmount,
    remainingAmount,
    paymentType,
    paymentStatus,
    paymentChoice: payload.paymentChoice,

    user: { connect: { id: paymentOrder.userId } },

    ...(payload.type === "hotel"
      ? { hotel: { connect: { id: Number(payload.hotel) } } }
      : {}),
    ...(payload.type === "villa"
      ? { villa: { connect: { id: Number(payload.villa) } } }
      : {}),
    ...(payload.type === "camping"
      ? { camping: { connect: { id: Number(payload.camping) } } }
      : {}),
  },
  include: {
    hotel: { select: { name: true } },
    villa: { select: { name: true } },
    camping: { select: { name: true } },
    user: { select: { email: true } }
  }
});


    await prisma.payment_order.update({
      where: { orderId },
      data: {
        status: "PAID",
        bookingId: booking.id
      }
    });
   const propertyName =
  booking.hotel?.name ||
  booking.villa?.name ||
  booking.camping?.name ||
  "Flyteo Property";


    await sendBookingConfirmationEmail({
  name: booking.fullname,
  email: booking.user.email,
  bookingId: booking.id,
  type: booking.type,
  propertyName,
  checkIn: booking.checkIn,
  checkOut: booking.checkOut,
  guests: booking.guests,
  totalAmount: booking.totalAmount,
  paidAmount: booking.paidAmount,
  remainingAmount: booking.remainingAmount,
  paymentType: booking.paymentType
});


    res.sendStatus(200);

  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

router.get("/payment/status/:orderId", async (req, res) => {

  const order = await prisma.payment_order.findUnique({
    where: { orderId: req.params.orderId },
    include: { booking: true }
  });

  if (!order) {
    return res.status(404).json({ msg: "Order not found" });
  }

  res.json(order);
});

export default router;
