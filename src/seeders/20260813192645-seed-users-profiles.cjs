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
    const [users] = await queryInterface.sequelize.query(`
      SELECT id, email
      FROM users
      WHERE email IN (
        'admin@belimudah.com',
        'rafli@gmail.com'
      )
    `);

    const userMap = Object.fromEntries(
      users.map((user) => [user.email, user.id]),
    );

    const profiles = [];

    if (userMap["admin@belimudah.com"]) {
      profiles.push({
        user_id: userMap["admin@belimudah.com"],
        full_name: "Administrator",
        phone_number: "081111111111",
        avatar: "https://i.pravatar.cc/300?img=1",
        gender: "male",
        birth_date: "2000-01-01",
      });
    }

    if (userMap["rafli@gmail.com"]) {
      profiles.push({
        user_id: userMap["rafli@gmail.com"],
        full_name: "Muhamad Rafli",
        phone_number: "082222222222",
        avatar: "https://i.pravatar.cc/300?img=2",
        gender: "male",
        birth_date: "2003-06-10",
      });
    }

    for (const profile of profiles) {
      const [existing] = await queryInterface.sequelize.query(
        `
        SELECT user_id
        FROM user_profiles
        WHERE user_id = :user_id
        `,
        {
          replacements: {
            user_id: profile.user_id,
          },
        },
      );

      if (existing.length === 0) {
        await queryInterface.bulkInsert("user_profiles", [profile]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("user_profiles", {
      phone_number: ["081111111111", "082222222222"],
    });
  },
};
