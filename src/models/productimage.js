"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductImage.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  ProductImage.init(
    {
      product_id: DataTypes.BIGINT,
      image_url: DataTypes.STRING,
      image_public_id: DataTypes.STRING,
      sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "ProductImage",
      tableName: "product_images",
      underscored: true,
      timestamps: false,
    },
  );
  return ProductImage;
};
