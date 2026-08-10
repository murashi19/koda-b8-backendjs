import { constants } from "node:http2";
import DashboardModel from "../models/dashboard.models.js";

function pctChange(current, previous) {
  const curr = Number(current) || 0;
  const prev = Number(previous) || 0;
  if (prev === 0) return curr > 0 ? 100 : 0;
  return ((curr - prev) / prev) * 100;
}

export async function GetDashboardSummary(req, res) {
  try {
    const [
      stats,
      revenueByMonth,
      categoryBreakdown,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      DashboardModel.GetStats(),
      DashboardModel.GetRevenueByMonth(),
      DashboardModel.GetCategoryBreakdown(),
      DashboardModel.GetRecentOrders(5),
      DashboardModel.GetTopProducts(5),
    ]);

    const totalCategoryRevenue = categoryBreakdown.reduce(
      (sum, c) => sum + Number(c.revenue),
      0,
    );

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Dashboard summary",
      data: {
        stats: {
          revenueThisMonth: Number(stats.revenue_this_month),
          revenueChangePct: pctChange(
            stats.revenue_this_month,
            stats.revenue_last_month,
          ),
          ordersThisMonth: Number(stats.orders_this_month),
          ordersChangePct: pctChange(
            stats.orders_this_month,
            stats.orders_last_month,
          ),
          activeCustomersThisMonth: Number(stats.customers_this_month),
          customersChangePct: pctChange(
            stats.customers_this_month,
            stats.customers_last_month,
          ),
          activeProducts: Number(stats.active_products),
          productsChangePct: pctChange(
            stats.products_added_this_month,
            stats.products_added_last_month,
          ),
        },
        revenueByMonth: revenueByMonth.map((r) => ({
          month: r.month,
          revenue: Number(r.revenue),
          orders: Number(r.orders),
        })),
        categoryBreakdown: categoryBreakdown.map((c) => ({
          label: c.category,
          revenue: Number(c.revenue),
          pct:
            totalCategoryRevenue > 0
              ? (Number(c.revenue) / totalCategoryRevenue) * 100
              : 0,
        })),
        recentOrders: recentOrders.map((o) => ({
          id: o.id,
          orderCode: o.order_code,
          customerName: o.full_name,
          total: Number(o.total),
          status: o.status,
          createdAt: o.created_at,
        })),
        topProducts: topProducts.map((p) => ({
          id: p.id,
          name: p.name,
          revenue: Number(p.revenue),
        })),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch dashboard summary",
    });
  }
}
