import db from "../lib/db.js";

export default class CartModel {
  static async GetCart(userId) {
    const { rows } = await db.query(
      `
      SELECT
        ci.id,
        ci.quantity,
        ci.is_selected,
        p.id AS product_id,
        p.name,
        p.brand,
        p.image,
        p.regular_price,
        p.discount_price,
        COALESCE(p.discount_price, p.regular_price) AS price,
        ci.quantity * COALESCE(p.discount_price, p.regular_price) AS subtotal
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = $1
      ORDER BY ci.created_at DESC
      `,
      [userId],
    );
    return rows;
  }

  static async AddToCart(userId, data) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const { rows: productRows } = await client.query(
        `SELECT id, stock FROM products WHERE id = $1 FOR UPDATE`,
        [data.product_id],
      );
      if (productRows.length === 0) {
        throw new Error("Product not found");
      }
      const product = productRows[0];

      const { rows: existingRows } = await client.query(
        `SELECT quantity FROM cart_items WHERE user_id = $1 AND product_id = $2`,
        [userId, data.product_id],
      );

      const newQuantity = (existingRows[0]?.quantity ?? 0) + data.quantity;
      if (newQuantity > product.stock) {
        throw new Error("Stock is not enough");
      }

      const { rows } = await client.query(
        `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, product_id)
        DO UPDATE SET quantity = $3, updated_at = NOW()
        RETURNING *
        `,
        [userId, data.product_id, newQuantity],
      );

      await client.query("COMMIT");
      return rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  static async UpdateQty(userId, cartItemId, qty) {
    const { rows } = await db.query(
      `
      UPDATE cart_items
      SET quantity = $1, updated_at = NOW()
      WHERE id = $2 AND user_id = $3
      RETURNING *
      `,
      [qty, cartItemId, userId],
    );
    return rows[0] || null;
  }

  static async DeleteItem(userId, id) {
    const { rows } = await db.query(
      `
      DELETE FROM cart_items
      WHERE id = $1 AND user_id = $2
      RETURNING *
      `,
      [id, userId],
    );
    return rows[0];
  }
}
