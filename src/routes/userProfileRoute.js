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
router.get("/:id", GetProfileById);
router.patch("/:id", UpdateProfileById);
router.put("/:id/avatar", uploadAvatar.single("avatar"), UploadAvatarById);

export default router;
