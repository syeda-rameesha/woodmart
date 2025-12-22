// woodmart-api/src/lib/mail.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendAdminNotification({ name, email, subject, message }) {
  const html = `
    <h3>New contact form submission</h3>
    <p><strong>Name:</strong> ${name || "—"}</p>
    <p><strong>Email:</strong> ${email || "—"}</p>
    <p><strong>Subject:</strong> ${subject || "—"}</p>
    <p><strong>Message:</strong></p>
    <p>${(message || "").replace(/\n/g, "<br>")}</p>
    <hr/>
    <small>Sent from your site</small>
  `;

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
    subject: subject ? `Contact: ${subject}` : "New contact form message",
    html,
  });

  return info;
}