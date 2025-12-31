import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

// ---------- helpers ----------
function buildSort(sort) {
  switch (sort) {
    case "price-asc":
      return { price: 1 };
    case "price-desc":
      return { price: -1 };
    case "title-asc":
      return { title: 1 };
    case "title-desc":
      return { title: -1 };
    case "brand-asc":
      return { brand: 1 };
    default:
      return { createdAt: -1 };
  }
}

function normalizePage(page, limit) {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.max(1, Math.min(60, Number(limit) || 12));
  const skip = (p - 1) * l;
  return { p, l, skip };
}

// ---------- SEARCH ----------
router.get("/search", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const limit = Number(req.query.limit || 8);

    if (!q) return res.json({ items: [], total: 0 });

    const filter = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { slug: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    };

    const items = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(filter);

    res.json({ items, total });
  } catch (err) {
    console.error("GET /api/products/search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
});


// ---------- 🔥 DEALS / ON SALE ----------
router.get("/deals", async (_req, res) => {
  try {
    const items = await Product.find({
      salePrice: { $exists: true, $gt: 0 },
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    res.json({ items });
  } catch (err) {
    console.error("GET /api/products/deals error:", err);
    res.status(500).json({ message: "Failed to load deals" });
  }
});


// ---------- LIST (q, sort, page, limit, category) ----------
router.get("/", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const sort = String(req.query.sort || "");
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);
    const cat = String(req.query.cat || "").trim();

    const filter = {};

    // text search
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { slug: { $regex: q, $options: "i" } },
      ];
    }

    // category filter (case-insensitive)
    if (cat) {
      filter.category = {
        $regex: cat,
        $options: "i",
      };
    }

    const { p, l, skip } = normalizePage(page, limit);
    const sortSpec = buildSort(sort);

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortSpec).skip(skip).limit(l).lean(),
      Product.countDocuments(filter),
    ]);

    const pages = Math.max(1, Math.ceil(total / l));

    res.json({
      items,
      total,
      page: p,
      pages,
      limit: l,
      sort,
      q,
      cat,
    });
  } catch (err) {
    console.error("GET /api/products error:", err);
    res.status(500).json({ message: "Failed to list products" });
  }
});

// ---------- BY SLUG or ID ----------
router.get("/:key", async (req, res) => {
  try {
    const { key } = req.params;

    let product = await Product.findOne({ slug: key }).lean();

    if (!product && /^[0-9a-fA-F]{24}$/.test(key)) {
      product = await Product.findById(key).lean();
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("GET /api/products/:key error:", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

export default router;