import db from "../lib/db.js";

export default class UserProfileModel {
  static async GetUserById(userId) {
    const { rows } = await db.query(
      `SELECT * FROM user_profiles WHERE user_id = $1`,
      [userId],
    );
    return rows[0];
  }
}
