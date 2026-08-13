import { default as db } from "../models/index.cjs";
import { constants } from "node:http2";
import path from "node:path";
import { uploadToCloudinary } from "../lib/cloudinary.js";

const { UserProfiles, Users } = db;

export async function GetProfileById(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "User id is required",
    });
  }

  try {
    const userProfile = await UserProfiles.findByPk(id, {
      include: [
        {
          model: Users,
          attributes: ["email"],
        },
      ],
    });

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
    const [updateRow] = await UserProfiles.update(data, {
      where: { user_id: id },
    });
    if (updateRow === 0) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User profile not found",
      });
    }
    const updatedProfile = await UserProfiles.findByPk(id);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Update Profile Successfully",
      data: updatedProfile,
    });
  } catch (err) {
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

  // Pastikan file ada
  if (!req.file) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "File avatar tidak ditemukan",
    });
  }

  try {
    // Upload buffer dari Multer ke Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "avatars",
      public_id: `user-${id}`,
      overwrite: true,
    });

    // Simpan URL Cloudinary + public ID ke database
    const [updatedRows] = await UserProfiles.update(
      {
        avatar: result.secure_url,
        avatar_public_id: result.public_id,
      },
      {
        where: {
          user_id: id,
        },
      },
    );

    if (updatedRows === 0) {
      logError(`Profile not found for user ${id}`);

      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User profile not found",
      });
    }

    const updatedProfile = await UserProfiles.findOne({
      where: {
        user_id: id,
      },
    });

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Upload Avatar Successfully",
      data: updatedProfile,
    });
  } catch (err) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}
