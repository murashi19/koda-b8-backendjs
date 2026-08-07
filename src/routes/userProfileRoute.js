import express from "express";
import authMiddleware from "../middleware/auth.js";
import uploadAvatar from "../middleware/upload.js";
import {
  GetProfileById,
  UpdateProfileById,
  UploadAvatarById,
} from "../controllers/user_profile.controller.js";

const router = express.Router();
router.use(authMiddleware);

/**
 * @openapi
 * /profiles/{id}:
 *  get:
 *    summary: Get User Profile by ID
 *    tags: [User Profile]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: User ID
 *    responses:
 *      200:
 *        description: Get user profile successfully
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
 *                  example: "Get User Successfully"
 *                data:
 *                  type: object
 *                  properties:
 *                    user_id:
 *                      type: integer
 *                      example: 10
 *                    full_name:
 *                      type: string
 *                      example: "Rafli Ahmad"
 *                    phone_number:
 *                      type: string
 *                      example: "081234567890"
 *                    avatar:
 *                      type: string
 *                      nullable: true
 *                      example: "/uploads/avatars/2026-08-04/12-123.jpg"
 *                    birth_date:
 *                      type: string
 *                      format: date
 *                      nullable: true
 *                      example: "2000-01-15"
 *                    gender:
 *                      type: string
 *                      nullable: true
 *                      example: "male"
 *                    updated_at:
 *                      type: string
 *                      format: date-time
 *      400:
 *        description: User id is required
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal server error
 */
router.get("/:id", GetProfileById);

/**
 * @openapi
 * /profiles/{id}:
 *  patch:
 *    summary: Update User Profile by ID
 *    description: Hanya pemilik profile sendiri atau ADMIN yang bisa mengubah profile ini. Field `avatar` diabaikan di endpoint ini (gunakan endpoint upload avatar terpisah).
 *    tags: [User Profile]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: User ID to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            description: Semua field opsional, hanya field yang dikirim yang akan diupdate
 *            properties:
 *              full_name:
 *                type: string
 *                example: "Rafli Ahmad"
 *              phone_number:
 *                type: string
 *                example: "081234567890"
 *              birth_date:
 *                type: string
 *                format: date
 *                example: "2000-01-15"
 *              gender:
 *                type: string
 *                example: "male"
 *    responses:
 *      200:
 *        description: Profile updated successfully
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
 *                  example: "Update Profile Successfully"
 *                data:
 *                  type: object
 *                  properties:
 *                    user_id:
 *                      type: integer
 *                      example: 10
 *                    full_name:
 *                      type: string
 *                      example: "Rafli Ahmad"
 *                    phone_number:
 *                      type: string
 *                      example: "081234567890"
 *                    avatar:
 *                      type: string
 *                      nullable: true
 *                    birth_date:
 *                      type: string
 *                      format: date
 *                    gender:
 *                      type: string
 *      400:
 *        description: User id is required / No data to update
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      403:
 *        description: Forbidden, tidak ada akses mengubah profile user lain
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal server error
 */
router.patch("/:id", UpdateProfileById);

/**
 * @openapi
 * /profiles/{id}/avatar:
 *  put:
 *    summary: Upload/Update User Avatar
 *    description: Hanya pemilik profile sendiri atau ADMIN yang bisa mengubah avatar ini.
 *    tags: [User Profile]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: User ID
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required:
 *              - avatar
 *            properties:
 *              avatar:
 *                type: string
 *                format: binary
 *                description: File gambar avatar
 *    responses:
 *      200:
 *        description: Avatar uploaded successfully
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
 *                  example: "Upload Avatar Successfully"
 *                data:
 *                  type: object
 *                  properties:
 *                    user_id:
 *                      type: integer
 *                      example: 10
 *                    avatar:
 *                      type: string
 *                      example: "/uploads/avatars/2026-08-04/12-123.jpg"
 *      400:
 *        description: File avatar tidak ditemukan
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      403:
 *        description: Forbidden, tidak ada akses mengubah avatar user lain
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal server error
 */
router.put("/:id/avatar", uploadAvatar.single("avatar"), UploadAvatarById);

export default router;
