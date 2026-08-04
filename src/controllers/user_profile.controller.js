import UserProfileModel from "../models/user_profile.models.js";
import { constants } from "node:http2";
import path from "node:path";

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

export async function UpdateProfileById(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "User id is required",
    });
  }
  // hanya boleh update profilenya sendiri
  if (req.user.role !== "ADMIN" && String(req.user.id) !== String(id)) {
    return res.status(constants.HTTP_STATUS_FORBIDDEN).json({
      success: false,
      message: "Forbidden: kamu tidak ada akses mengubah profile user lain",
    });
  }
  // mengabaikan avatar karena nanti upload file
  const { avatar, ...data } = req.body || {};
  if (!data || Object.keys(data).length === 0) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "No data to update",
    });
  }

  try {
    const updatedProfile = await UserProfileModel.UpdateProfile(id, data);
    if (!updatedProfile) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Update Profile Successfully",
      data: updatedProfile,
    });
  } catch (err) {
    console.error(err);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function UploadAvatarById(req, res) {
  const { id } = req.params;
  if (req.user.role !== "ADMIN" && String(req.user.id) !== String(id)) {
    return res.status(constants.HTTP_STATUS_FORBIDDEN).json({
      success: false,
      message: "Forbidden: kamu tidak ada akses mengubah avatar user lain",
    });
  }
  if (!req.file) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "File avatar tidak ditemukan",
    });
  }

  // path fisik di disk misalnya: public/uploads/avatars/2026-08-04/12-1735999999999.jpg
  // yang disimpan ke DB cuma path relatif publiknya, bukan path asli di server
  const publicPath = path
    .relative("public", req.file.path)
    .split(path.sep)
    .join("/");
  const avatarUrl = `/${publicPath}`;

  try {
    const updatedProfile = await UserProfileModel.UpdateProfile(id, {
      avatar: avatarUrl,
    });

    if (!updatedProfile) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Upload Avatar Successfully",
      data: updatedProfile,
    });
  } catch (err) {
    console.error(err);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}
