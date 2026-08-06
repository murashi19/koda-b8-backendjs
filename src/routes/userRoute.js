import express from "express";
import {
  GetAllUser,
  Destroy,
  UpdateUser,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();
router.use(authMiddleware);

/**
 * @openapi
 * /users:
 *  get:
 *    summary: Get All Users
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: All Users List
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
 *                  email:
 *                    type: string
 *                    example: "admin@gmail.com"
 *                  password:
 *                    type: string
 *                    example: "$1wasdddakhcz1392"
 *                  role:
 *                    type: string
 *                    example: "CUSTOMER"
 *                  is_verified:
 *                    type: boolean
 *                    example: true
 *                  is_active:
 *                    type: boolean
 *                    example: true
 *
 *      500:
 *        description: Failed to fetch Users
 */
router.get("/", GetAllUser);

router.patch("/:id", UpdateUser);

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
router.delete("/:id", Destroy);

export default router;
