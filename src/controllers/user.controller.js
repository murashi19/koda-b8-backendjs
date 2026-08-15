// import UserModel from "../models/user.models.js";
import { default as db } from "../models/index.cjs";
import { constants } from "node:http2";
import { Op, fn, col } from "sequelize";

const { Users, UserProfiles, Addresses, Order } = db;

// GET ALL CUSTOMERS (admin) — Users + UserProfiles + order stats + default address city
export async function GetAllUser(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100,
    );
    const offset = (page - 1) * limit;

    const search = req.query.search || {};
    const keyword = typeof search.name === "string" ? search.name.trim() : "";

    const where = { role: "CUSTOMER" };
    if (keyword) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${keyword}%` } },
        { "$UserProfile.full_name$": { [Op.iLike]: `%${keyword}%` } },
      ];
    }

    const { rows, count } = await Users.findAndCountAll({
      where,
      include: [
        {
          model: UserProfiles,
          attributes: ["full_name", "phone_number", "avatar"],
          required: true,
        },
      ],
      subQuery: false,
      distinct: true,
      col: "id",
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    const userIds = rows.map((u) => u.id);

    // Order stats per customer (excluding cancelled orders)
    const orderStats = userIds.length
      ? await Order.findAll({
          where: {
            user_id: { [Op.in]: userIds },
            status: { [Op.ne]: "CANCELLED" },
          },
          attributes: [
            "user_id",
            [fn("COUNT", col("id")), "order_count"],
            [fn("SUM", col("total")), "total_spending"],
          ],
          group: ["user_id"],
          raw: true,
        })
      : [];
    const orderStatsMap = new Map(
      orderStats.map((o) => [
        String(o.user_id),
        {
          totalOrders: Number(o.order_count) || 0,
          totalSpending: Number(o.total_spending) || 0,
        },
      ]),
    );

    // Default address (fallback: any address) per customer, for the "city" column
    const addresses = userIds.length
      ? await Addresses.findAll({
          where: { user_profile_id: { [Op.in]: userIds } },
          attributes: ["user_profile_id", "city", "is_default"],
          order: [["is_default", "DESC"]],
          raw: true,
        })
      : [];
    const cityMap = new Map();
    for (const a of addresses) {
      if (!cityMap.has(String(a.user_profile_id))) {
        cityMap.set(String(a.user_profile_id), a.city);
      }
    }

    const data = rows.map((u) => {
      const stats = orderStatsMap.get(String(u.id)) || {
        totalOrders: 0,
        totalSpending: 0,
      };
      return {
        id: u.id,
        email: u.email,
        is_verified: u.is_verified,
        is_active: u.is_active,
        created_at: u.created_at,
        full_name: u.UserProfile?.full_name ?? null,
        phone_number: u.UserProfile?.phone_number ?? null,
        avatar: u.UserProfile?.avatar ?? null,
        city: cityMap.get(String(u.id)) ?? null,
        total_orders: stats.totalOrders,
        total_spending: stats.totalSpending,
      };
    });

    // Overview stats (independent of pagination/search)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalCustomers, newThisMonth, totalOrdersAgg] = await Promise.all([
      Users.count({ where: { role: "CUSTOMER" } }),
      Users.count({
        where: { role: "CUSTOMER", created_at: { [Op.gte]: startOfMonth } },
      }),
      Order.count({ where: { status: { [Op.ne]: "CANCELLED" } } }),
    ]);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Lists Users",
      data,
      stats: {
        total_customers: totalCustomers,
        new_this_month: newThisMonth,
        avg_orders: totalCustomers > 0 ? totalOrdersAgg / totalCustomers : 0,
      },
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNextPage: page * limit < count,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("GetAllUser:", error);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
}

export async function UpdateUser(req, res) {
  const { id } = req.params;
  const { email, password, role, is_verified } = req.body;

  if (!id) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "User id not available",
    });
  }

  try {
    const [updatedRows] = await Users.update(
      {
        email,
        password,
        role,
        is_verified,
      },
      {
        where: { id },
      },
    );

    if (updatedRows === 0) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await Users.findByPk(id);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Update User Successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function Destroy(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "User id not available",
    });
  }
  try {
    const destroy = await Users.destroy({
      where: { id },
    });
    if (destroy === 0) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Deleted user successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}
