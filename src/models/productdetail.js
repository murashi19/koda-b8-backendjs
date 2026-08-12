"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductDetail.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  ProductDetail.init(
    {
      product_id: DataTypes.BIGINT,
      description: DataTypes.TEXT,
      specifications: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "ProductDetail",
      tableName: "product_details",
      underscored: true,
    },
  );
  return ProductDetail;
};
