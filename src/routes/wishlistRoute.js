import express from "express";
import {
  CreateWishlist,
  DeleteWishlist,
} from "../controllers/wishlist.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();
router.use(authMiddleware);

/**
 * @openapi
 * /wishlist:
 *  post:
 *    summary: Add Product to Wishlist
 *    tags: [Wishlist]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - product_id
 *            properties:
 *              product_id:
 *                type: integer
 *                example: 5
 *    responses:
 *      201:
 *        description: Product added to wishlist successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: "Product added to wishlist"
 *                data:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                      example: 1
 *                    user_id:
 *                      type: integer
 *                      example: 10
 *                    product_id:
 *                      type: integer
 *                      example: 5
 *      400:
 *        description: product_id is required
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: "product_id wajib diisi"
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      409:
 *        description: Product already in wishlist
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: "Product already in wishlist"
 *      500:
 *        description: Failed to add product to wishlist
 */
router.post("/", CreateWishlist);

/**
 * @openapi
 * /wishlist/{product_id}:
 *  delete:
 *    summary: Remove Product from Wishlist
 *    tags: [Wishlist]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: product_id
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID of the product to remove from wishlist
 *    responses:
 *      200:
 *        description: Product removed from wishlist successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: "Product removed from wishlist"
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      404:
 *        description: Wishlist item not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: "Wishlist item not found"
 *      500:
 *        description: Failed to remove product from wishlist
 */
router.delete("/:product_id", DeleteWishlist);

export default router;
