import express from "express";

import {
  GetAllProduct,
  CreateProduct,
  GetProductById,
  UpdateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import authMiddleware from "../middleware/auth.js";
import requireAdmin from "../middleware/admin.js";
import {
  uploadProductImage,
  handleUploadError,
} from "../middleware/uploadProduct.js";
const router = express.Router();

/**
 * @openapi
 * /products:
 *  get:
 *    summary: Get All Products
 *    tags: [Products]
 *    responses:
 *      200:
 *        description: All Products List
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                    example: 1
 *                  brand:
 *                    type: string
 *                    example: "Nike"
 *                  name:
 *                    type: string
 *                    example: "Air Max 90"
 *                  image:
 *                    type: string
 *                    example: "https://example.com/image.jpg"
 *                  category_name:
 *                    type: string
 *                    example: "Fashion"
 *                  regular_price:
 *                    type: number
 *                    example: 1200000
 *                  discount_price:
 *                    type: number
 *                    nullable: true
 *                    example: 999000
 *                  rating:
 *                    type: number
 *                    example: 4.5
 *                  stock:
 *                    type: integer
 *                    example: 50
 *      500:
 *        description: Failed to fetch Products
 */
router.get("/", GetAllProduct);

/**
 * @openapi
 * /products/{id}:
 *  get:
 *    summary: Get Product by ID to Product Details
 *    tags: [Product Details]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Product ID
 *    responses:
 *      200:
 *        description: Product Details
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                  example: 1
 *                brand:
 *                  type: string
 *                  example: "Nike"
 *                name:
 *                  type: string
 *                  example: "Air Max 90"
 *                image:
 *                  type: string
 *                  example: "https://example.com/image.jpg"
 *                category_name:
 *                  type: string
 *                  example: "Fashion"
 *                description:
 *                  type: string
 *                  nullable: true
 *                  example: "Sepatu lari dengan sol empuk"
 *                specifications:
 *                  type: object
 *                  nullable: true
 *                  example: { "material": "Mesh", "weight": "300g" }
 *                regular_price:
 *                  type: number
 *                  example: 1200000
 *                discount_price:
 *                  type: number
 *                  nullable: true
 *                  example: 999000
 *                rating:
 *                  type: number
 *                  example: 4.5
 *                stock:
 *                  type: integer
 *                  example: 50
 *                created_at:
 *                  type: string
 *                  format: date-time
 *                updated_at:
 *                  type: string
 *                  format: date-time
 *                gallery:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      image_url:
 *                        type: string
 *                      sort_order:
 *                        type: integer
 *                tags:
 *                  type: array
 *                  items:
 *                    type: string
 *                  example: ["running", "sale"]
 *      404:
 *        description: Product not found
 *      500:
 *        description: Failed to fetch product detail
 */
router.get("/:id", GetProductById);

/**
 * @openapi
 * /products:
 *  post:
 *    summary: Create New Product
 *    tags: [Products]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - brand
 *              - name
 *              - category_id
 *              - regular_price
 *            properties:
 *              brand:
 *                type: string
 *                example: "Nike"
 *              name:
 *                type: string
 *                example: "Air Max 90"
 *              image:
 *                type: string
 *                example: "https://example.com/image.jpg"
 *              category_id:
 *                type: integer
 *                example: 1
 *              regular_price:
 *                type: number
 *                example: 1200000
 *              discount_price:
 *                type: number
 *                nullable: true
 *                example: 999000
 *              stock:
 *                type: integer
 *                example: 50
 *    responses:
 *      201:
 *        description: Product created successfully
 *      400:
 *        description: Invalid input / missing required fields
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      500:
 *        description: Failed to create product
 */
router.post(
  "/",
  authMiddleware,
  requireAdmin,
  uploadProductImage.single("image"),
  handleUploadError,
  CreateProduct,
);

/**
 * @openapi
 * /products/{id}:
 *  patch:
 *    summary: Update Product by ID
 *    tags: [Products]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Product ID to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            description: Semua field opsional, hanya field yang dikirim yang akan diupdate
 *            properties:
 *              brand:
 *                type: string
 *                example: "Nike"
 *              name:
 *                type: string
 *                example: "Air Max 90"
 *              image:
 *                type: string
 *                example: "https://example.com/image.jpg"
 *              category_id:
 *                type: integer
 *                example: 1
 *              regular_price:
 *                type: number
 *                example: 1200000
 *              discount_price:
 *                type: number
 *                example: 999000
 *              stock:
 *                type: integer
 *                example: 50
 *    responses:
 *      200:
 *        description: Product updated successfully
 *      400:
 *        description: Invalid input
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      404:
 *        description: Product not found
 *      500:
 *        description: Failed to update product
 */
router.patch(
  "/:id",
  authMiddleware,
  requireAdmin,
  uploadProductImage.single("image"),
  handleUploadError,
  UpdateProduct,
);

/**
 * @openapi
 * /products/{id}:
 *  delete:
 *    summary: Delete Product by ID
 *    tags: [Products]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Product ID to delete
 *    responses:
 *      200:
 *        description: Product deleted successfully
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      403:
 *        description: Forbidden, admin only
 *      404:
 *        description: Product not found
 *      500:
 *        description: Failed to delete product
 */
router.delete("/:id", authMiddleware, requireAdmin, deleteProduct);

export default router;
