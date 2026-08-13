"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const categories = [
      "Fashion",
      "Elektronik",
      "Kecantikan",
      "Rumah & Dapur",
      "Olahraga",
      "Buku & Alat Tulis",
    ];

    for (const name of categories) {
      const [existing] = await queryInterface.sequelize.query(
        `
        SELECT id
        FROM categories
        WHERE name = :name
        LIMIT 1
        `,
        {
          replacements: { name },
        },
      );

      if (existing.length === 0) {
        await queryInterface.bulkInsert("categories", [
          {
            name,
          },
        ]);
      }
    }
    const tags = ["new", "flash", "best", "star-seller", "free-shipping"];

    for (const name of tags) {
      const [existing] = await queryInterface.sequelize.query(
        `
        SELECT id
        FROM tags
        WHERE name = :name
        LIMIT 1
        `,
        {
          replacements: { name },
        },
      );

      if (existing.length === 0) {
        await queryInterface.bulkInsert("tags", [
          {
            name,
          },
        ]);
      }
    }
  },

  async down(queryInterface) {
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

    await queryInterface.bulkDelete("tags", {
      name: ["new", "flash", "best", "star-seller", "free-shipping"],
    });
  },
};
