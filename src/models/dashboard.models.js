import db from "../lib/db.js";

export default class DashboardModel {
  static async GetStats() {
    const { rows } = await db.query(`
      SELECT
        COALESCE(SUM(total) FILTER (
          WHERE status != 'CANCELLED'
            AND date_trunc('month', created_at) = date_trunc('month', now())
        ), 0) AS revenue_this_month,
        COALESCE(SUM(total) FILTER (
          WHERE status != 'CANCELLED'
            AND date_trunc('month', created_at) = date_trunc('month', now() - interval '1 month')
        ), 0) AS revenue_last_month,
        COUNT(*) FILTER (
          WHERE status != 'CANCELLED'
            AND date_trunc('month', created_at) = date_trunc('month', now())
        ) AS orders_this_month,
        COUNT(*) FILTER (
          WHERE status != 'CANCELLED'
            AND date_trunc('month', created_at) = date_trunc('month', now() - interval '1 month')
        ) AS orders_last_month,
        COUNT(DISTINCT user_id) FILTER (
          WHERE status != 'CANCELLED'
            AND date_trunc('month', created_at) = date_trunc('month', now())
        ) AS customers_this_month,
        COUNT(DISTINCT user_id) FILTER (
          WHERE status != 'CANCELLED'
            AND date_trunc('month', created_at) = date_trunc('month', now() - interval '1 month')
        ) AS customers_last_month
      FROM orders
    `);

    const { rows: productRows } = await db.query(`
      SELECT
        COUNT(*) AS active_products,
        COUNT(*) FILTER (
          WHERE date_trunc('month', created_at) = date_trunc('month', now())
        ) AS products_added_this_month,
        COUNT(*) FILTER (
          WHERE date_trunc('month', created_at) = date_trunc('month', now() - interval '1 month')
        ) AS products_added_last_month
      FROM products
    `);

    return { ...rows[0], ...productRows[0] };
  }

  static async GetRevenueByMonth() {
    const { rows } = await db.query(`
      SELECT
        to_char(month, 'Mon') AS month,
        COALESCE(o.revenue, 0) AS revenue,
        COALESCE(o.orders, 0) AS orders
      FROM generate_series(
        date_trunc('month', now() - interval '11 month'),
        date_trunc('month', now()),
        interval '1 month'
      ) AS month
      LEFT JOIN (
        SELECT
          date_trunc('month', created_at) AS month,
          SUM(total) AS revenue,
          COUNT(*) AS orders
        FROM orders
        WHERE status != 'CANCELLED'
        GROUP BY date_trunc('month', created_at)
      ) o ON o.month = month
      ORDER BY month ASC
    `);
    return rows;
  }

  // Persentase pendapatan per kategori
  static async GetCategoryBreakdown() {
    const { rows } = await db.query(`
      SELECT
        c.name AS category,
        COALESCE(SUM(oi.subtotal), 0) AS revenue
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      LEFT JOIN order_items oi ON oi.product_id = p.id
      LEFT JOIN orders o ON o.id = oi.order_id AND o.status != 'CANCELLED'
      GROUP BY c.name
      ORDER BY revenue DESC
    `);
    return rows;
  }

  static async GetRecentOrders(limit = 5) {
    const { rows } = await db.query(
      `
      SELECT o.id, o.order_code, o.total, o.status, o.created_at, up.full_name
      FROM orders o
      JOIN user_profiles up ON up.user_id = o.user_id
      ORDER BY o.created_at DESC
      LIMIT $1
      `,
      [limit],
    );
    return rows;
  }

  static async GetTopProducts(limit = 5) {
    const { rows } = await db.query(
      `
      SELECT p.id, p.name, COALESCE(SUM(oi.subtotal), 0) AS revenue
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id AND o.status != 'CANCELLED'
      JOIN products p ON p.id = oi.product_id
      GROUP BY p.id, p.name
      ORDER BY revenue DESC
      LIMIT $1
      `,
      [limit],
    );
    return rows;
  }
}
