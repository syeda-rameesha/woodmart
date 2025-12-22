// woodmart-api/src/routes/admin.routes.js
import { Router } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import streamifier from "streamifier";
import cloudinaryPkg from "cloudinary";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Contact from "../models/Contact.js";

const { v2: cloudinary } = cloudinaryPkg;

const router = Router();

// ===== CLOUDINARY CONFIG =====
// make sure env variables are set: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    // payload received from client
    const payload = req.body || {};

    // 1) If client provided images[] but not image, take first images[0]
    if (!payload.image && Array.isArray(payload.images) && payload.images.length) {
      payload.image = payload.images[0];
    }

    // 2) If still no image, set a safe default so validation won't fail.
    //    Use env DEFAULT_PRODUCT_IMAGE if set (full URL), otherwise a local placeholder path.
    if (!payload.image) {
      const fallback = process.env.DEFAULT_PRODUCT_IMAGE || "/uploads/placeholder.png";
      payload.image = fallback;
      // ensure images array also present so clients expecting images will find it
      if (!Array.isArray(payload.images) || !payload.images.length) {
        payload.images = [fallback];
      }
    }

    // Optional: ensure price is number
    if (payload.price !== undefined) {
      payload.price = Number(payload.price) || 0;
    }

    // Create the product in DB
    const product = await Product.create(payload);
    return res.status(201).json({ message: "Product created", product });
  } catch (err) {
    console.error("Create product error:", err);
    // If Mongoose validation error, return details
    if (err && err.name === "ValidationError") {
      const details = {};
      for (const k in err.errors) details[k] = err.errors[k].message;
      return res.status(400).json({ message: "Product validation failed", details });
    }
    return res.status(500).json({ message: "Failed to create product", error: String(err?.message || err) });
  }
});

// GET single product (admin)
router.get("/products/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Missing product id" });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.json({ product });
  } catch (err) {
    console.error("Fetch product error:", err);
    return res.status(500).json({ message: "Failed to load product", error: String(err?.message || err) });
  }
});

// UPDATE PRODUCT
router.put("/products/:id", requireAdmin, async (req, res) => {
  try {
    const payload = req.body || {};

    // If update payload includes images but not image, keep consistent
    if (!payload.image && Array.isArray(payload.images) && payload.images.length) {
      payload.image = payload.images[0];
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Product updated", product });
  } catch (err) {
    console.error("Update product error:", err);
    return res.status(500).json({ message: "Failed to update product", error: String(err?.message || err) });
  }
});

// DELETE PRODUCT
router.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
    return res.status(500).json({ message: "Failed to delete product" });
  }
});

// ==============================================
//              ORDERS CRUD
// ==============================================

router.get("/orders", requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { "customer.name": regex },
        { "customer.email": regex },
        { "items.title": regex },
        { "items.slug": regex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    return res.json({ orders, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error("Fetch orders error:", err);
    return res.status(500).json({ message: "Failed to load orders" });
  }
});

// GET single order
router.get("/orders/:id", requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (err) {
    console.error("Fetch order error:", err);
    return res.status(500).json({ message: "Failed to load order" });
  }
});

// CREATE order (admin-side create)
router.post("/orders", requireAdmin, async (req, res) => {
  try {
    const payload = req.body;
    const order = new Order(payload);

    order.amounts = order.amounts || { subtotal: 0, shipping: 0, total: 0 };
    await order.save();
    return res.status(201).json({ message: "Order created", order });
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(400).json({ message: "Invalid data", details: err.message });
  }
});

// UPDATE order (partial/full)
router.put("/orders/:id", requireAdmin, async (req, res) => {
  try {
    const payload = req.body;

    if (payload.status) {
      const valid = ["new", "processing", "shipped", "delivered", "cancelled"];
      if (!valid.includes(payload.status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
    }

    const order = await Order.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json({ message: "Order updated", order });
  } catch (err) {
    console.error("Update order error:", err);
    return res.status(400).json({ message: "Update failed", details: err.message });
  }
});

// DELETE order
router.delete("/orders/:id", requireAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json({ message: "Order deleted" });
  } catch (err) {
    console.error("Delete order error:", err);
    return res.status(500).json({ message: "Failed to delete order" });
  }
});

// Update only status endpoint (kept for compatibility)
router.put("/orders/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const valid = ["new", "processing", "shipped", "delivered", "cancelled"];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Order update error:", err);
    return res.status(500).json({ message: "Failed to update order status" });
  }
});

// ==============================================
//        CONTACT MESSAGES (ADMIN PANEL)
// ==============================================

// GET ALL MESSAGES
router.get("/messages", requireAdmin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.json({ messages });
  } catch (err) {
    console.error("Fetch messages error:", err);
    return res.status(500).json({ message: "Failed to load messages" });
  }
});

// DELETE MESSAGE
router.delete("/messages/:id", requireAdmin, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    return res.json({ message: "Message deleted" });
  } catch (err) {
    console.error("Delete message error:", err);
    return res.status(500).json({ message: "Failed to delete message" });
  }
});

// ==============================================
//        UPLOAD IMAGE -> Cloudinary
// ==============================================

// multer in-memory storage (we stream the buffer to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/admin/upload  (authenticated admin)
// use upload.any() to be tolerant of the field name used by client
router.post("/upload", requireAdmin, upload.any(), async (req, res) => {
  try {
    // Cloudinary config check
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary env missing:", {
        cloud: !!process.env.CLOUDINARY_CLOUD_NAME,
        key: !!process.env.CLOUDINARY_API_KEY,
        secret: !!process.env.CLOUDINARY_API_SECRET,
      });
      return res.status(500).json({ message: "Upload failed", error: "Cloudinary credentials not configured on server" });
    }

    // find the uploaded file buffer (multer any() places files on req.files array)
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ message: "No file uploaded", error: "NoFiles" });

    // choose first file
    const file = files[0];
    // file.buffer must exist for memoryStorage
    if (!file || !file.buffer) return res.status(400).json({ message: "No file buffer", error: "NoBuffer" });

    // stream upload to Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "woodmart" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(file.buffer);

    // Normalize result (secure_url preferred)
    const url = result && (result.secure_url || result.url) ? (result.secure_url || result.url) : null;
    const filename = result && result.public_id ? result.public_id.split("/").pop() : (file.originalname || null);

    return res.json({ ok: true, url, filename, raw: result });
  } catch (err) {
    console.error("Upload error:", err);
    // If cloudinary missing credentials will show message
    return res.status(500).json({ message: "Upload failed", error: String(err.message || err) });
  }
});

export default router;
export { requireAdmin };