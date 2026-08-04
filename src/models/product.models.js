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
        c.name AS category_name,
        p.regular_price,
        p.discount_price,
        p.rating,
        p.stock
      FROM products p
      JOIN categories c ON c.id = p.category_id
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
    return rows[0];
  }

  // UPDATE
  static async UpdateProduct(productId, data) {
    const {
      brand,
      name,
      image,
      category_id,
      regular_price,
      discount_price,
      stock,
    } = data;

    const { rows } = await db.query(
      `
    UPDATE products
    SET
      brand = COALESCE($1, brand),
      name = COALESCE($2, name),
      image = COALESCE($3, image),
      category_id = COALESCE($4, category_id),
      regular_price = COALESCE($5, regular_price),
      discount_price = COALESCE($6, discount_price),
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
        discount_price,
        stock,
        productId,
      ],
    );
    return rows[0] || null;
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
