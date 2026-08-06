import UserModel from "../models/user.models.js";
import { constants } from "node:http2";

export async function Destroy(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "User not found",
    });
  }
  const destroy = await UserModel.Delete(id);
  res.json({
    success: true,
    message: "Deleted user successfully",
  });
}
