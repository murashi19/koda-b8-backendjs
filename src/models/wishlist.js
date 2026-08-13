"use strict";
const { Model, DATE } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Wishlist.belongsTo(models.Users, {
        foreignKey: "user_id",
        as: "user",
      });
      Wishlist.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  Wishlist.init(
    {
      user_id: {
        type: DataTypes.BIGINT,
        references: {
          model: "users",
          key: "id",
        },
      },
      product_id: {
        type: DataTypes.BIGINT,
        references: {
          model: "products",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Wishlist",
      tableName: "wishlists",
      createdAt: "created_at",
      updatedAt: false,
    },
  );
  return Wishlist;
};
