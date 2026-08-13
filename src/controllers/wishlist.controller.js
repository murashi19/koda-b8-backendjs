import { default as db } from "../models/index.cjs";
import { constants } from "node:http2";

const { Wishlist } = db;

export async function GetWishlist(req, res) {
  try {
    const user_id = req.user.id;

    const wishlist = await Wishlist.findAll({
      where: { user_id },
      include: { association: "product" },
    });

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Wishlist retrieved successfully",
      data: wishlist,
    });
  } catch (error) {
    console.error(error);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve wishlist",
    });
  }
}

export async function CreateWishlist(req, res) {
  try {
    const user_id = req.user.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "product_id wajib diisi",
      });
    }

    const wishlist = await Wishlist.create({ user_id, product_id });

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Product added to wishlist",
      data: wishlist,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(constants.HTTP_STATUS_CONFLICT).json({
        success: false,
        message: "Product already in wishlist",
      });
    }
    console.error(error);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to add product to wishlist",
    });
  }
}

export async function DeleteWishlist(req, res) {
  try {
    const user_id = req.user.id;
    const { product_id } = req.params;

    if (!product_id) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "product_id wajib diisi",
      });
    }

    const deleted = await Wishlist.destroy({
      where: { user_id, product_id },
    });

    if (!deleted) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error(error);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to remove product from wishlist",
    });
  }
}
