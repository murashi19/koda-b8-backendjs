import db from "../lib/db.js";

export default class TagModel {
  static async GetAllTags() {
    const { rows } = await db.query(
      `SELECT id, name FROM tags ORDER BY id ASC`,
    );
    return rows;
  }
}
