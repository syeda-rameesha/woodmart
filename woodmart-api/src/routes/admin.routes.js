// woodmart-api/src/routes/admin.routes.js

import { Router } from "express";
import jwt from "jsonwebtoken";
import Product from "../models/Product.js";
import Order from "../models/Order.js";   // ✅ REQUIRED for order status

const router = Router();

// ===== ADMIN CONFIG (from .env or fallback) =====
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@woodmart.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// -------- LOGIN --------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { sub: ADMIN_EMAIL, role: "admin" },
      JWT_SECRET,
      { expiresIn: "3h" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("POST /api/admin/login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

// -------- MIDDLEWARE (ADMIN GUARD) --------
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    console.error("JWT verify failed:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ==============================================
//              PRODUCT CRUD
// ==============================================

// CREATE PRODUCT
router.post("/products", requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.json({ message: "Product created", product });
  } catch (err) {
    console.error("Create product error:", err);
    return res.status(500).json({ message: "Failed to create product" });
  }
});

// UPDATE PRODUCT
router.put("/products/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.json({ message: "Product updated", product });
  } catch (err) {
    console.error("Update product error:", err);
    return res.status(500).json({ message: "Failed to update product" });
  }
});

// DELETE PRODUCT
router.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
    return res.status(500).json({ message: "Failed to delete product" });
  }
});

// ==============================================
//        ORDER STATUS UPDATE  (INSERTED HERE)
// ==============================================

router.put("/orders/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const valid = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    return res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Order update error:", err);
    return res.status(500).json({ message: "Failed to update order status" });
  }
});

export default router;
export { requireAdmin };