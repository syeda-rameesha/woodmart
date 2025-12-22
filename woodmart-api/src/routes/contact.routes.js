// woodmart-api/src/routes/contact.routes.js
import { Router } from "express";
import Contact from "../models/Contact.js";
import { sendAdminNotification } from "../lib/mail.js";

const router = Router();

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    // basic validation
    if (!message || !email) {
      return res.status(400).json({ message: "Email and message are required" });
    }

    // save to mongo
    const doc = await Contact.create({ name, email, subject, message });

    // send admin email (best effort — don't fail the request on mail errors)
    try {
      await sendAdminNotification({ name, email, subject, message });
    } catch (mailErr) {
      console.error("Mail send failed:", mailErr);
    }

    return res.status(201).json({ message: "Message received", data: doc });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    return res.status(500).json({ message: "Failed to submit message" });
  }
});

export default router;