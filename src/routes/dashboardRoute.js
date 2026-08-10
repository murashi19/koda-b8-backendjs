import { Router } from "express";
import { GetDashboardSummary } from "../controllers/dashboard.controller.js";
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

export default router;
