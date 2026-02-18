import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_MAIL, // your email
    pass: process.env.PASSWORD_SECRET_KEY  // app password
  }
});

export const sendWelcomeEmail = async ({ name, email ,password}) => {
  await transporter.sendMail({
    from: `"Flyteo.in" <${process.env.USER_MAIL}>`,
    to: email,
    subject: "🎉 Welcome to Flyteo!",
    html: `
      <div style="font-family:Arial;line-height:1.6">
        <h2>Hello ${name},</h2>
        
        <p>Welcome to <b>Flyteo.in</b> 🎉</p>
        <p>Your account has been successfully created.</p>
        <p>Your Registered Email Address:- ${email}</p>
        <p>Your Password:-${password}</p>
        <p>You can now book:</p>
        <ul>
          <li>🏨 Hotels</li>
          <li>🏕️ Camping</li>
          <li>🏡 Villas</li>
        </ul>
        <p>Happy Booking!<br/>Flyteo Team</p>
      </div>
    `
  });
};

export const sendBookingConfirmationEmail = async ({
  name,
  email,
  bookingId,
  type,
  propertyName,
  checkIn,
  checkOut,
  guests,
  totalAmount,
  paidAmount,
  remainingAmount,
  paymentType
}) => {

  await transporter.sendMail({
    from: `"Flyteo" <${process.env.USER_MAIL}>`,
    to: email,
    subject: "✅ Booking Confirmed - Flyteo",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333">
        
        <h2 style="color:#2e7d32;">🎉 Booking Confirmed!</h2>

        <p>Hello <b>${name}</b>,</p>

        <p>Your booking has been successfully confirmed. Here are your booking details:</p>

        <div style="background:#f9f9f9;padding:15px;border-radius:8px">
          <p><b>Booking ID:</b> ${bookingId}</p>
          <p><b>Property:</b> ${propertyName}</p>
          <p><b>Type:</b> ${type}</p>
          <p><b>Check-In:</b> ${checkIn}</p>
          ${checkOut ? `<p><b>Check-Out:</b> ${checkOut}</p>` : ""}
          <p><b>Guests:</b> ${guests}</p>
        </div>

        <h3 style="margin-top:20px;">💳 Payment Details</h3>

        <div style="background:#eef7ee;padding:15px;border-radius:8px">
          <p><b>Total Amount:</b> ₹${totalAmount}</p>
          <p><b>Paid Amount:</b> ₹${paidAmount}</p>
          ${
            remainingAmount > 0
              ? `<p style="color:#e65100;"><b>Remaining at Property:</b> ₹${remainingAmount}</p>`
              : `<p style="color:#2e7d32;"><b>Payment Status:</b> Fully Paid ✅</p>`
          }
          <p><b>Payment Type:</b> ${
            paymentType === "partial" ? "Advance Payment" : "Full Payment"
          }</p>
        </div>

        <p style="margin-top:20px;">
          We look forward to hosting you!  
          <br/>
          If you have any questions, feel free to contact us.
        </p>

        <p style="margin-top:30px;">
          Happy Booking! 🏨🏕️🏡  
          <br/>
          <b>Team Flyteo</b>
        </p>

      </div>
    `
  });
};

export const sendHotelAdminBookingEmail = async ({
  hotelAdminEmail,
  bookingId,
  propertyName,
  type,
  checkIn,
  checkOut,
  roomType,
  roomCount,
  guests,
  guestName,
  guestMobile,
  totalAmount,
  paidAmount,
  remainingAmount,
  paymentStatus,
  paymentType
}) => {

  await transporter.sendMail({
    from: `"Flyteo Booking System" <${process.env.USER_MAIL}>`,
    to: hotelAdminEmail,
    subject: `📢 New Booking Confirmed – ID #${bookingId}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f5f5f5;padding:20px">
        
        <div style="max-width:650px;margin:auto;background:white;padding:20px;border-radius:8px">

          <h2 style="color:#2e7d32;margin-bottom:5px;">
            🏨 New Booking Alert
          </h2>

          <p style="font-size:14px;color:#555;">
            A new booking has been confirmed for your property.
          </p>

          <hr style="margin:20px 0;" />

          <h3>📌 Booking Details</h3>

          <div style="background:#fafafa;padding:15px;border-radius:6px">
            <p><b>Booking ID:</b> ${bookingId}</p>
            <p><b>Property:</b> ${propertyName}</p>
            <p><b>Type:</b> ${type}</p>
            <p><b>Check-In:</b> ${checkIn}</p>
            ${checkOut ? `<p><b>Check-Out:</b> ${checkOut}</p>` : ""}
            ${roomType ? `<p><b>Room Type:</b> ${roomType}</p>` : ""}
            ${roomCount ? `<p><b>Rooms Booked:</b> ${roomCount}</p>` : ""}
            <p><b>Total Guests:</b> ${guests}</p>
          </div>

          <hr style="margin:20px 0;" />

          <h3>👤 Guest Details</h3>

          <div style="background:#fafafa;padding:15px;border-radius:6px">
            <p><b>Name:</b> ${guestName}</p>
            
          </div>

          <hr style="margin:20px 0;" />

          <h3>💳 Payment Information</h3>

          <div style="background:#eef7ee;padding:15px;border-radius:6px">
            <p><b>Total Amount:</b> ₹${totalAmount}</p>
            <p><b>Paid Online:</b> ₹${paidAmount}</p>
            ${
              remainingAmount > 0
                ? `<p style="color:#e65100;"><b>Pending at Property:</b> ₹${remainingAmount}</p>`
                : `<p style="color:#2e7d32;"><b>Payment Status:</b> Fully Paid ✅</p>`
            }
            <p><b>Payment Mode:</b> ${
              paymentType === "partial" ? "Advance Payment" : "Full Payment"
            }</p>
            <p><b>Payment Status:</b> ${paymentStatus.toUpperCase()}</p>
          </div>

          <hr style="margin:20px 0;" />

          <p style="font-size:14px;">
            👉 Please ensure room preparation and smooth check-in for the guest.
          </p>

          <p style="font-size:13px;color:#777;margin-top:30px;">
            This is an automated notification from Flyteo Booking System.
          </p>

        </div>
      </div>
    `
  });
};


export const sendVillaAdminBookingEmail = async ({
  villaAdminEmail,
  bookingId,
  propertyName,
  type,
  checkIn,
  checkOut,
  roomType,
  roomCount,
  guests,
  guestName,
  guestMobile,
  totalAmount,
  paidAmount,
  remainingAmount,
  paymentStatus,
  paymentType
}) => {

  await transporter.sendMail({
    from: `"Flyteo Booking System" <${process.env.USER_MAIL}>`,
    to: villaAdminEmail,
    subject: `📢 New Booking Confirmed – ID #${bookingId}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f5f5f5;padding:20px">
        
        <div style="max-width:650px;margin:auto;background:white;padding:20px;border-radius:8px">

          <h2 style="color:#2e7d32;margin-bottom:5px;">
            🏨 New Booking Alert
          </h2>

          <p style="font-size:14px;color:#555;">
            A new booking has been confirmed for your property.
          </p>

          <hr style="margin:20px 0;" />

          <h3>📌 Booking Details</h3>

          <div style="background:#fafafa;padding:15px;border-radius:6px">
            <p><b>Booking ID:</b> ${bookingId}</p>
            <p><b>Property:</b> ${propertyName}</p>
            <p><b>Type:</b> ${type}</p>
            <p><b>Check-In:</b> ${checkIn}</p>
            ${checkOut ? `<p><b>Check-Out:</b> ${checkOut}</p>` : ""}
            ${roomType ? `<p><b>Room Type:</b> ${roomType}</p>` : ""}
            ${roomCount ? `<p><b>Rooms Booked:</b> ${roomCount}</p>` : ""}
            <p><b>Total Guests:</b> ${guests}</p>
          </div>

          <hr style="margin:20px 0;" />

          <h3>👤 Guest Details</h3>

          <div style="background:#fafafa;padding:15px;border-radius:6px">
            <p><b>Name:</b> ${guestName}</p>
          </div>

          <hr style="margin:20px 0;" />

          <h3>💳 Payment Information</h3>

          <div style="background:#eef7ee;padding:15px;border-radius:6px">
            <p><b>Total Amount:</b> ₹${totalAmount}</p>
            <p><b>Paid Online:</b> ₹${paidAmount}</p>
            ${
              remainingAmount > 0
                ? `<p style="color:#e65100;"><b>Pending at Property:</b> ₹${remainingAmount}</p>`
                : `<p style="color:#2e7d32;"><b>Payment Status:</b> Fully Paid ✅</p>`
            }
            <p><b>Payment Mode:</b> ${
              paymentType === "partial" ? "Advance Payment" : "Full Payment"
            }</p>
            <p><b>Payment Status:</b> ${paymentStatus.toUpperCase()}</p>
          </div>

          <hr style="margin:20px 0;" />

          <p style="font-size:14px;">
            👉 Please ensure room preparation and smooth check-in for the guest.
          </p>

          <p style="font-size:13px;color:#777;margin-top:30px;">
            This is an automated notification from Flyteo Booking System.
          </p>

        </div>
      </div>
    `
  });
};
const personalEmail="flyteoin@gmail.com"
export const sendCompanyEmail = async ({
  bookingId,
  propertyName,
  type,
  checkIn,
  checkOut,
  roomType,
  roomCount,
  guests,
  guestName,
  guestMobile,
  totalAmount,
  paidAmount,
  remainingAmount,
  paymentStatus,
  paymentType
}) => {

  await transporter.sendMail({
    from: `"Flyteo Booking System" <${process.env.USER_MAIL}>`,
    to: personalEmail,
    subject: `📢 New Booking Confirmed – ID #${bookingId}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f5f5f5;padding:20px">
        
        <div style="max-width:650px;margin:auto;background:white;padding:20px;border-radius:8px">

          <h2 style="color:#2e7d32;margin-bottom:5px;">
            🏨 New Booking Alert
          </h2>

          <p style="font-size:14px;color:#555;">
            A new booking has been confirmed for your property.
          </p>

          <hr style="margin:20px 0;" />

          <h3>📌 Booking Details</h3>

          <div style="background:#fafafa;padding:15px;border-radius:6px">
            <p><b>Booking ID:</b> ${bookingId}</p>
            <p><b>Property:</b> ${propertyName}</p>
            <p><b>Type:</b> ${type}</p>
            <p><b>Check-In:</b> ${checkIn}</p>
            ${checkOut ? `<p><b>Check-Out:</b> ${checkOut}</p>` : ""}
            ${roomType ? `<p><b>Room Type:</b> ${roomType}</p>` : ""}
            ${roomCount ? `<p><b>Rooms Booked:</b> ${roomCount}</p>` : ""}
            <p><b>Total Guests:</b> ${guests}</p>
          </div>

          <hr style="margin:20px 0;" />

          <h3>👤 Guest Details</h3>

          <div style="background:#fafafa;padding:15px;border-radius:6px">
            <p><b>Name:</b> ${guestName}</p>
            <p><b>Mobile No:</b>${guestMobile}</p>
          </div>

          <hr style="margin:20px 0;" />

          <h3>💳 Payment Information</h3>

          <div style="background:#eef7ee;padding:15px;border-radius:6px">
            <p><b>Total Amount:</b> ₹${totalAmount}</p>
            <p><b>Paid Online:</b> ₹${paidAmount}</p>
            ${
              remainingAmount > 0
                ? `<p style="color:#e65100;"><b>Pending at Property:</b> ₹${remainingAmount}</p>`
                : `<p style="color:#2e7d32;"><b>Payment Status:</b> Fully Paid ✅</p>`
            }
            <p><b>Payment Mode:</b> ${
              paymentType === "partial" ? "Advance Payment" : "Full Payment"
            }</p>
            <p><b>Payment Status:</b> ${paymentStatus.toUpperCase()}</p>
          </div>

          <hr style="margin:20px 0;" />

          <p style="font-size:14px;">
            👉 Please ensure room preparation and smooth check-in for the guest.
          </p>

          <p style="font-size:13px;color:#777;margin-top:30px;">
            This is an automated notification from Flyteo Booking System.
          </p>

        </div>
      </div>
    `
  });
};