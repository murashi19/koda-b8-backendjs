"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });

      Product.hasOne(models.ProductDetail, {
        foreignKey: "product_id",
        as: "detail",
      });

      Product.hasMany(models.ProductImage, {
        foreignKey: "product_id",
        as: "images",
      });

      Product.belongsToMany(models.Tag, {
        through: models.ProductTag,
        foreignKey: "product_id",
        otherKey: "tag_id",
        as: "tags",
      });
      Product.hasMany(models.OrderItem, {
        foreignKey: "product_id",
        as: "orderItems",
      });
    }
  }
  Product.init(
    {
      brand: DataTypes.STRING,
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      category_id: DataTypes.BIGINT,
      regular_price: DataTypes.DECIMAL,
      discount_price: DataTypes.DECIMAL,
      rating: DataTypes.DECIMAL,
      review_count: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return Product;
};
