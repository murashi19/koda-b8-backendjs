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
    await queryInterface.bulkInsert("user_profiles", [
      {
        user_id: 6,
        full_name: "Admin User",
        phone_number: "081234567890",
        avatar: null,
        gender: "MALE",
        birth_date: "1995-01-10",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 7,
        full_name: "Customer User",
        phone_number: "081234567891",
        avatar: null,
        gender: "FEMALE",
        birth_date: "1998-05-20",
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
    await queryInterface.bulkDelete("user_profiles", {
      user_id: {
        [Sequelize.Op.in]: [1, 2],
      },
    });
  },
};
