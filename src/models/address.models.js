import db from "../lib/db.js";

export default class AddressModel {
  static async getAll(userId) {
    const { rows } = await db.query(
      `
      SELECT
        a.*,
        up.full_name,
        up.phone_number
      FROM addresses a
      JOIN user_profiles up
        ON up.user_id = a.user_profile_id
      WHERE up.user_id = $1
      ORDER BY a.is_default DESC, a.id DESC
      `,
      [userId],
    );

    return rows;
  }

  static async getById(id, userId) {
    const { rows } = await db.query(
      `
      SELECT
        a.*,
        up.full_name,
        up.phone_number
      FROM addresses a
      JOIN user_profiles up
        ON up.user_id = a.user_profile_id
      WHERE a.id = $1
      AND up.user_id = $2
      `,
      [id, userId],
    );

    return rows[0];
  }

  static async create(userId, data) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const profile = await client.query(
        `
        SELECT user_id
        FROM user_profiles
        WHERE user_id=$1
        `,
        [userId],
      );

      const profileId = profile.rows[0].user_id;

      if (data.is_default) {
        await client.query(
          `
          UPDATE addresses
          SET is_default = false
          WHERE user_profile_id=$1
          `,
          [profileId],
        );
      }

      const { rows } = await client.query(
        `
        INSERT INTO addresses(
          user_profile_id,
          label,
          province,
          city,
          district,
          subdistrict,
          postal_code,
          address,
          note,
          is_default
        )
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *
        `,
        [
          profileId,
          data.label,
          data.province,
          data.city,
          data.district,
          data.subdistrict,
          data.postal_code,
          data.address,
          data.note,
          data.is_default ?? false,
        ],
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

  static async update(id, userId, data) {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const profile = await client.query(
        `
        SELECT user_id
        FROM user_profiles
        WHERE user_id=$1
        `,
        [userId],
      );

      const profileId = profile.rows[0].user_id;

      if (data.is_default) {
        await client.query(
          `
          UPDATE addresses
          SET is_default=false
          WHERE user_profile_id=$1
          `,
          [profileId],
        );
      }

      const { rows } = await client.query(
        `
        UPDATE addresses
        SET
          label=COALESCE($1,label),
          province=COALESCE($2,province),
          city=COALESCE($3,city),
          district=COALESCE($4,district),
          subdistrict=COALESCE($5,subdistrict),
          postal_code=COALESCE($6,postal_code),
          address=COALESCE($7,address),
          note=COALESCE($8,note),
          is_default=COALESCE($9,is_default),
          updated_at=NOW()
        WHERE id=$10
        AND user_profile_id=$11
        RETURNING *
        `,
        [
          data.label,
          data.province,
          data.city,
          data.district,
          data.subdistrict,
          data.postal_code,
          data.address,
          data.note,
          data.is_default,
          id,
          profileId,
        ],
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

  static async delete(id, userId) {
    const { rows } = await db.query(
      `
      DELETE FROM addresses
      WHERE id=$1
      AND user_profile_id=(
        SELECT id
        FROM user_profiles
        WHERE user_id=$2
      )
      RETURNING *
      `,
      [id, userId],
    );

    return rows[0];
  }
}
