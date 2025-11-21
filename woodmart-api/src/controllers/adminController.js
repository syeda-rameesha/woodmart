// woodmart-api/src/controllers/adminController.js
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const ADMIN_EMAIL = "admin@store.com";
const ADMIN_PASS  = "123456";

export function adminLogin(req, res) {
  const { email, password } = req.body || {};
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ ok: true, token });
  }
  return res.status(401).json({ ok: false, message: "Invalid credentials" });
}

// auth middleware
export function requireAdmin(req, res, next) {
  const h = req.headers.authorization || "";
  const [, token] = h.split(" ");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload?.role !== "admin") throw new Error("not admin");
    req.admin = payload;
    next();
  } catch (e) {
    res.status(401).json({ ok: false, message: "Unauthorized" });
  }
}

/** Orders (admin) */
export async function getOrders(req, res) {
  const list = await Order.find({}).sort({ createdAt: -1 }).lean();
  res.json({ ok: true, items: list });
}

/** Products (admin) */
export async function createProduct(req, res) {
  const p = await Product.create(req.body);
  res.json({ ok: true, item: p });
}