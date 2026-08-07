import db from "../lib/db.js";

export default class UserProfileModel {
  static async GetUserById(userId) {
    const { rows } = await db.query(
      `SELECT up.*, u.email
        FROM user_profiles p
        JOIN users u ON u.id = up.user_id 
       WHERE user_id = $1`,
      [userId],
    );
    return rows[0];
  }

  static async UpdateProfile(userId, data) {
    const { full_name, phone_number, avatar, birth_date, gender } = data;

    const { rows } = await db.query(
      `UPDATE user_profiles
       SET full_name = COALESCE($1, full_name),
           phone_number = COALESCE($2, phone_number),
           avatar = COALESCE($3, avatar),
           birth_date = COALESCE($4, birth_date),
           gender = COALESCE($5, gender),
           updated_at = NOW()
       WHERE user_id = $6
       RETURNING *`,
      [full_name, phone_number, avatar, birth_date, gender, userId],
    );

    return rows[0];
  }
}
