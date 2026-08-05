import db from "../lib/db.js";

export default class WishlistModel {
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
