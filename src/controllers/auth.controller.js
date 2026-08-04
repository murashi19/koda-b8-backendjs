import UserModel from "../models/user.models.js";
import { constants } from "node:http2";
import bcrypt from "bcrypt";
import { signToken } from "../lib/jwt.js";

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

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Email or Password required",
    });
  }

  const user = await UserModel.findByEmail(email);
  if (!user) {
    return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Incorrect password",
    });
  }

  // TODO TOKEN
  const token = signToken(user);

  const userId = await UserModel.findByIdUser(user.id);
  console.log(userId);
  res.json({
    success: true,
    message: "Login Successfully",
    token: token,
    result: {
      id: user.id,
      email: user.email,
      full_name: userId.full_name,
    },
  });
}
