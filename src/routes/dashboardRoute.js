import { Router } from "express";
import { GetDashboardSummary } from "../controllers/dashboard.controller.js";
import {
  GetAllOrders,
  GetOrderDetailAdmin,
  GetOrderStatusCounts,
} from "../controllers/order.controller.js";
import authMiddleware from "../middleware/auth.js";
import requireAdmin from "../middleware/admin.js";

const router = Router();

/**
 * @openapi
 * /admin/dashboard:
 *   get:
 *     summary: Get aggregated admin dashboard summary (stats, revenue chart, category breakdown, recent orders, top products)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, admin only
 */
router.get("/dashboard", authMiddleware, requireAdmin, GetDashboardSummary);

/**
 * @openapi
 * /admin/orders:
 *   get:
 *     summary: Get all orders from every customer (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, admin only
 */
router.get("/orders", authMiddleware, requireAdmin, GetAllOrders);

/**
 * @openapi
 * /admin/orders/status-counts:
 *   get:
 *     summary: Get order counts grouped by status, plus total (admin only). Dipakai untuk badge angka di tab filter OrderList.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Counts per status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, admin only
 */
router.get(
  "/orders/status-counts",
  authMiddleware,
  requireAdmin,
  GetOrderStatusCounts,
);

/**
 * @openapi
 * /admin/orders/{id}:
 *   get:
 *     summary: Get any order's detail by ID (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order detail
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, admin only
 *       404:
 *         description: Order not found
 */
router.get("/orders/:id", authMiddleware, requireAdmin, GetOrderDetailAdmin);

export default router;
