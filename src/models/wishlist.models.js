import db from "../lib/db.js";

export default class WishlistModel {
  static async GetWishlist(user_id) {
    const query = `
      SELECT
        p.id,
        p.brand,
        p.name,
        p.image,
        c.name AS category_name,
        p.regular_price,
        p.discount_price,
        p.rating,
        p.review_count,
        p.stock,
        w.created_at AS wishlisted_at
      FROM wishlists w
      JOIN products p ON p.id = w.product_id
      JOIN categories c ON c.id = p.category_id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC
    `;
    const { rows } = await db.query(query, [user_id]);
    return rows;
  }
  // CREATE
  static async CreateWishlist(user_id, product_id) {
    try {
      const query = `
        INSERT INTO wishlists (user_id, product_id)
        VALUES ($1, $2)
        RETURNING *
      `;
      const { rows } = await db.query(query, [user_id, product_id]);
      return rows[0];
    } catch (error) {
      if (error.code === "23505") {
        const err = new Error("Product already in wishlist");
        err.code = "DUPLICATE_WISHLIST";
        throw err;
      }
      throw error;
    }
  }
  // DELETE
  static async DeleteWishlist(user_id, product_id) {
    const query = `
      DELETE FROM wishlists
      WHERE user_id = $1 AND product_id = $2
      RETURNING *
    `;
    const { rows } = await db.query(query, [user_id, product_id]);
    return rows[0];
  }
}
