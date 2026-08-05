import express from "express";
import {
  CreateWishlist,
  DeleteWishlist,
} from "../controllers/wishlist.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/", CreateWishlist);
router.delete("/:product_id", DeleteWishlist);

export default router;
