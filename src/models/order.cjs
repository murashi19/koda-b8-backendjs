"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.Users, {
        foreignKey: "user_id",
        as: "user",
      });
      Order.belongsTo(models.UserProfiles, {
        foreignKey: "user_id",
        targetKey: "user_id",
        as: "customer",
      });
      Order.belongsTo(models.Addresses, {
        foreignKey: "address_id",
        as: "address",
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: "order_id",
        as: "items",
      });
    }
  }
  Order.init(
    {
      order_code: DataTypes.STRING,
      user_id: DataTypes.BIGINT,
      status: DataTypes.ENUM(
        "PENDING",
        "PAID",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ),
      subtotal: DataTypes.DECIMAL,
      shipping_cost: DataTypes.DECIMAL,
      total: DataTypes.DECIMAL,
      shipping_method: DataTypes.STRING,
      payment_method: DataTypes.STRING,
      address_id: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return Order;
};
