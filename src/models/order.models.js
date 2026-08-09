import db from "../lib/db.js";

export default class OrderModel {
  static async CreateOrderFromCart(userId, payload) {
    const { shippingMethod, paymentMethod, shippingCost, addressId } = payload;
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const { rows: addressRows } = await client.query(
        `SELECT * FROM addresses WHERE id = $1 AND user_profile_id = $2`,
        [addressId, userId],
      );
      const address = addressRows[0];
      if (!address) {
        // ambil cart + lock baris produk biar aman dari race condition stok
        const err = new Error("Alamat tidak ditemukan");
        err.code = "ADDRESS_NOT_FOUND";
        throw err;
      }

      // ambil cart + lock baris produk biar aman dari race condition stok
      const { rows: cartRows } = await client.query(
        `
        SELECT
          ci.product_id,
          ci.quantity,
          p.name,
          p.image,
          p.stock,
          p.regular_price,
          p.discount_price
        FROM cart_items ci
        JOIN products p ON p.id = ci.product_id
        WHERE ci.user_id = $1
        FOR UPDATE OF p
        `,
        [userId],
      );

      if (cartRows.length === 0) {
        const err = new Error("Cart is empty");
        err.code = "EMPTY_CART";
        throw err;
      }
      // validasi stok
      const outOfStock = cartRows.find((item) => item.quantity > item.stock);
      if (outOfStock) {
        const err = new Error(
          `Stok "${outOfStock.name}" tidak mencukupi (sisa ${outOfStock.stock})`,
        );
        err.code = "OUT_OF_STOCK";
        throw err;
      }
      const subtotal = cartRows.reduce((sum, item) => {
        const price = Number(item.discount_price ?? item.regular_price);
        return sum + price * item.quantity;
      }, 0);
      const total = subtotal + Number(shippingCost || 0);
      const orderCode = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const status = "PENDING";
      const { rows: orderRows } = await client.query(
        `
        INSERT INTO orders
          (order_code, user_id, status, subtotal, shipping_cost, total,
           shipping_method, payment_method,
           address_id,
           created_at, updated_at)
        VALUES
          ($1, $2, $3, $4, $5, $6,
           $7, $8,
           $9,
           now(), now())
        RETURNING *
        `,
        [
          orderCode,
          userId,
          status,
          subtotal,
          shippingCost || 0,
          total,
          shippingMethod,
          paymentMethod,
          addressId,
        ],
      );
      const order = orderRows[0];

      // insert order_items + kurangi stok
      for (const item of cartRows) {
        const price = Number(item.discount_price ?? item.regular_price);
        await client.query(
          `
          INSERT INTO order_items
            (order_id, product_id, product_name, product_image, price, qty, subtotal)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          `,
          [
            order.id,
            item.product_id,
            item.name,
            item.image,
            price,
            item.quantity,
            price * item.quantity,
          ],
        );

        await client.query(
          `UPDATE products SET stock = stock - $1, updated_at = now() WHERE id = $2`,
          [item.quantity, item.product_id],
        );
      }

      // kosongkan cart
      await client.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);
      await client.query("COMMIT");
      order.items = cartRows.map((item) => ({
        product_id: item.product_id,
        name: item.name,
        image: item.image,
        price: Number(item.discount_price ?? item.regular_price),
        qty: item.quantity,
        subtotal:
          Number(item.discount_price ?? item.regular_price) * item.quantity,
      }));

      return order;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  static async GetOrders(userId) {
    const { rows } = await db.query(
      `
    SELECT
      o.*,
      COALESCE(
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'name', oi.product_name,
            'image', oi.product_image,
            'price', oi.price,
            'qty', oi.qty,
            'subtotal', oi.subtotal
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
    `,
      [userId],
    );
    return rows;
  }

  static async GetOrderDetail(userId, orderId) {
    const { rows } = await db.query(
      `
      SELECT
          o.*,
          oi.product_id,
          oi.price,
          oi.qty,
          oi.subtotal,
          p.name,
          p.image
      FROM orders o
      JOIN order_items oi
          ON oi.order_id = o.id
      JOIN products p
          ON p.id = oi.product_id
      WHERE o.user_id = $1
      AND o.id = $2
      `,
      [userId, orderId],
    );

    return rows;
  }

  static async UpdateStatus(orderId, status) {
    const { rows } = await db.query(
      `
      UPDATE orders
      SET
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [status, orderId],
    );

    return rows[0];
  }

  static async GetAllOrders() {
    const { rows } = await db.query(
      `
    SELECT
      o.*,
      up.full_name
    FROM orders o
    JOIN users u
      ON u.id = o.user_id
    JOIN user_profiles up
      ON up.user_id = u.id
    ORDER BY o.created_at DESC
    `,
    );

    return rows;
  }
}
