import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  GetCart,
  AddToCart,
  // UpdateQuantity,
  DeleteCartItem,
} from "../controllers/cart.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", GetCart);
router.post("/", AddToCart);
// router.patch("/:id", UpdateQuantity);
router.delete("/:id", DeleteCartItem);

export default router;
