import db from "../lib/db.js";

export default class CategoryModel {
  static async GetAllCategories() {
    const { rows } = await db.query(
      `SELECT id, name FROM categories ORDER BY name ASC`,
    );
    return rows;
  }
}
