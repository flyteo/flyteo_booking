import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_MAIL, // your email
    pass: process.env.PASSWORD_SECRET_KEY  // app password
  }
});

export const sendWelcomeEmail = async ({ name, email }) => {
  await transporter.sendMail({
    from: `"Flyteo.in" <${process.env.USER_MAIL}>`,
    to: email,
    subject: "🎉 Welcome to Flyteo!",
    html: `
      <div style="font-family:Arial;line-height:1.6">
        <h2>Hello ${name},</h2>
        <p>Welcome to <b>Flyteo.in</b> 🎉</p>
        <p>Your account has been successfully created.</p>
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
