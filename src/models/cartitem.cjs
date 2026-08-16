"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CartItem.belongsTo(models.Users, {
        foreignKey: "user_id",
        as: "user",
      });
      CartItem.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  CartItem.init(
    {
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      quantity: DataTypes.INTEGER,
      is_selected: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "CartItem",
      tableName: "cart_items",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return CartItem;
};
