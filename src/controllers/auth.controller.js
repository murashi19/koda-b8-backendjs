import UserModel from "../models/user.models.js";
import { constants } from "node:http2";
import bcrypt from "bcrypt";

export async function register(req, res) {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Email, password and full name are required",
      });
    }

    const existing = await UserModel.findByEmail(email);

    if (existing) {
      return res.status(constants.HTTP_STATUS_CONFLICT).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      full_name,
      role: "CUSTOMER",
    });

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Registered successfully",
      data: newUser,
    });
  } catch (err) {
    console.error(err);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}
