"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TYPE "order_status" AS ENUM (
        'PENDING',
        'PAID',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED'
      );
    `);

    await queryInterface.createTable("orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      order_code: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(50),
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "users",
          key: "id",
        },
      },
      address_id: {
        type: Sequelize.BIGINT,
        references: {
          model: "addresses",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      shipping_method: {
        allowNull: false,
        type: Sequelize.STRING(30),
      },
      payment_method: {
        allowNull: false,
        type: Sequelize.STRING(30),
      },
      shipping_cost: {
        allowNull: false,
        type: Sequelize.DECIMAL(14, 2),
        defaultValue: 0,
      },
      subtotal: {
        allowNull: false,
        type: Sequelize.DECIMAL(14, 2),
      },
      total: {
        allowNull: false,
        type: Sequelize.DECIMAL(14, 2),
      },
      status: {
        type: '"order_status"',
        defaultValue: "PENDING",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("orders");
  },
};
