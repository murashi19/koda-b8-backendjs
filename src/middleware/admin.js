import { constants } from "node:http2";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {function()} next
 */
function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(constants.HTTP_STATUS_FORBIDDEN).json({
      success: false,
      message: "Forbidden: hanya admin yang boleh mengakses ini",
    });
  }
  next();
}

export default requireAdmin;
