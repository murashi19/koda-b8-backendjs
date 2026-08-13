import { constants } from "node:http2";
import { default as db } from "../models/index.cjs";

const { Tag } = db;
export async function GetAllTags(req, res) {
  try {
    const tags = await Tag.findAll();
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Lists Tag",
      data: tags,
    });
  } catch (error) {
    console.error(error);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch tags",
    });
  }
}
