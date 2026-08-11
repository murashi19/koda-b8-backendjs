// import UserModel from "../models/user.models.js";
import { default as db } from "../models/index.cjs";
import { constants } from "node:http2";

const { Users } = db;

export async function GetAllUser(req, res) {
  try {
    const users = await Users.findAll({ limit: 10 });
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
  const { email, password, role, is_verified } = req.body;

  if (!id) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "User id not available",
    });
  }

  try {
    const [updatedRows] = await Users.update(
      {
        email,
        password,
        role,
        is_verified,
      },
      {
        where: { id },
      },
    );

    if (updatedRows === 0) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await Users.findByPk(id);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Update User Successfully",
      data: updatedUser,
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
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "User id not available",
    });
  }
  try {
    const destroy = await Users.destroy({
      where: { id },
    });
    if (destroy === 0) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Deleted user successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}
