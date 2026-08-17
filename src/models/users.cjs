"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasOne(models.UserProfiles, {
        foreignKey: "user_id",
        sourceKey: "id",
      });
    }
  }
  Users.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.TEXT,
      role: DataTypes.STRING,
      is_verified: DataTypes.BOOLEAN,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",

      defaultScope: {
        attributes: {
          exclude: ["password"],
        },
      },
      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
        withResetToken: {
          attributes: { include: ["password"] },
        },
      },
    },
  );
  return Users;
};
