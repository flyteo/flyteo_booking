import PDFDocument from "pdfkit";

export const generateBookingInvoice = (booking, res) => {
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Flyteo-Invoice-${booking.id}.pdf`
  );

  doc.pipe(res);

  /* ======================
     HEADER
  ====================== */
  doc
    .fontSize(22)
    .fillColor("#2F855A")
    .text("Flyteo.in", { align: "left" });

  doc
    .fontSize(12)
    .fillColor("gray")
    .text("Hotel • Villa • Camping Booking", { align: "left" });

  doc.moveDown(1);
  doc
    .fontSize(10)
    .fillColor("black")
    .text(`Invoice No: INV-${booking.id}`)
    .text(`Booking ID: ${booking.id}`)
    .text(`Invoice Date: ${new Date().toDateString()}`);

  doc.moveDown();

  /* ======================
     CUSTOMER DETAILS
  ====================== */
  doc.fontSize(14).text("Customer Details", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(11)
    .text(`Name: ${booking.fullname}`)
    .text(`Mobile: ${booking.mobileno}`)
    .text(`Email: ${booking.user.email}`);

  doc.moveDown();

  /* ======================
     BOOKING DETAILS
  ====================== */
  doc.fontSize(14).text("Booking Details", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(11)
    .text(`Booking Type: ${booking.type.toUpperCase()}`)
    .text(
      `Property: ${
        booking.hotel?.name ||
        booking.villa?.name ||
        booking.camping?.name
      }`
    );

  if (booking.type === "hotel" || booking.type === "villa") {
    doc
      .text(`Check-in: ${new Date(booking.checkIn).toDateString()}`)
      .text(
        `Check-out: ${
          booking.checkOut
            ? new Date(booking.checkOut).toDateString()
            : "-"
        }`
      );
  }

  doc.text(`Guests: ${booking.guests}`);
  doc.text(`Rooms Booked: ${booking.roomCount || 1}`);

  doc.moveDown();

  /* ======================
     PAYMENT DETAILS
  ====================== */
  doc.fontSize(14).text("Payment Details", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(11)
    .text(`Total Amount: ₹${booking.totalAmount}`)
    .text(`Paid Amount: ₹${booking.paidAmount}`)
    .text(`Remaining Amount: ₹${booking.remainingAmount}`)
    .text(`Payment Type: ${booking.paymentType.toUpperCase()}`)
    .text(`Advance %: ${booking.advancePercent || 0}%`)
    .text(`Payment Status: ${booking.paymentStatus.toUpperCase()}`);

  doc.moveDown(2);

  /* ======================
     FOOTER
  ====================== */
  doc
    .fontSize(10)
    .fillColor("gray")
    .text(
      "Thank you for booking with Flyteo.in",
      { align: "center" }
    );

  doc.text(
    "This is a system-generated invoice. No signature required.",
    { align: "center" }
  );

  doc.end();
};
