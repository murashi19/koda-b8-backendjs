"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProfiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserProfiles.belongsTo(models.Users, {
        foreignKey: "user_id",
        targetKey: "id",
        onDelete: "CASCADE",
      });
    }
  }
  UserProfiles.init(
    {
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      avatar: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      gender: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "UserProfiles",
      tableName: "user_profiles",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return UserProfiles;
};
