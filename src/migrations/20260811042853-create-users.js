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
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        CREATE TYPE "user_role" AS ENUM (
          'CUSTOMER',
          'ADMIN'
        );
        `,
        { transaction },
      );

      await queryInterface.createTable(
        "users",
        {
          id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },

          email: {
            type: Sequelize.STRING(255),
            allowNull: false,
            unique: true,
          },

          password: {
            type: Sequelize.TEXT,
            allowNull: false,
          },

          role: {
            type: Sequelize.ENUM("CUSTOMER", "ADMIN"),
            allowNull: true,
            defaultValue: "CUSTOMER",
          },

          is_verified: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },

          is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
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
        },
        { transaction },
      );

      await queryInterface.addIndex("users", ["email"], {
        name: "idx_users_email",
        transaction,
      });

      await queryInterface.addIndex("users", ["role"], {
        name: "idx_users_role",
        transaction,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable("users", { transaction });

      await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "user_role";`, {
        transaction,
      });
    });
  },
};
