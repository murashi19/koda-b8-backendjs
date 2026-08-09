import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const UPLOAD_ROOT = "public/uploads/products";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const dir = path.join(UPLOAD_ROOT, today);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Format file harus JPG, PNG, atau WEBP"));
  }
  cb(null, true);
}

const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // max 2MB
});

export default uploadProductImage;
