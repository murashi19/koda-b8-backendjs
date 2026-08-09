import { constants } from "node:http2";
import CartModel from "../models/cart.models.js";

export async function GetCart(req, res) {
  try {
    const cart = await CartModel.GetCart(req.user.id);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Get cart successfully",
      data: cart,
    });
  } catch (err) {
    console.error(err);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function AddToCart(req, res) {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Product is required",
      });
    }

    const cart = await CartModel.AddToCart(req.user.id, {
      product_id,
      quantity: quantity || 1,
    });

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });
  } catch (err) {
    console.error(err);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function UpdateCartQty(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Quantity is required and must be at least 1",
      });
    }

    const updated = await CartModel.UpdateQty(userId, id, quantity);

    if (!updated) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Cart item not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Quantity updated",
      data: updated,
    });
  } catch (err) {
    console.error(err);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function DeleteCartItem(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await CartModel.DeleteItem(userId, id);

    if (!deleted) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Cart item not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (err) {
    console.error(err);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}
