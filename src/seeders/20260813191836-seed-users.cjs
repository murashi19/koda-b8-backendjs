"use strict";

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
    const [existing] = await queryInterface.sequelize.query(`
      SELECT email
      FROM users
      WHERE email IN (
        'admin@belimudah.com',
        'rafli@gmail.com'
      )
    `);

    const existingEmails = new Set(existing.map((user) => user.email));

    const users = [
      {
        email: "admin@belimudah.com",
        password:
          "$2a$10$gIUEeph16qrrvVkPqpngeecklFH5PgI.IPKhPy1AHKmiBHWFNswi.",
        role: "ADMIN",
        is_verified: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "rafli@gmail.com",
        password:
          "$2a$10$584FDA1XBgSugyeBP1n3z.F7H3XhPCUrvMK7fgDI/UOl1zq0W4iii",
        role: "CUSTOMER",
        is_verified: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ].filter((user) => !existingEmails.has(user.email));

    if (users.length > 0) {
      await queryInterface.bulkInsert("users", users);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users", {
      email: ["admin@belimudah.com", "rafli@gmail.com"],
    });
  },
};
