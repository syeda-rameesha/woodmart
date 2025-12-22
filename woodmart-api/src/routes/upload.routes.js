// woodmart-api/src/routes/upload.routes.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// ensure uploads folder exists
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// multer storage (store files in /uploads with original name + timestamp)
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    const name = `${base}-${Date.now()}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

// POST /api/upload -> accepts single file under field "file"
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file" });

    // build accessible URL: the simplest approach is to serve /uploads statically
    const fullUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    return res.json({ ok: true, url: fullUrl, filename: req.file.filename });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

export default router;