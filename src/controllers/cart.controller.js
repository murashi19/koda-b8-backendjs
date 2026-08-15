import { constants } from "node:http2";
import { default as db } from "../models/index.cjs";

const { CartItem, Product, sequelize } = db;

function toCartItemJSON(item) {
  const price = Number(
    item.product.discount_price ?? item.product.regular_price,
  );
  return {
    id: item.id,
    quantity: item.quantity,
    is_selected: item.is_selected,
    product_id: item.product.id,
    name: item.product.name,
    brand: item.product.brand,
    image: item.product.image,
    regular_price: item.product.regular_price,
    discount_price: item.product.discount_price,
    price,
    subtotal: price * item.quantity,
  };
}

export async function GetCart(req, res) {
  try {
    const userId = req.user.id;

    const items = await CartItem.findAll({
      where: { user_id: userId },
      include: { model: Product, as: "product" },
      order: [["created_at", "DESC"]],
    });

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Get cart successfully",
      data: items.map(toCartItemJSON),
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
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    if (!product_id) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Product is required",
      });
    }

    const cartItem = await sequelize.transaction(async (t) => {
      const product = await Product.findByPk(product_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!product) {
        const err = new Error("Product not found");
        err.code = "PRODUCT_NOT_FOUND";
        throw err;
      }

      const existing = await CartItem.findOne({
        where: { user_id: userId, product_id },
        transaction: t,
      });

      const newQuantity = (existing?.quantity ?? 0) + (quantity || 1);
      if (newQuantity > product.stock) {
        const err = new Error("Stock is not enough");
        err.code = "OUT_OF_STOCK";
        throw err;
      }

      if (existing) {
        existing.quantity = newQuantity;
        await existing.save({ transaction: t });
        return existing;
      }

      return CartItem.create(
        { user_id: userId, product_id, quantity: newQuantity },
        { transaction: t },
      );
    });

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Product added to cart",
      data: cartItem,
    });
  } catch (err) {
    if (err.code === "PRODUCT_NOT_FOUND") {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: err.message,
      });
    }
    if (err.code === "OUT_OF_STOCK") {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: err.message,
      });
    }
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

    const [count, rows] = await CartItem.update(
      { quantity },
      { where: { id, user_id: userId }, returning: true },
    );

    if (!count) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Cart item not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Quantity updated",
      data: rows[0],
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

    const deleted = await CartItem.destroy({
      where: { id, user_id: userId },
    });

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
