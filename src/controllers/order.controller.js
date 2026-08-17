import { constants } from "node:http2";
import { default as db } from "../models/index.cjs";
import { Op } from "sequelize";

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

const RELATION_SEARCH_COLUMNS = {
  email: { model: "user" },
  full_name: { model: "customer" },
};
const ORDER_SEARCH_COLUMNS = {
  order_code: "partial",
  status: "exact",
  payment_method: "exact",
  shipping_method: "exact",
};
const SORTABLE_COLUMNS = ["created_at", "total", "status", "order_code"];

const PAYMENT_METHODS = ["bca", "bni", "card", "gopay", "ovo", "dana"];

const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export async function GetOrderStatusCounts(req, res) {
  try {
    const rows = await Order.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    const counts = {};
    for (const status of ORDER_STATUSES) counts[status] = 0;

    let all = 0;
    for (const row of rows) {
      const total = Number(row.count) || 0;
      counts[row.status] = total;
      all += total;
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: { all, ...counts },
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
    // ── Paging ──
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100,
    );
    const offset = (page - 1) * limit;

    // ── Sorting ──
    const sortBy = SORTABLE_COLUMNS.includes(req.query.sortBy)
      ? req.query.sortBy
      : "created_at";
    const sortOrder =
      req.query.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const search = req.query.search || {};
    const where = {};
    const userWhere = {};
    const customerWhere = {};
    let keyword;

    for (const [key, rawValue] of Object.entries(search)) {
      const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;
      if (value === undefined || value === null || value === "") continue;

      if (key === "keyword") {
        keyword = value;
        continue;
      }

      if (ORDER_SEARCH_COLUMNS[key]) {
        where[key] =
          ORDER_SEARCH_COLUMNS[key] === "partial"
            ? { [Op.like]: `%${value}%` }
            : value;
        continue;
      }

      if (RELATION_SEARCH_COLUMNS[key]) {
        const target = RELATION_SEARCH_COLUMNS[key].model;
        const clause = { [Op.like]: `%${value}%` };
        if (target === "user") userWhere.email = clause;
        if (target === "customer") customerWhere.full_name = clause;
        continue;
      }
    }
    if (req.query.status && !where.status) {
      where.status = req.query.status;
    }
    if (req.query.dateFrom || req.query.dateTo) {
      where.created_at = {};
      if (req.query.dateFrom)
        where.created_at[Op.gte] = new Date(req.query.dateFrom);
      if (req.query.dateTo)
        where.created_at[Op.lte] = new Date(req.query.dateTo);
    }

    const hasUserFilter = Object.keys(userWhere).length > 0;
    const hasCustomerFilter = Object.keys(customerWhere).length > 0;

    let rows;
    let count;

    if (keyword) {
      const keywordWhere = {
        [Op.or]: [
          { order_code: { [Op.like]: `%${keyword}%` } },
          sequelize.where(sequelize.col("customer.full_name"), {
            [Op.like]: `%${keyword}%`,
          }),
          sequelize.where(sequelize.col("user.email"), {
            [Op.like]: `%${keyword}%`,
          }),
        ],
      };

      const idRows = await Order.findAll({
        where: { ...where, ...keywordWhere },
        include: [
          {
            model: Users,
            as: "user",
            attributes: [],
            where: hasUserFilter ? userWhere : undefined,
            required: false,
          },
          {
            model: UserProfiles,
            as: "customer",
            attributes: [],
            where: hasCustomerFilter ? customerWhere : undefined,
            required: false,
          },
        ],
        attributes: ["id"],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        subQuery: false,
        distinct: true,
      });

      const matchedIds = idRows.map((r) => r.id);

      count = await Order.count({
        where: { ...where, ...keywordWhere },
        include: [
          { model: Users, as: "user", attributes: [], required: false },
          {
            model: UserProfiles,
            as: "customer",
            attributes: [],
            required: false,
          },
        ],
        distinct: true,
        col: "id",
        subQuery: false,
      });

      rows = matchedIds.length
        ? await Order.findAll({
            where: { id: matchedIds },
            include: [
              { model: Users, as: "user", attributes: ["email"] },
              {
                model: UserProfiles,
                as: "customer",
                attributes: ["full_name"],
              },
              { model: OrderItem, as: "items", attributes: ["id"] },
            ],
            order: [[sortBy, sortOrder]],
          })
        : [];
    } else {
      const result = await Order.findAndCountAll({
        where,
        include: [
          {
            model: Users,
            as: "user",
            attributes: ["email"],
            where: hasUserFilter ? userWhere : undefined,
            required: hasUserFilter,
          },
          {
            model: UserProfiles,
            as: "customer",
            attributes: ["full_name"],
            where: hasCustomerFilter ? customerWhere : undefined,
            required: hasCustomerFilter,
          },
          { model: OrderItem, as: "items", attributes: ["id"] },
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        distinct: true, // wajib karena include OrderItem (hasMany)
      });
      rows = result.rows;
      count = result.count;
    }

    const data = rows.map((o) => {
      const json = o.toJSON();
      json.item_count = json.items.length;
      delete json.items;
      return json;
    });

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data,
      pagination: {
        currentPage: page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

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
      const productMap = new Map(products.map((p) => [String(p.id), p]));
      const outOfStock = cartItems.find((ci) => {
        const product = productMap.get(String(ci.product_id));

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
