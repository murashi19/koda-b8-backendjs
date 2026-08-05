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

router.get("/", GetAllAddress);
router.get("/:id", GetAddressById);
router.post("/", CreateAddress);
router.put("/:id", UpdateAddress);
router.delete("/:id", DeleteAddress);

export default router;
