"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
      });
      OrderItem.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  OrderItem.init(
    {
      order_id: DataTypes.BIGINT,
      product_id: DataTypes.BIGINT,
      product_name: DataTypes.STRING,
      product_image: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      qty: DataTypes.INTEGER,
      subtotal: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "order_items",
      underscored: true,
      timestamps: false,
    },
  );
  return OrderItem;
};
