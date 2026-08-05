import { constants } from "node:http2";
import OrderModel from "../models/order.models.js";

const SHIPPING_METHODS = {
  "jne-reg": 0,
  "jne-exp": 0,
  "same-day": 0,
};

const PAYMENT_METHODS = ["bca", "bni", "card", "gopay", "ovo", "dana"];

export async function Checkout(req, res) {
  try {
    const userId = req.user.id;
    const { addressId, shippingMethod, paymentMethod } = req.body;

    if (!addressId) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "addressId wajib diisi (pilih alamat dari /addresses)",
      });
    }

    if (!Object.hasOwn(SHIPPING_METHODS, shippingMethod)) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "shippingMethod tidak valid",
      });
    }

    if (!PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "paymentMethod tidak valid",
      });
    }

    const order = await OrderModel.CreateOrderFromCart(userId, {
      addressId,
      shippingMethod,
      paymentMethod,
      shippingCost: SHIPPING_METHODS[shippingMethod],
    });

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Order created",
      data: order,
    });
  } catch (error) {
    if (error.code === "ADDRESS_NOT_FOUND") {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: error.message,
      });
    }
    if (error.code === "EMPTY_CART") {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Keranjang kosong, tidak bisa checkout",
      });
    }
    if (error.code === "OUT_OF_STOCK") {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
    console.error(error);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to checkout",
    });
  }
}

export async function GetOrders(req, res) {
  try {
    const orders = await OrderModel.GetOrders(req.user.id);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Get orders successfully",
      data: orders,
    });
  } catch (err) {
    console.error(err);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function GetOrderDetail(req, res) {
  try {
    const { id } = req.params;

    const order = await OrderModel.GetOrderDetail(req.user.id, id);

    if (!order.length) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Get order successfully",
      data: order,
    });
  } catch (err) {
    console.error(err);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function UpdateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Status is required",
      });
    }

    const order = await OrderModel.UpdateStatus(id, status);

    if (!order) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (err) {
    console.error(err);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function GetAllOrders(req, res) {
  try {
    const orders = await OrderModel.GetAllOrders();
    return res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
