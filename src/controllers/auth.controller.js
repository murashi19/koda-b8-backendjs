import { constants } from "node:http2";
import bcrypt from "bcrypt";
import { signToken } from "../lib/jwt.js";
import { default as db } from "../models/index.cjs";
import { logSuccess, logError, logInfo } from "../lib/logger.js";

const { Users, UserProfiles, sequelize } = db;

export async function register(req, res) {
  let email;
  try {
    let full_name, password, role;
    ({ email, password, full_name, role } = req.body);

    logInfo(`Register attempt for ${email}`);

    if (!email || !password || !full_name) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Email, password and full name are required",
      });
    }

    const existing = await Users.findOne({ where: { email } });

    if (existing) {
      logError(`Register failed for ${email}: email already registered`);
      return res.status(constants.HTTP_STATUS_CONFLICT).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const transaction = await sequelize.transaction();

    try {
      const newUser = await Users.create(
        {
          email,
          password: hashedPassword,
          role: role || "CUSTOMER",
        },
        { transaction },
      );

      const profile = await UserProfiles.create(
        {
          user_id: newUser.id,
          full_name,
        },
        { transaction },
      );

      await transaction.commit();
      logSuccess(`User registered: ${newUser.email} (id: ${newUser.id})`);

      return res.status(constants.HTTP_STATUS_CREATED).json({
        success: true,
        message: "Registered successfully",
        data: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          full_name: profile.full_name,
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (err) {
    logError(`Register failed for ${email}: ${err.message}`);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function login(req, res) {
  let email;
  try {
    let password;
    ({ email, password } = req.body);

    logInfo(`Login attempt for ${email}`);

    if (!email || !password) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Email or Password required",
      });
    }

    const user = await Users.scope("withPassword").findOne({
      where: { email },
      include: [{ model: UserProfiles }],
    });

    if (!user) {
      logError(`Login failed for ${email}: user not found`);
      return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logError(`Login failed for ${email}: incorrect password`);
      return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    logSuccess(`User logged in: ${user.email} (id: ${user.id})`);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Login Successfully",
      token,
      result: {
        id: user.id,
        email: user.email,
        full_name: user.UserProfile?.full_name ?? null,
        role: user.role,
      },
    });
  } catch (err) {
    logError(`Login failed for ${email}: ${err.message}`);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}
