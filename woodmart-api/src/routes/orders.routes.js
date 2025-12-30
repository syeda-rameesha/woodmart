// woodmart-api/src/routes/orders.routes.js
import { Router } from "express";
import Order from "../models/Order.js"; // mongoose model
import { requireAdmin } from "./admin.routes.js";
const router = Router();

// quick health to confirm mount
router.get("/health", (_req, res) => res.json({ ok: true, route: "orders" }));

/**
 * Helper: compute amounts from items + shipping fallback
 * items: [{ price, qty }]
 * shipping: { method, fee }
 * existingAmounts: optional amounts object to prefer if provided
 */
function computeAmounts(items = [], shipping = {}, existingAmounts = {}) {
  const subtotal = Array.isArray(items)
    ? items.reduce((s, it) => s + (Number(it.price || 0) * Number(it.qty || 0)), 0)
    : 0;
  const shippingFee =
    (shipping && Number(shipping.fee || 0)) ||
    (existingAmounts && Number(existingAmounts.shipping || 0)) ||
    0;
  const total = Number((subtotal + shippingFee).toFixed(2));
  return {
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shippingFee.toFixed(2)),
    total,
  };
}

// LIST orders  — public listing for customers (your frontend used this)
router.get("/", async (_req, res) => {
  try {
    const items = await Order.find().sort({ createdAt: -1 }).lean();

    // ensure amounts exist in each item returned (compute if missing)
    const normalized = items.map((o) => {
      if (!o.amounts || typeof o.amounts.total !== "number") {
        o.amounts = computeAmounts(o.items, o.shipping, o.amounts);
      }
      return o;
    });

    return res.json({ ok: true, items: normalized });
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return res.status(500).json({ ok: false, message: String(err?.message || err) });
  }
});

// CREATE order (used by checkout)
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};

    // Basic validation
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ ok: false, message: "Order must include at least one item" });
    }

    // Compute amounts (prefer amounts provided but recompute for safety)
    const computed = computeAmounts(body.items, body.shipping || {}, body.amounts || {});
    // Merge into payload
    const payload = {
      ...body,
      amounts: computed,
      status: body.status || "pending",
      createdAt: body.createdAt || new Date(),
    };

    const doc = await Order.create(payload);
    return res.status(201).json({ ok: true, id: doc._id, amounts: doc.amounts });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return res.status(400).json({ ok: false, message: String(err?.message || err) });
  }
});

// ============ ADMIN: LIST ALL ORDERS ============
router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

    // Ensure amounts exist for each order
    const normalized = orders.map((o) => {
      if (!o.amounts || typeof o.amounts.total !== "number") {
        o.amounts = computeAmounts(o.items, o.shipping, o.amounts);
      }
      return o;
    });

    return res.json({
      items: normalized,
      total: normalized.length,
    });
  } catch (err) {
    console.error("GET /api/orders/admin error:", err);
    return res.status(500).json({ message: "Failed to load orders" });
  }
});

// ============ ADMIN: UPDATE ORDER STATUS ============
router.patch("/admin/:id/status", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ALLOWED = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!ALLOWED.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({ ok: true, status: order.status });
  } catch (err) {
    console.error("PATCH /api/orders/admin/:id/status error:", err);
    return res.status(500).json({ message: "Failed to update status" });
  } 
});

export default router;
