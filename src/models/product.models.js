import db from "../lib/db.js";

export default class ProductModel {
  // READ - semua produk (list/card view)
  static async GetAllProduct() {
    const { rows } = await db.query(`
      SELECT
        p.id,
        p.brand,
        p.name,
        p.image,
        p.category_id,
        c.name AS category_name,
        p.regular_price,
        p.discount_price,
        p.rating,
        p.review_count,
        p.stock,
        MAX(pd.description) AS description,
        COALESCE(
          array_agg(t.name) FILTER (WHERE t.name IS NOT NULL),
          '{}'
        ) AS tags
      FROM products p
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_details pd ON pd.product_id = p.id
      LEFT JOIN product_tags pt ON pt.product_id = p.id
      LEFT JOIN tags t ON t.id = pt.tag_id
      GROUP BY p.id, c.name
      ORDER BY p.created_at ASC
    `);
    return rows;
  }

  // READ - detail produk by ID
  static async GetProductByID(productId) {
    const productResult = await db.query(
      `
      SELECT
        p.id,
        p.brand,
        p.name,
        p.image,
        c.name AS category_name,
        pd.description,
        pd.specifications,
        p.regular_price,
        p.discount_price,
        p.rating,
        p.stock,
        p.created_at,
        p.updated_at
      FROM products p
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_details pd ON pd.product_id = p.id
      WHERE p.id = $1
      `,
      [productId],
    );
    const product = productResult.rows[0];
    if (!product) {
      return null;
    }
    // IMAGE
    const imagesResult = await db.query(
      `
      SELECT image_url, sort_order
      FROM product_images
      WHERE product_id = $1
      ORDER BY sort_order
      `,
      [productId],
    );
    // TAGS
    const tagsResult = await db.query(
      `
      SELECT t.name
      FROM product_tags pt
      JOIN tags t ON t.id = pt.tag_id
      WHERE pt.product_id = $1
      `,
      [productId],
    );
    product.gallery = imagesResult.rows;
    product.tags = tagsResult.rows.map((row) => row.name);

    return product;
  }

  // CREATE
  static async CreateProduct(data) {
    const {
      brand,
      name,
      image,
      category_id,
      regular_price,
      discount_price,
      stock,
      description,
      tagIds,
    } = data;

    const { rows } = await db.query(
      `
      INSERT INTO products
        (brand, name, image, category_id, regular_price, discount_price, stock, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now())
      RETURNING *
      `,
      [brand, name, image, category_id, regular_price, discount_price, stock],
    );
    const product = rows[0];

    if (description) {
      await db.query(
        `INSERT INTO product_details (product_id, description) VALUES ($1, $2)`,
        [product.id, description],
      );
    }

    if (Array.isArray(tagIds) && tagIds.length > 0) {
      await ProductModel.SetProductTags(product.id, tagIds);
      product.tags = await ProductModel.GetProductTagNames(product.id);
    } else {
      product.tags = [];
    }

    return product;
  }

  // Ganti seluruh tag produk (dipakai create & update) — hapus yang lama, insert yang baru.
  static async SetProductTags(productId, tagIds) {
    await db.query(`DELETE FROM product_tags WHERE product_id = $1`, [
      productId,
    ]);
    if (!Array.isArray(tagIds) || tagIds.length === 0) return;

    const values = tagIds.map((_, i) => `($1, $${i + 2})`).join(", ");
    await db.query(
      `INSERT INTO product_tags (product_id, tag_id) VALUES ${values}
       ON CONFLICT DO NOTHING`,
      [productId, ...tagIds],
    );
  }

  static async GetProductTagNames(productId) {
    const { rows } = await db.query(
      `SELECT t.name FROM product_tags pt
       JOIN tags t ON t.id = pt.tag_id
       WHERE pt.product_id = $1`,
      [productId],
    );
    return rows.map((r) => r.name);
  }

  // UPDATE
  static async UpdateProduct(productId, data, tagIds) {
    const {
      brand,
      name,
      image,
      category_id,
      regular_price,
      discount_price,
      stock,
      description,
    } = data;

    const discountPriceValue =
      discount_price === undefined
        ? undefined
        : discount_price === "" || discount_price === null
          ? null
          : discount_price;

    const { rows } = await db.query(
      `
    UPDATE products
    SET
      brand = COALESCE($1, brand),
      name = COALESCE($2, name),
      image = COALESCE($3, image),
      category_id = COALESCE($4, category_id),
      regular_price = COALESCE($5, regular_price),
      discount_price = CASE WHEN $9 THEN $6 ELSE discount_price END,
      stock = COALESCE($7, stock),
      updated_at = now()
    WHERE id = $8
    RETURNING *
    `,
      [
        brand,
        name,
        image,
        category_id,
        regular_price,
        discountPriceValue ?? null,
        stock,
        productId,
        discountPriceValue !== undefined,
      ],
    );
    const product = rows[0] || null;
    if (!product) return null;

    // product_details belum punya UNIQUE(product_id), jadi upsert manual: cek dulu baru insert/update
    if (description !== undefined) {
      const existing = await db.query(
        `SELECT id FROM product_details WHERE product_id = $1`,
        [productId],
      );
      if (existing.rows[0]) {
        await db.query(
          `UPDATE product_details SET description = $1, updated_at = now() WHERE product_id = $2`,
          [description, productId],
        );
      } else {
        await db.query(
          `INSERT INTO product_details (product_id, description) VALUES ($1, $2)`,
          [productId, description],
        );
      }
    }

    if (tagIds !== undefined) {
      await ProductModel.SetProductTags(productId, tagIds);
    }
    product.tags = await ProductModel.GetProductTagNames(productId);

    return product;
  }

  // DELETE
  static async DeleteProduct(productId) {
    const { rows } = await db.query(
      `DELETE FROM products WHERE id = $1 RETURNING *`,
      [productId],
    );
    return rows[0] || null;
  }
}
