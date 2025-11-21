// woodmart-api/src/index.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { connectMongo } from "./db/mongo.js";

// ✅ make sure these come from the routes folder (not models)
import productRoutes from "./routes/product.routes.js";
import ordersRoutes  from "./routes/orders.routes.js";
import adminRoutes   from "./routes/admin.routes.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// basic middleware
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
app.set("trust proxy", 1);

// allow your frontend (localhost + 127.0.0.1)
app.use(
  cors({
    origin: [/^http:\/\/localhost:3000$/, /^http:\/\/127\.0\.0\.1:3000$/],
    credentials: true,
  })
);

// quick ping & health
app.get("/", (_req, res) => res.json({ ok: true, service: "woodmart-api" }));
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || "dev", time: new Date().toISOString() })
);

// ✅ mount routers
app.use("/api/products", productRoutes);
app.use("/api/orders",   ordersRoutes);
app.use("/api/admin",    adminRoutes);

// not-found handler (for unknown /api/* paths)
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// error handler
app.use((err, _req, res, _next) => {
  console.error("API error:", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// start after Mongo connects
async function start() {
  try {
    console.log("ℹ️  Connecting to MongoDB…");
    if (!process.env.MONGODB_URI) {
      throw new Error("Missing MONGODB_URI in environment");
    }
    await connectMongo(process.env.MONGODB_URI);

    app.listen(PORT, () => {
      console.log(`🚀 API listening on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("🛑 Server not started due to Mongo error.", e.message);
    process.exit(1);
  }
}

start();