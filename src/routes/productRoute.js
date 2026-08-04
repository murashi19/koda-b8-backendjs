import express from "express";

import {
  CreateProduct,
  GetAllProduct,
  GetProductById,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", GetAllProduct);
router.get("/:id", GetProductById);
router.post("/", CreateProduct);

export default router;
