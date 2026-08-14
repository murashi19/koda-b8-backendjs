"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_items", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      order_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "orders",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      product_id: {
        type: Sequelize.BIGINT,
        references: {
          model: "products",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      product_name: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      product_image: {
        type: Sequelize.STRING(500),
      },
      price: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
      },
      qty: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      subtotal: {
        allowNull: false,
        type: Sequelize.DECIMAL(14, 2),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("order_items");
  },
};
