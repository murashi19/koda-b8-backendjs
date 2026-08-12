"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductTag.init(
    {
      product_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },

      tag_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "ProductTag",
      tableName: "product_tags",
      underscored: true,
      timestamps: false,
    },
  );
  return ProductTag;
};
