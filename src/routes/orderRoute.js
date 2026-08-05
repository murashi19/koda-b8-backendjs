import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  Checkout,
  GetOrders,
  GetOrderDetail,
  UpdateOrderStatus,
} from "../controllers/order.controller.js";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * components:
 *  schemas:
 *    OrderItem:
 *      type: object
 *      properties:
 *        product_id:
 *          type: integer
 *          example: 5
 *        name:
 *          type: string
 *          example: "Air Max 90"
 *        image:
 *          type: string
 *          example: "https://example.com/image.jpg"
 *        price:
 *          type: number
 *          example: 999000
 *        qty:
 *          type: integer
 *          example: 2
 *        subtotal:
 *          type: number
 *          example: 1998000
 *    Order:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 1
 *        order_code:
 *          type: string
 *          example: "INV-1735999999999-42"
 *        user_id:
 *          type: integer
 *          example: 10
 *        status:
 *          type: string
 *          example: "pending"
 *        subtotal:
 *          type: number
 *          example: 1998000
 *        shipping_cost:
 *          type: number
 *          example: 0
 *        total:
 *          type: number
 *          example: 1998000
 *        shipping_method:
 *          type: string
 *          example: "jne-reg"
 *        payment_method:
 *          type: string
 *          example: "gopay"
 *        address_id:
 *          type: integer
 *          example: 3
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 *        items:
 *          type: array
 *          items:
 *            $ref: "#/components/schemas/OrderItem"
 */

/**
 * @openapi
 * /orders:
 *  post:
 *    summary: Checkout (Create Order from Cart)
 *    description: Membuat order dari seluruh isi cart user, mengurangi stok produk, lalu mengosongkan cart. Semua item cart ikut ter-checkout (tidak berdasarkan seleksi item).
 *    tags: [Orders]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - addressId
 *              - shippingMethod
 *              - paymentMethod
 *            properties:
 *              addressId:
 *                type: integer
 *                example: 3
 *              shippingMethod:
 *                type: string
 *                enum: [jne-reg, jne-exp, same-day]
 *                example: "jne-reg"
 *              paymentMethod:
 *                type: string
 *                enum: [bca, bni, card, gopay, ovo, dana]
 *                example: "gopay"
 *    responses:
 *      201:
 *        description: Order created successfully
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
 *                  example: "Order created"
 *                data:
 *                  $ref: "#/components/schemas/Order"
 *      400:
 *        description: addressId/shippingMethod/paymentMethod tidak valid, cart kosong, atau stok tidak cukup
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      404:
 *        description: Alamat tidak ditemukan
 *      500:
 *        description: Failed to checkout
 */
router.post("/", Checkout);

/**
 * @openapi
 * /orders:
 *  get:
 *    summary: Get User's Order List
 *    tags: [Orders]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of user's orders
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
 *                  example: "Get orders successfully"
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Order"
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      500:
 *        description: Internal server error
 */
router.get("/", GetOrders);

/**
 * @openapi
 * /orders/{id}:
 *  get:
 *    summary: Get Order Detail by ID
 *    tags: [Orders]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Order ID
 *    responses:
 *      200:
 *        description: Order detail (flat rows, satu baris per order item)
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
 *                  example: "Get order successfully"
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    description: Gabungan kolom orders + satu order_item + info produk
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      404:
 *        description: Order not found
 *      500:
 *        description: Internal server error
 */
router.get("/:id", GetOrderDetail);

/**
 * @openapi
 * /orders/{id}/status:
 *  patch:
 *    summary: Update Order Status
 *    tags: [Orders]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Order ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - status
 *            properties:
 *              status:
 *                type: string
 *                example: "shipped"
 *    responses:
 *      200:
 *        description: Order status updated successfully
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
 *                  example: "Order updated successfully"
 *                data:
 *                  $ref: "#/components/schemas/Order"
 *      400:
 *        description: Status is required
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      404:
 *        description: Order not found
 *      500:
 *        description: Internal server error
 */
router.patch("/:id/status", UpdateOrderStatus);

export default router;
