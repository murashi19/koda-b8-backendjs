import { constants } from "node:http2";
import { default as db } from "../models/index.cjs";

const { Category } = db;
export async function GetAllCategories(req, res) {
  try {
    const categories = await Category.findAll();
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Lists Category",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
}
