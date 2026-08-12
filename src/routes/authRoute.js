import express from "express";

import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * @openapi
 * components:
 *  schemas:
 *    RegisterInput:
 *      type: object
 *      required: [fullname, email, password, confirm_password]
 *      properties:
 *        fullname:
 *          type: string
 *          example: admin belimudah
 *        email:
 *          type: string
 *          example: admin@gmail.com
 *        password:
 *          type: string
 *          example: secret123
 *        confirm_password:
 *          type: string
 *          example: secret123
 *    LoginInput:
 *      type: object
 *      required: [email, password]
 *      properties:
 *        email:
 *          type: string
 *          example: admin@gmail.com
 *        password:
 *          type: string
 *          example: secret123
 */

/**
 * @openapi
 * /auth/register:
 *  post:
 *    summary: Register New Users
 *    tags: [Auth Register]
 *    security: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RegisterInput'
 *    responses:
 *      201:
 *        description: Registered Successfully
 *      409:
 *        description: Email is already registered
 *      400:
 *        description: Email, password and fullname are required
 *      500:
 *        description: Internal server error
 *
 */
router.post("/register", register);

/**
 * @openapi
 * /auth/login:
 *  post:
 *    summary: Login user and get JWT token
 *    tags: [Auth Login]
 *    security: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginInput'
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/LoginInput'
 *    responses:
 *      200:
 *        description: Login Successfully
 *      404:
 *        description: Email or Password required
 *      401:
 *        description: Invalid email or password / Incorrect Password
 */
router.post("/login", login);

export default router;
