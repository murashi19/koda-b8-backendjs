import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  Checkout,
  GetOrders,
  GetOrderDetail,
  UpdateOrderStatus,
} from "../controllers/order.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", Checkout);
router.get("/", GetOrders);
router.get("/:id", GetOrderDetail);
router.patch("/:id/status", UpdateOrderStatus);

export default router;
