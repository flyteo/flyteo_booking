import PDFDocument from "pdfkit";
import pkg from "number-to-words";
const { toWords } = pkg;


export const generateBookingInvoice = (booking, res) => {
  const doc = new PDFDocument({ margin: 50 });
   const logoPath = "./src/assets/logo.jpeg";

  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=Flyteo-Invoice-${booking.id}.pdf`
  });

  doc.pipe(res);
  doc.save();

// Set transparency
doc.opacity(0.08);

// Center position
doc.image(logoPath, 150, 250, {
  width: 300,
  align: "center"
});

// Restore normal opacity
doc.restore();

  const propertyName =
    booking.hotel?.name ||
    booking.villa?.name ||
    booking.camping?.name ||
    "Flyteo Property";

  const invoiceDate = new Date();
  const dueDate = new Date(
    invoiceDate.getTime() + 24 * 60 * 60 * 1000
  );

  /* ======================
     HEADER
  ====================== */

 // Update with your logo path
const stampPath = "./src/assets/stamp.jpeg"; // Update with your stamp path
// Center logo
doc.image(logoPath, 50, 40, { width: 120 });

doc
  .fontSize(16)
  .fillColor("#000")
  .text("INVOICE", 400, 50);

doc
  .fontSize(10)
  .fillColor("gray")
  .text(`Invoice No: INV-${booking.id}`, 400, 70)
  .text(`Invoice Date: ${new Date().toLocaleDateString()}`, 400, 85);

doc.moveDown(4);
/* ======================
   COMPANY DETAILS
====================== */

doc
  .fontSize(10)
  .fillColor("#000")
  .text("GSTIN: 27AALFF0327N1Z7", 50, 110)
  .text("FLYTEO.IN", 50, 125)
  .text("Office Address: Colaba, Mumbai, Maharashtra - 400005", 50, 140)
  .text("Contact: +91 89759 95125", 50, 155);

// WhatsApp Icon
const whatsappPath = "./src/assets/whatsapp-2.jpg";

doc.image(whatsappPath, 170, 152, {
  width: 12
});

  /* ======================
     BILL TO
  ====================== */

  /* ======================
   CUSTOMER DETAILS BOX
====================== */

const customerBoxTop = doc.y + 10;

doc
  .rect(50, customerBoxTop, 500, 120) // increased height
  .stroke();

doc
  .fontSize(12)
  .fillColor("#2F855A")
  .text("BILL TO", 60, customerBoxTop + 10);

doc
  .fontSize(11)
  .fillColor("#000")
  .text(`Name: ${booking.fullname}`, 60, customerBoxTop + 30)
  .text(`Mobile: ${booking.mobileno}`, 60, customerBoxTop + 45)
  .text(`Email: ${booking.user?.email || "-"}`, 60, customerBoxTop + 60);

// RIGHT SIDE DETAILS
doc
  .text(
    `Booking Type: ${booking.type.toUpperCase()}`,
    300,
    customerBoxTop + 30
  )
  .text(
    `Guests: ${booking.guests}`,
    300,
    customerBoxTop + 45
  )
  .text(
    `Rooms: ${booking.roomCount || 1}`,
    300,
    customerBoxTop + 60
  );

/* ======================
   CHECK-IN / CHECK-OUT
====================== */

if (
  booking.type === "hotel" ||
  booking.type === "villa"
) {
  doc
    .text(
      `Check-in: ${new Date(
        booking.checkIn
      ).toLocaleDateString("en-IN")}`,
      60,
      customerBoxTop + 80
    )
    .text(
      `Check-out: ${
        booking.checkOut
          ? new Date(
              booking.checkOut
            ).toLocaleDateString("en-IN")
          : "-"
      }`,
      300,
      customerBoxTop + 80
    );
}

doc.moveDown(8);


  /* ======================
     ITEMS TABLE
  ====================== */

 /* ======================
   ITEMS TABLE WITH BORDERS
====================== */

const startX = 50;
let startY = doc.y;

const tableWidth = 500;
const rowHeight = 25;

// Column widths
const col1 = 220; // Description
const col2 = 80;  // Qty
const col3 = 100; // Rate
const col4 = 100; // Amount

const rupee = "Rs.";

/* ===== TABLE HEADER ===== */

doc
  .rect(startX, startY, tableWidth, rowHeight)
  .stroke();

doc
  .text("Description", startX + 5, startY + 7)
  .text("Qty", startX + col1 + 5, startY + 7)
  .text("Rate", startX + col1 + col2 + 5, startY + 7)
  .text("Amount", startX + col1 + col2 + col3 + 5, startY + 7);

// Vertical lines
doc
  .moveTo(startX + col1, startY)
  .lineTo(startX + col1, startY + rowHeight)
  .stroke();

doc
  .moveTo(startX + col1 + col2, startY)
  .lineTo(startX + col1 + col2, startY + rowHeight)
  .stroke();

doc
  .moveTo(startX + col1 + col2 + col3, startY)
  .lineTo(startX + col1 + col2 + col3, startY + rowHeight)
  .stroke();

startY += rowHeight;

/* ===== TABLE ROW ===== */

const itemDescription = `${booking.type.toUpperCase()} - ${
  booking.hotel?.name ||
  booking.villa?.name ||
  booking.camping?.name
}`;

const qty = booking.roomCount || 1;
const rate = booking.totalAmount / qty;
const amount = booking.totalAmount;

doc
  .rect(startX, startY, tableWidth, rowHeight)
  .stroke();

doc
  .text(itemDescription, startX + 5, startY + 7, { width: col1 - 10 })
  .text(qty.toString(), startX + col1 + 5, startY + 7)
  .text(`${rupee} ${rate.toFixed(2)}`, startX + col1 + col2 + 5, startY + 7)
  .text(`${rupee} ${amount.toFixed(2)}`, startX + col1 + col2 + col3 + 5, startY + 7);

// Vertical lines
doc
  .moveTo(startX + col1, startY)
  .lineTo(startX + col1, startY + rowHeight)
  .stroke();

doc
  .moveTo(startX + col1 + col2, startY)
  .lineTo(startX + col1 + col2, startY + rowHeight)
  .stroke();

doc
  .moveTo(startX + col1 + col2 + col3, startY)
  .lineTo(startX + col1 + col2 + col3, startY + rowHeight)
  .stroke();

doc.moveDown(3);

  /* ======================
     TOTAL SECTION
  ====================== */

/* ======================
   TOTAL SUMMARY BOX
====================== */


const summaryX = 350;
let summaryY = doc.y;

const summaryWidth = 200;
const sumrowHeight = 22;

// Fetch fixed tax amount from hotel
const taxAmount = booking.hotel?.taxes || booking.villa?.taxes || 0;

// Calculate base
const baseAmount =
  booking.totalAmount - taxAmount;

const grandTotal = booking.totalAmount;

// Draw box
doc
  .rect(summaryX, summaryY, summaryWidth, sumrowHeight * 5)
  .stroke();

// Base Amount
doc.text(
  "Base Amount",
  summaryX + 10,
  summaryY + 6
);
doc.text(
  `${rupee} ${baseAmount.toFixed(2)}`,
  summaryX + 100,
  summaryY + 6
);

// Property Tax (Fixed)
doc.text(
  "Property Taxes",
  summaryX + 10,
  summaryY + sumrowHeight + 6
);
doc.text(
  `${rupee} ${taxAmount.toFixed(2)}`,
  summaryX + 100,
  summaryY + sumrowHeight + 6
);

// Total
doc.fontSize(12).text(
  "Total",
  summaryX + 10,
  summaryY + sumrowHeight * 2 + 6
);
doc.text(
  `${rupee} ${grandTotal.toFixed(2)}`,
  summaryX + 100,
  summaryY + sumrowHeight * 2 + 6
);

// Received
doc.fontSize(11).text(
  "Received",
  summaryX + 10,
  summaryY + sumrowHeight * 3 + 6
);
doc.text(
  `${rupee} ${booking.paidAmount.toFixed(2)}`,
  summaryX + 100,
  summaryY + sumrowHeight * 3 + 6
);

// Balance
doc.fontSize(12).text(
  "Balance",
  summaryX + 10,
  summaryY + sumrowHeight * 4 + 6
);
doc.text(
  `${rupee} ${booking.remainingAmount.toFixed(2)}`,
  summaryX + 100,
  summaryY + sumrowHeight * 4 + 6
);

doc.moveDown(4);



  /* ======================
     AMOUNT IN WORDS
  ====================== */

  /* ======================
     FOOTER
  ====================== */

  doc.image(stampPath, {
  fit: [120, 80],
  align: "right"
});

  doc.end();
};
