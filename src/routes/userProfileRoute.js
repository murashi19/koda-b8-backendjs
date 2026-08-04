import express from "express";
import authMiddleware from "../middleware/auth.js";
import { GetProfileById } from "../controllers/user_profile.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/:id", GetProfileById);

export default router;
