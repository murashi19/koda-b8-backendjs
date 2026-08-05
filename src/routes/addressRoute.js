import { Router } from "express";
import {
  GetAllAddress,
  GetAddressById,
  CreateAddress,
  UpdateAddress,
  DeleteAddress,
} from "../controllers/address.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * components:
 *  schemas:
 *    Address:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 1
 *        user_profile_id:
 *          type: integer
 *          example: 10
 *        label:
 *          type: string
 *          example: "Rumah"
 *        province:
 *          type: string
 *          example: "Jawa Barat"
 *        city:
 *          type: string
 *          example: "Cimahi"
 *        district:
 *          type: string
 *          nullable: true
 *          example: "Cimahi Selatan"
 *        subdistrict:
 *          type: string
 *          nullable: true
 *          example: "Leuwigajah"
 *        postal_code:
 *          type: string
 *          nullable: true
 *          example: "40532"
 *        address:
 *          type: string
 *          example: "Jl. Contoh No. 123"
 *        note:
 *          type: string
 *          nullable: true
 *          example: "Dekat minimarket"
 *        is_default:
 *          type: boolean
 *          example: true
 *        full_name:
 *          type: string
 *          example: "Rafli Ahmad"
 *        phone_number:
 *          type: string
 *          example: "081234567890"
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 */

/**
 * @openapi
 * /addresses:
 *  get:
 *    summary: Get All Addresses
 *    tags: [Address]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of user's addresses
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
 *                  example: "Get address successfully"
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Address"
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      500:
 *        description: Internal server error
 */
router.get("/", GetAllAddress);

/**
 * @openapi
 * /addresses/{id}:
 *  get:
 *    summary: Get Address by ID
 *    tags: [Address]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Address ID
 *    responses:
 *      200:
 *        description: Address detail
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
 *                  example: "Get address successfully"
 *                data:
 *                  $ref: "#/components/schemas/Address"
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      404:
 *        description: Address not found
 *      500:
 *        description: Internal server error
 */
router.get("/:id", GetAddressById);

/**
 * @openapi
 * /addresses:
 *  post:
 *    summary: Create New Address
 *    tags: [Address]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - label
 *              - province
 *              - city
 *              - address
 *            properties:
 *              label:
 *                type: string
 *                example: "Rumah"
 *              province:
 *                type: string
 *                example: "Jawa Barat"
 *              city:
 *                type: string
 *                example: "Cimahi"
 *              district:
 *                type: string
 *                example: "Cimahi Selatan"
 *              subdistrict:
 *                type: string
 *                example: "Leuwigajah"
 *              postal_code:
 *                type: string
 *                example: "40532"
 *              address:
 *                type: string
 *                example: "Jl. Contoh No. 123"
 *              note:
 *                type: string
 *                example: "Dekat minimarket"
 *              is_default:
 *                type: boolean
 *                example: false
 *    responses:
 *      201:
 *        description: Address created successfully
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
 *                  example: "Address created successfully"
 *                data:
 *                  $ref: "#/components/schemas/Address"
 *      400:
 *        description: Label, province, city and address are required
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      500:
 *        description: Internal server error
 */
router.post("/", CreateAddress);

/**
 * @openapi
 * /addresses/{id}:
 *  put:
 *    summary: Update Address by ID
 *    tags: [Address]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Address ID to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            description: Semua field opsional, hanya field yang dikirim yang akan diupdate
 *            properties:
 *              label:
 *                type: string
 *                example: "Rumah"
 *              province:
 *                type: string
 *                example: "Jawa Barat"
 *              city:
 *                type: string
 *                example: "Cimahi"
 *              district:
 *                type: string
 *                example: "Cimahi Selatan"
 *              subdistrict:
 *                type: string
 *                example: "Leuwigajah"
 *              postal_code:
 *                type: string
 *                example: "40532"
 *              address:
 *                type: string
 *                example: "Jl. Contoh No. 123"
 *              note:
 *                type: string
 *                example: "Dekat minimarket"
 *              is_default:
 *                type: boolean
 *                example: true
 *    responses:
 *      200:
 *        description: Address updated successfully
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
 *                  example: "Address updated successfully"
 *                data:
 *                  $ref: "#/components/schemas/Address"
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      404:
 *        description: Address not found
 *      500:
 *        description: Internal server error
 */
router.put("/:id", UpdateAddress);

/**
 * @openapi
 * /addresses/{id}:
 *  delete:
 *    summary: Delete Address by ID
 *    tags: [Address]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: Address ID to delete
 *    responses:
 *      200:
 *        description: Address deleted successfully
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
 *                  example: "Address deleted successfully"
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      404:
 *        description: Address not found
 *      500:
 *        description: Internal server error
 */
router.delete("/:id", DeleteAddress);

export default router;
