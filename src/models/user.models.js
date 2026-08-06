import db from "../lib/db.js";

export default class UserModel {
  static async GetAllUser() {
    const { rows } = await db.query(`SELECT * FROM users ORDER BY id ASC`);
    return rows;
  }
  static async findByEmail(email) {
    const { rows } = await db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    return rows[0];
  }
  static async findByIdUser(userId) {
    const { rows } = await db.query(
      `
    SELECT
      u.id,
      u.email,
      u.role,
      p.full_name
    FROM users u
    JOIN user_profiles p
      ON p.user_id = u.id
    WHERE u.id = $1
    `,
      [userId],
    );

    return rows[0];
  }

  static async create(data) {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // Insert ke tabel users
      const { rows: userRows } = await client.query(
        `
        INSERT INTO users (email, password, role)
        VALUES ($1, $2, $3)
        RETURNING id
        `,
        [data.email, data.password, data.role],
      );

      const userId = userRows[0].id;

      // Insert ke tabel user_profiles
      await client.query(
        `
        INSERT INTO user_profiles (user_id, full_name)
        VALUES ($1, $2)
        `,
        [userId, data.full_name],
      );

      // Ambil data lengkap dari kedua tabel
      const { rows } = await client.query(
        `
        SELECT
          u.id,
          u.email,
          u.role,
          p.full_name
        FROM users u
        JOIN user_profiles p
          ON p.user_id = u.id
        WHERE u.id = $1
        `,
        [userId],
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
  static async Delete(id) {
    const { rows } = await db.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id],
    );
    return rows[0] || null;
  }
}
