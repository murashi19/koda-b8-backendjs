import { constants } from "node:http2";
import { verifyToken } from "../lib/jwt.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {function()} next
 */
function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized: token tidak ditemukan",
    });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      full_name: decoded.full_name,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized: token tidak valid atau kadaluarsa",
    });
  }
}

export default authMiddleware;
