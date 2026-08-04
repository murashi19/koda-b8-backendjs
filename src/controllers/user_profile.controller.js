import UserProfileModel from "../models/user_profile.models.js";
import { constants } from "node:http2";

export async function GetProfileById(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "User id is required",
    });
  }

  try {
    const userProfile = await UserProfileModel.GetUserById(id);

    if (!userProfile) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Get User Successfully",
      data: userProfile,
    });
  } catch (err) {
    console.error(err);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}
