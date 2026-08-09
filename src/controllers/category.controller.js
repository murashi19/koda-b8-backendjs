import { constants } from "node:http2";
import CategoryModel from "../models/category.models.js";

export async function GetAllCategories(req, res) {
  try {
    const categories = await CategoryModel.GetAllCategories();
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
