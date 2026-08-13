"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const adminPassword = await bcrypt.hash("admin123", 10);
    const customerPassword = await bcrypt.hash("customer123", 10);
    await queryInterface.bulkInsert("users", [
      {
        email: "admin@example.com",
        password: adminPassword,
        role: "ADMIN",
        is_verified: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "customer@example.com",
        password: customerPassword,
        role: "CUSTOMER",
        is_verified: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users", {
      email: {
        [Sequelize.Op.in]: ["admin@example.com", "customer@example.com"],
      },
    });
  },
};
