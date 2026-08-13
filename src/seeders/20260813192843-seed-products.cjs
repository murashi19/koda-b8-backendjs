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
    const products = [
      {
        brand: "Nike",
        name: "Nike Air Max 270",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        category_id: 1,
        regular_price: 2500000,
        discount_price: 2100000,
        rating: 4.8,
        review_count: 312,
        stock: 30,
      },
      {
        brand: "Apple",
        name: "iPhone 15 Pro",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
        category_id: 2,
        regular_price: 18999000,
        discount_price: 17999000,
        rating: 4.9,
        review_count: 501,
        stock: 15,
      },
      {
        brand: "Wardah",
        name: "Wardah UV Shield",
        image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a",
        category_id: 3,
        regular_price: 65000,
        discount_price: 55000,
        rating: 4.7,
        review_count: 80,
        stock: 100,
      },

      // ... lanjutkan produk 4 - 50 dari SQL kamu
    ];

    for (const product of products) {
      const [existing] = await queryInterface.sequelize.query(
        `
        SELECT id
        FROM products
        WHERE name = :name
        `,
        {
          replacements: {
            name: product.name,
          },
        },
      );

      if (existing.length === 0) {
        await queryInterface.bulkInsert("products", [product]);
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
    await queryInterface.bulkDelete("products", null, {});
  },
};
