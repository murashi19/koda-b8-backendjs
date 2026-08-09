import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  GetCart,
  AddToCart,
  UpdateCartQty,
  DeleteCartItem,
} from "../controllers/cart.controller.js";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * components:
 *  schemas:
 *    CartItem:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 1
 *        quantity:
 *          type: integer
 *          example: 2
 *        is_selected:
 *          type: boolean
 *          example: true
 *        product_id:
 *          type: integer
 *          example: 5
 *        name:
 *          type: string
 *          example: "Air Max 90"
 *        brand:
 *          type: string
 *          example: "Nike"
 *        image:
 *          type: string
 *          example: "https://example.com/image.jpg"
 *        regular_price:
 *          type: number
 *          example: 1200000
 *        discount_price:
 *          type: number
 *          nullable: true
 *          example: 999000
 *        price:
 *          type: number
 *          description: discount_price jika ada, kalau tidak pakai regular_price
 *          example: 999000
 *        subtotal:
 *          type: number
 *          example: 1998000
 */

/**
 * @openapi
 * /carts:
 *  get:
 *    summary: Get User's Cart
 *    tags: [Cart]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of cart items
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
 *                  example: "Get cart successfully"
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/CartItem"
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      500:
 *        description: Internal server error
 */
router.get("/", GetCart);

/**
 * @openapi
 * /carts:
 *  post:
 *    summary: Add Product to Cart
 *    description: Jika produk sudah ada di cart, quantity akan ditambahkan (bukan mengganti).
 *    tags: [Cart]
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
 *              quantity:
 *                type: integer
 *                default: 1
 *                example: 2
 *    responses:
 *      201:
 *        description: Product added to cart successfully
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
 *                  example: "Product added to cart"
 *                data:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                      example: 1
 *                    product_id:
 *                      type: integer
 *                      example: 5
 *                    quantity:
 *                      type: integer
 *                      example: 2
 *      400:
 *        description: Product is required
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      500:
 *        description: Internal server error (termasuk kasus stok tidak cukup / produk tidak ditemukan, lihat catatan di bawah)
 */
router.post("/", AddToCart);

router.patch("/:id", UpdateCartQty);
/**
 * @openapi
 * /carts/{id}:
 *  delete:
 *    summary: Remove Item from Cart
 *    tags: [Cart]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Cart item ID to remove
 *    responses:
 *      200:
 *        description: Item removed from cart successfully
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
 *                  example: "Item removed from cart"
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      404:
 *        description: Cart item not found
 *      500:
 *        description: Internal server error
 */
router.delete("/:id", DeleteCartItem);
// router.patch("/:id", UpdateQuantity);

export default router;
