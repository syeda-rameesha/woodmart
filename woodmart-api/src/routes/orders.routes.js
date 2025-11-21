// woodmart-api/src/routes/orders.routes.js
import { Router } from "express";
import Order from "../models/Order.js"; // if you have this model; ok to keep
import { requireAdmin } from "./admin.routes.js";
const router = Router();

// quick health to confirm mount
router.get("/health", (_req, res) => res.json({ ok: true, route: "orders" }));

// LIST orders  ✅ this is the endpoint your browser hit
router.get("/", async (_req, res) => {
  try {
    // If you have Mongo wired:
    const items = await Order.find().sort({ createdAt: -1 }).lean();
    return res.json({ ok: true, items });

    // If you DON'T want DB yet, comment the 2 lines above and use in-memory:
    // return res.json({ ok: true, items: [] });
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

// CREATE order (used by checkout)
router.post("/", async (req, res) => {
  try {
    const doc = await Order.create({
      ...req.body,
      status: req.body.status || "pending",
      createdAt: req.body.createdAt || new Date(),
    });
    return res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return res.status(400).json({ ok: false, message: String(err?.message || err) });
  }
});
// ============ ADMIN: LIST ALL ORDERS ============
router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      items: orders,
      total: orders.length,
    });
  } catch (err) {
    console.error("GET /api/orders/admin error:", err);
    return res.status(500).json({ message: "Failed to load orders" });
  }
});
export default router;