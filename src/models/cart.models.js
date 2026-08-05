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
        COALESCE(
            p.discount_price,
            p.regular_price
        ) AS price,
        ci.quantity *
        COALESCE(
            p.discount_price,
            p.regular_price
        ) AS subtotal
      FROM carts c
      JOIN cart_items ci
      ON ci.id =c.id
      JOIN products p
      ON p.id=ci.product_id
      WHERE c.user_id=$1
      ORDER BY ci.created_at DESC
      `,
      [userId],
    );
    return rows;
  }

  static async FindCart(userId) {
    const { rows } = await db.query(
      `
      SELECT *
      FROM carts
      WHERE user_id=$1
      `,
      [userId],
    );
    return rows[0];
  }

  static async CreateCart(userId) {
    const { rows } = await db.query(
      `
      INSERT INTO carts(user_id)
      VALUES($1)
      RETURNING *
      `,
      [userId],
    );
    return rows[0];
  }

  static async AddToCart(userId, data) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      // Cari cart user
      let { rows: cartRows } = await client.query(
        `
      SELECT id
      FROM carts
      WHERE user_id = $1
      `,
        [userId],
      );
      if (cartRows.length === 0) {
        const { rows } = await client.query(
          `
        INSERT INTO carts(user_id)
        VALUES($1)
        RETURNING id
        `,
          [userId],
        );
        cartRows = rows;
      }

      const cartId = cartRows[0].id;
      // Validasi produk
      const { rows: productRows } = await client.query(
        `
      SELECT
        id,
        stock
      FROM products
      WHERE id = $1
      `,
        [data.product_id],
      );
      if (productRows.length === 0) {
        throw new Error("Product not found");
      }
      const product = productRows[0];
      // Cek stok
      if (product.stock < data.quantity) {
        throw new Error("Stock is not enough");
      }
      // Cek apakah produk sudah ada di cart
      const { rows: cartItemRows } = await client.query(
        `
      SELECT
        id,
        quantity
      FROM cart_items
      WHERE id = $1
      AND product_id = $2
      `,
        [cartId, data.product_id],
      );
      // Jika sudah ada, update quantity
      if (cartItemRows.length > 0) {
        const newQuantity = cartItemRows[0].quantity + data.quantity;
        if (newQuantity > product.stock) {
          throw new Error("Stock is not enough");
        }
        const { rows } = await client.query(
          `
        UPDATE cart_items
        SET
          quantity = $1,
          updated_at = NOW()
        WHERE id = $2
        RETURNING *
        `,
          [newQuantity, cartItemRows[0].id],
        );

        await client.query("COMMIT");

        return rows[0];
      }

      // Jika belum ada, insert item baru
      const { rows } = await client.query(
        `
      INSERT INTO cart_items(
        user_id,
        product_id,
        quantity
      )
      VALUES($1,$2,$3)
      RETURNING *
      `,
        [userId, data.product_id, data.quantity],
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

  // static async UpdateQty(userId, cartId, qty) {
  //   const { rows } = await db.query(
  //     `
  //     UPDATE cart_items
  //     SET quantity = $1, updated_at = now()
  //     WHERE user_id = $2 AND id = $3
  //     RETURNING *
  //     `,
  //     [qty, userId, cartId],
  //   );
  //   return rows[0] || null;
  // }

  static async DeleteItem(userId, id) {
    const { rows } = await db.query(
      `
      DELETE FROM cart_items
      WHERE id=$1
      AND id=(
          SELECT id
          FROM carts
          WHERE user_id=$2
      )
      RETURNING *
      `,
      [id, userId],
    );
    return rows[0];
  }
}
