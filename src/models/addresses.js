"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Addresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Addresses.belongsTo(models.UserProfiles, {
        foreignKey: "user_profile_id",
        targetKey: "user_id",
        as: "profile",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Addresses.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      user_profile_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "user_profiles",
          key: "user_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      label: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      province: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      district: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      subdistrict: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      postal_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },

      address: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },

      note: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Addresses",
      tableName: "addresses",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return Addresses;
};
