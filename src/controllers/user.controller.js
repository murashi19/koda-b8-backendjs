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

export async function UpdateUser(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "User id not available",
    });
  }
  try {
    const editUser = await UserModel.Update(id, req.body);
    if (!editUser) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Update User Successfully",
      data: editUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
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
