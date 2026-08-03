import db from "../lib/db.js";

export default class UserModel {
  static async findByEmail(email) {
    const { rows } = await db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return rows[0];
  }

  static async create(data) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const userResult = await client.query(
        `INSERT INTO users (email, password, role) VALUES ($1,$2,$3) RETURNING id`,
        [data.email, data.password, data.role],
      );

      const user = userResult.rows[0];

      await client.query(
        `INSERT INTO user_profiles (user_id, full_name) VALUES ($1, $2)`,
        [user.id, data.full_name],
      );

      await client.query("COMMIT");

      return user;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}
