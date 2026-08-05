import express from "express";

import {
  GetAllProduct,
  CreateProduct,
  GetProductById,
  UpdateProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", GetAllProduct);
router.get("/:id", GetProductById);
router.post("/", CreateProduct);
router.patch("/:id", UpdateProduct);

export default router;
