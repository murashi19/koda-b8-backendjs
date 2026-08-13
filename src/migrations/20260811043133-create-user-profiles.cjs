"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("user_profiles", {
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,

        references: {
          model: "users",
          key: "id",
        },

        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      full_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },

      avatar: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      gender: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },

      birth_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("user_profiles");
  },
};
