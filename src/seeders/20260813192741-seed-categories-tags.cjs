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
    const categories = [
      "Fashion",
      "Elektronik",
      "Kecantikan",
      "Rumah & Dapur",
      "Olahraga",
      "Buku & Alat Tulis",
    ];

    for (const name of categories) {
      await queryInterface.sequelize.query(
        `
        INSERT INTO categories (name)
        VALUES (:name)
        ON CONFLICT (name) DO NOTHING
        `,
        {
          replacements: { name },
        },
      );
    }

    const tags = ["new", "flash", "best", "star-seller", "free-shipping"];

    for (const name of tags) {
      await queryInterface.sequelize.query(
        `
        INSERT INTO tags (name)
        VALUES (:name)
        ON CONFLICT (name) DO NOTHING
        `,
        {
          replacements: { name },
        },
      );
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("tags", {
      name: ["new", "flash", "best", "star-seller", "free-shipping"],
    });

    await queryInterface.bulkDelete("categories", {
      name: [
        "Fashion",
        "Elektronik",
        "Kecantikan",
        "Rumah & Dapur",
        "Olahraga",
        "Buku & Alat Tulis",
      ],
    });
  },
};
