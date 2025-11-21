// woodmart-api/src/seed/seedProducts.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Product } from "../models/Product.js";

dotenv.config();

// 👇 your demo products
const PRODUCTS = [
  {
    title: "Vevey Raffia Dining Chair",
    slug: "vevey-raffia-dining-chair",
    brand: "4Living",
    price: 260,
    category: "furniture",
    image:
      "https://cdn11.bigcommerce.com/s-9wxsv0grlf/images/stencil/1280x1280/products/4119/21619/Vevey-weave-chair__01409.1745860075.png?c=1",
    images: [
      "https://cdn11.bigcommerce.com/s-9wxsv0grlf/images/stencil/1280x1280/products/4119/21619/Vevey-weave-chair__01409.1745860075.png?c=1",
      "https://cdn11.bigcommerce.com/s-9wxsv0grlf/images/stencil/1280x1280/products/4119/19653/VEV_CHAIR_3__28107.1745860072.jpg?c=1",
      "https://cdn11.bigcommerce.com/s-9wxsv0grlf/images/stencil/1280x1280/products/4119/19651/VEV_CHAIR_7__35427.1745860073.jpg?c=1",
      "https://cdn11.bigcommerce.com/s-9wxsv0grlf/images/stencil/1280x1280/products/4119/19654/VEV_CHAIR_5__77669.1745860073.jpg?c=1",
      "https://cdn11.bigcommerce.com/s-9wxsv0grlf/images/stencil/1280x1280/products/4119/19655/VEV_CHAIR_6__14135.1745860073.jpg?c=1",
      "https://cdn11.bigcommerce.com/s-9wxsv0grlf/images/stencil/1280x1280/products/4119/19652/VEV_CHAIR_4__24146.1745860073.jpg?c=1",
      "https://cdn11.bigcommerce.com/s-9wxsv0grlf/images/stencil/1280x1280/products/4119/19650/VEV_CHAIR_2__53585.1745860073.jpg?c=1",
      "https://cdn11.bigcommerce.com/s-9wxsv0grlf/images/stencil/1280x1280/products/4119/19649/VEV_CHAIR_1__67943.1745860073.jpg?c=1",
    ],
    description: "Raffia dining chair with comfortable weave and modern look.",
  },
  {
    title: "Curved Velvet Sofa",
    slug: "curved-velvet-sofa",
    brand: "WoodenTwist",
    price: 300,
    category: "furniture",
    image: "https://files.catbox.moe/zkhq0a.jpeg",
    images: [
      "https://files.catbox.moe/zkhq0a.jpeg",
      "https://files.catbox.moe/1kwceh.jpeg",
      "https://files.catbox.moe/7hi7e2.jpeg",
      "https://files.catbox.moe/9luoxn.jpeg",
    ],
    description:
      "Luxury curved velvet sofa with premium soft velvet fabric and elegant curved backrest design.",
  },
  {
    title: "Wall Shelf",
    slug: "wall-shelf",
    brand: "Casa",
    price: 60,
    category: "furniture",
    image: "https://files.catbox.moe/ps1dj6.jpeg",
    images: [
      "https://files.catbox.moe/ps1dj6.jpeg",
      "https://files.catbox.moe/2uy5yo.jpeg",
      "https://files.catbox.moe/x9uf70.jpeg",
    ],
    description: "Minimal floating wall shelf for books and decor.",
  },
  {
    title: "Floor Lamp",
    slug: "floor-lamp",
    brand: "Luma",
    price: 125,
    category: "lighting",
    image: "https://files.catbox.moe/s75atp.jpeg",
    images: [
      "https://files.catbox.moe/s75atp.jpeg",
      "https://files.catbox.moe/v34ea0.jpeg",
      "https://files.catbox.moe/7e0ii9.jpeg",
    ],
    description: "Minimal Nordic lamp with warm diffused light and matte finish.",
  },
  {
    title: "Modern Coffee Table",
    slug: "modern-coffee-table",
    brand: "Oak&Steel",
    price: 179,
    salePrice: 149,
    category: "furniture",
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519710165466-61b0e3b16d9d?q=80&w=1600&auto=format&fit=crop",
    ],
    description:
      "Low-profile coffee table with oak veneer top and steel legs.",
  },
  {
    title: "Leather Office Chair",
    slug: "leather-office-chair",
    brand: "ErgoMax",
    price: 229,
    category: "furniture",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519710881334-1a9c1d3c5a88?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598300184612-5b0dbf3a6f0b?q=80&w=1600&auto=format&fit=crop",
    ],
    description:
      "High-back ergonomic chair with soft leather and adjustable height.",
  },
  {
    title: "Textured Cotton Throw",
    slug: "textured-cotton-throw",
    brand: "Haven",
    price: 39,
    category: "accessories",
    image:
      "https://images.unsplash.com/photo-1519710165466-61b0e3b16d9d?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1519710165466-61b0e3b16d9d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1600&auto=format&fit=crop",
    ],
    description: "Soft, breathable throw blanket with subtle waffle texture.",
  },
  {
    title: "Ceramic Vase Set (3)",
    slug: "ceramic-vase-set",
    brand: "Vessel",
    price: 59,
    category: "accessories",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523419409543-8c8dcf1f1b59?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=1600&auto=format&fit=crop",
    ],
    description:
      "Matte white ceramic vases in complementary sizes for styling.",
  },
  {
    title: "Elegant Floral Dress",
    slug: "elegant-floral-dress",
    brand: "VogueLine",
    price: 89,
    category: "fashion",
    image: "https://files.catbox.moe/xv5ahe.jpeg",
    images: [
      "https://files.catbox.moe/xv5ahe.jpeg",
      "https://files.catbox.moe/uwmjpv.jpeg",
      "https://files.catbox.moe/qnxm94.jpeg",
    ],
    description:
      "Beautiful floral print midi dress made from breathable cotton blend fabric, perfect for casual outings.",
  },
  {
    title: "Men’s Classic Denim Jacket",
    slug: "mens-classic-denim-jacket",
    brand: "UrbanEdge",
    price: 80,
    category: "fashion",
    image: "https://files.catbox.moe/qd7yuv.jpeg",
    images: [
      "https://files.catbox.moe/qd7yuv.jpeg",
      "https://files.catbox.moe/fk8afz.jpeg",
    ],
    description:
      "A timeless denim jacket for men with adjustable cuffs and chest pockets for a rugged yet modern look.",
  },
  {
    title: "Non-Stick Cookware Set (10-Piece)",
    slug: "nonstick-cookware-set",
    brand: "ChefCraft",
    price: 149,
    category: "cooking",
    image: "https://files.catbox.moe/017o6x.jpeg",
    images: [
      "https://files.catbox.moe/017o6x.jpeg",
      "https://files.catbox.moe/cl0ubv.jpeg",
      "https://files.catbox.moe/wd77ih.jpeg",
    ],
    description:
      "Premium non-stick pots and pans set with heat-resistant handles and durable ceramic coating.",
  },
  {
    title: "Electric Hand Mixer",
    slug: "electric-hand-mixer",
    brand: "MixPro",
    price: 79,
    category: "cooking",
    image: "https://files.catbox.moe/x850bp.jpeg",
    images: [
      "https://files.catbox.moe/x850bp.jpeg",
      "https://files.catbox.moe/quxlf3.jpeg",
    ],
    description:
      "Compact 5-speed electric hand mixer with stainless steel beaters, ideal for whipping and baking.",
  },
  {
    title: "2D Wall Clock",
    slug: "2d-wall-clock",
    brand: "MixPro",
    price: 40,
    category: "clocks",
    image: "https://files.catbox.moe/n8ynp3.jpeg",
    images: [
      "https://files.catbox.moe/n8ynp3.jpeg",
      "https://files.catbox.moe/ptupyk.jpeg",
    ],
    description: "Modern 2D wall clock, perfect for living room or office.",
  },
];

// 👇 wrapped in IIFE so editors don't complain
(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("Missing MONGODB_URI");
    }

    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    for (const p of PRODUCTS) {
      const exists = await Product.findOne({ slug: p.slug });
      if (exists) {
        console.log(`↷ Skipping existing product: ${p.slug}`);
        continue;
      }
      await Product.create(p);
      console.log(`✅ Inserted product: ${p.slug}`);
    }

    console.log("🎉 Seeding finished");
  } catch (err) {
    console.error("🛑 Seed error:", err.message || err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
})();