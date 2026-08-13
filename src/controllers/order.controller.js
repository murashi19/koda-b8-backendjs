import { constants } from "node:http2";
import { default as db } from "../models/index.cjs";

const {
  Order,
  OrderItem,
  CartItem,
  Product,
  Addresses,
  UserProfiles,
  Users,
  sequelize,
} = db;

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

    const shippingCost = SHIPPING_METHODS[shippingMethod] || 0;

    const order = await sequelize.transaction(async (t) => {
      const address = await Addresses.findOne({
        where: { id: addressId, user_profile_id: userId },
        transaction: t,
      });
      if (!address) {
        const err = new Error("Alamat tidak ditemukan");
        err.code = "ADDRESS_NOT_FOUND";
        throw err;
      }

      const cartItems = await CartItem.findAll({
        where: { user_id: userId },
        transaction: t,
      });
      if (cartItems.length === 0) {
        const err = new Error("Cart is empty");
        err.code = "EMPTY_CART";
        throw err;
      }

      // lock baris produk biar aman dari race condition stok
      const products = await Product.findAll({
        where: { id: cartItems.map((ci) => ci.product_id) },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      const productMap = new Map(products.map((p) => [p.id, p]));

      const outOfStock = cartItems.find((ci) => {
        const product = productMap.get(ci.product_id);
        return !product || ci.quantity > product.stock;
      });
      if (outOfStock) {
        const product = productMap.get(outOfStock.product_id);
        const err = new Error(
          `Stok "${product?.name ?? "produk"}" tidak mencukupi (sisa ${product?.stock ?? 0})`,
        );
        err.code = "OUT_OF_STOCK";
        throw err;
      }

      const itemsPayload = cartItems.map((ci) => {
        const product = productMap.get(ci.product_id);
        const price = Number(product.discount_price ?? product.regular_price);
        return {
          product_id: product.id,
          name: product.name,
          image: product.image,
          price,
          qty: ci.quantity,
          subtotal: price * ci.quantity,
        };
      });

      const subtotal = itemsPayload.reduce(
        (sum, item) => sum + item.subtotal,
        0,
      );
      const total = subtotal + shippingCost;
      const orderCode = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // STATUS LUNAS karena belum pakai payment gateway atau payment manual
      const newOrder = await Order.create(
        {
          order_code: orderCode,
          user_id: userId,
          status: "PAID",
          subtotal,
          shipping_cost: shippingCost,
          total,
          shipping_method: shippingMethod,
          payment_method: paymentMethod,
          address_id: addressId,
        },
        { transaction: t },
      );

      await OrderItem.bulkCreate(
        itemsPayload.map((item) => ({
          order_id: newOrder.id,
          product_id: item.product_id,
          product_name: item.name,
          product_image: item.image,
          price: item.price,
          qty: item.qty,
          subtotal: item.subtotal,
        })),
        { transaction: t },
      );

      for (const item of itemsPayload) {
        await Product.decrement("stock", {
          by: item.qty,
          where: { id: item.product_id },
          transaction: t,
        });
      }

      await CartItem.destroy({ where: { user_id: userId }, transaction: t });

      newOrder.dataValues.items = itemsPayload;
      return newOrder;
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
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: { model: OrderItem, as: "items" },
      order: [["created_at", "DESC"]],
    });

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

    const order = await Order.findOne({
      where: { id, user_id: req.user.id },
      include: [
        { model: OrderItem, as: "items" },
        { model: Addresses, as: "address" },
      ],
    });

    if (!order) {
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

    const isAdmin = req.user.role === "ADMIN";
    if (!isAdmin && status !== "PAID") {
      return res.status(constants.HTTP_STATUS_FORBIDDEN).json({
        success: false,
        message: "Kamu hanya bisa menandai pesanan sebagai sudah dibayar",
      });
    }

    const where = isAdmin ? { id } : { id, user_id: req.user.id };
    const [count] = await Order.update({ status }, { where });

    if (!count) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = await Order.findByPk(id);

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
    const orders = await Order.findAll({
      include: [
        { model: Users, as: "user", attributes: ["email"] },
        { model: UserProfiles, as: "customer", attributes: ["full_name"] },
        { model: OrderItem, as: "items", attributes: ["id"] },
      ],
      order: [["created_at", "DESC"]],
    });

    const data = orders.map((o) => {
      const json = o.toJSON();
      json.item_count = json.items.length;
      delete json.items;
      return json;
    });

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function GetOrderDetailAdmin(req, res) {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        { model: Users, as: "user", attributes: ["email"] },
        { model: UserProfiles, as: "customer", attributes: ["full_name"] },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "image"],
            },
          ],
        },
        { model: Addresses, as: "address" },
      ],
    });

    if (!order) {
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
