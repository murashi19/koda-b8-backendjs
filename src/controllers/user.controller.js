import UserModel from "../models/user.models.js";
import { constants } from "node:http2";

export async function GetAllUser(req, res) {
  try {
    const users = await UserModel.GetAllUser();
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Lists Users",
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
}
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
