import express from "express";
import { Destroy } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * /users/{id}:
 *  delete:
 *    summary: Remove user
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: remove user by id
 *    responses:
 *      200:
 *        description: Delete User successfully
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
 *                  example: "Deleted User"
 *      401:
 *        description: Unauthorized, token missing or invalid
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal server error
 */
router.delete("/:id", authMiddleware, Destroy);

export default router;
