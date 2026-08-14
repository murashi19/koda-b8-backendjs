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
    const [products] = await queryInterface.sequelize.query(`
      SELECT id, name
      FROM products
    `);

    const productMap = {};

    products.forEach((product) => {
      productMap[product.name] = product.id;
    });

    const productTags = [
      {
        name: "Nike Air Max 270",
        tags: [2, 3],
      },
      {
        name: "iPhone 15 Pro",
        tags: [3, 5],
      },
      {
        name: "Wardah UV Shield",
        tags: [1],
      },
      {
        name: "Adidas Ultraboost Light",
        tags: [1, 3],
      },
      {
        name: "Uniqlo Heattech Jacket",
        tags: [4],
      },
      {
        name: "Samsung Galaxy S24",
        tags: [2],
      },
      {
        name: "Sony WH-1000XM5",
        tags: [3, 4],
      },
      {
        name: "Scarlett Whitening Serum",
        tags: [1, 2],
      },
      {
        name: "Somethinc Niacinamide 10%",
        tags: [4],
      },
      {
        name: "Tefal Non-Stick Frying Pan",
        tags: [5],
      },
      {
        name: "Philips Air Fryer HD9252",
        tags: [2, 3],
      },
      {
        name: "IKEA Storage Organizer Set",
        tags: [1],
      },
      {
        name: "Decathlon Yoga Mat Pro",
        tags: [4, 5],
      },
      {
        name: "Wilson Basketball Evolution",
        tags: [2],
      },
      {
        name: "Atomic Habits - James Clear",
        tags: [3, 4],
      },
      {
        name: "Zara Oversized Hoodie",
        tags: [1],
      },
      {
        name: "Xiaomi Redmi Note 13",
        tags: [2, 3],
      },
      {
        name: "Emina Bright Stuff Face Wash",
        tags: [1],
      },
      {
        name: "Cosmos Blender 2L",
        tags: [5],
      },
      {
        name: "Adidas Football Predator",
        tags: [2],
      },
      {
        name: "Faber-Castell Pencil Case Set",
        tags: [1],
      },
      {
        name: "H&M Basic Tee",
        tags: [5],
      },
      {
        name: "JBL Flip 6 Speaker",
        tags: [3, 4],
      },
      {
        name: "The Ordinary Niacinamide 10%",
        tags: [2, 1],
      },
      {
        name: "Electrolux Rice Cooker 1.8L",
        tags: [3],
      },
      {
        name: "Nike Dri-FIT Training Shirt",
        tags: [1],
      },
      {
        name: "Standard Notebook Set A5",
        tags: [5],
      },
      {
        name: "Converse Chuck Taylor All Star",
        tags: [3, 4],
      },
      {
        name: "Logitech MX Master 3S",
        tags: [1],
      },
      {
        name: "Avoskin Miraculous Retinol Serum",
        tags: [2],
      },
      {
        name: "Lock&Lock Food Container Set",
        tags: [5],
      },
      {
        name: "Puma RS-X Sneakers",
        tags: [1, 3],
      },
      {
        name: "Levi's 501 Original Jeans",
        tags: [4],
      },
      {
        name: "Xiaomi Mi Band 8",
        tags: [2, 5],
      },
      {
        name: "Asus ROG Gaming Mouse",
        tags: [1],
      },
      {
        name: "Innisfree Green Tea Serum",
        tags: [3, 5],
      },
      {
        name: "Maybelline Fit Me Foundation",
        tags: [2],
      },
      {
        name: "Xiaomi Smart Bulb",
        tags: [1],
      },
      {
        name: "Oxone Blender Set",
        tags: [4],
      },
      {
        name: "Under Armour Running Shorts",
        tags: [5],
      },
      {
        name: "Puma Football Boots",
        tags: [2, 3],
      },
      {
        name: "Deep Work - Cal Newport",
        tags: [3, 4],
      },
      {
        name: "Pilot Fountain Pen Set",
        tags: [1],
      },
      {
        name: "New Balance 550",
        tags: [3, 5],
      },
      {
        name: "Anker PowerCore 20000mAh",
        tags: [2, 4],
      },
      {
        name: "COSRX Snail Mucin Essence",
        tags: [3, 4],
      },
      {
        name: "Miyako Rice Cooker Mini",
        tags: [1],
      },
      {
        name: "Nike Pro Compression Shirt",
        tags: [2],
      },
      {
        name: "Sidu Gel Pen Set",
        tags: [5],
      },
      {
        name: "Vans Old Skool",
        tags: [3, 4],
      },
    ];
    for (const item of productTags) {
      const productId = productMap[item.name];

      if (!productId) {
        throw new Error(`Product "${item.name}" tidak ditemukan`);
      }

      for (const tagId of item.tags) {
        const [existing] = await queryInterface.sequelize.query(
          `
          SELECT product_id
          FROM product_tags
          WHERE product_id = :product_id
          AND tag_id = :tag_id
          `,
          {
            replacements: {
              product_id: productId,
              tag_id: tagId,
            },
          },
        );

        if (existing.length === 0) {
          await queryInterface.bulkInsert("product_tags", [
            {
              product_id: productId,
              tag_id: tagId,
            },
          ]);
        }
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
    await queryInterface.bulkDelete("product_tags", null, {});
  },
};
