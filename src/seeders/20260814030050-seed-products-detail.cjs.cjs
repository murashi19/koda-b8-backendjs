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

    const details = [
      {
        name: "Nike Air Max 270",
        description: "Sepatu running premium.",
        specifications: "Ukuran:39-44 | Warna:Hitam",
      },
      {
        name: "iPhone 15 Pro",
        description: "Smartphone flagship Apple.",
        specifications: "256GB | Titanium",
      },
      {
        name: "Wardah UV Shield",
        description: "Sunscreen SPF50.",
        specifications: "50ml",
      },
      {
        name: "Adidas Ultraboost Light",
        description: "Sepatu lari dengan bantalan responsif.",
        specifications: "Ukuran:38-45 | Warna:Putih",
      },
      {
        name: "Uniqlo Heattech Jacket",
        description: "Jaket hangat teknologi Heattech.",
        specifications: "Ukuran:S-XL | Warna:Navy",
      },
      {
        name: "Samsung Galaxy S24",
        description: "Flagship Android terbaru Samsung.",
        specifications: "256GB | Titanium Gray",
      },
      {
        name: "Sony WH-1000XM5",
        description: "Headphone noise-cancelling premium.",
        specifications: "Bluetooth 5.2 | 30 jam baterai",
      },
      {
        name: "Scarlett Whitening Serum",
        description: "Serum pencerah wajah.",
        specifications: "20ml",
      },
      {
        name: "Somethinc Niacinamide 10%",
        description: "Serum niacinamide untuk pori-pori.",
        specifications: "30ml",
      },
      {
        name: "Tefal Non-Stick Frying Pan",
        description: "Wajan anti lengket serbaguna.",
        specifications: "Diameter 28cm",
      },
      {
        name: "Philips Air Fryer HD9252",
        description: "Air fryer kapasitas besar tanpa minyak.",
        specifications: "4.2L | 1400W",
      },
      {
        name: "IKEA Storage Organizer Set",
        description: "Set organizer penyimpanan rumah.",
        specifications: "5 pcs | Plastik BPA-free",
      },
      {
        name: "Decathlon Yoga Mat Pro",
        description: "Matras yoga anti-slip.",
        specifications: "183x61cm | Tebal 6mm",
      },
      {
        name: "Wilson Basketball Evolution",
        description: "Bola basket ukuran resmi.",
        specifications: "Size 7 | Kulit sintetis",
      },
      {
        name: "Atomic Habits - James Clear",
        description: "Buku pengembangan diri terlaris.",
        specifications: "320 halaman | Bahasa Indonesia",
      },
      {
        name: "Zara Oversized Hoodie",
        description: "Hoodie oversized bahan tebal, nyaman untuk sehari-hari.",
        specifications: "Ukuran:S-XXL | Warna:Abu-abu",
      },
      {
        name: "Xiaomi Redmi Note 13",
        description: "Smartphone entry-mid dengan performa cepat.",
        specifications: "256GB | Warna:Hitam",
      },
      {
        name: "Emina Bright Stuff Face Wash",
        description: "Face wash untuk kulit cerah dan bersih.",
        specifications: "100ml",
      },
      {
        name: "Cosmos Blender 2L",
        description: "Blender serbaguna untuk kebutuhan dapur.",
        specifications: "2 Liter | 400W",
      },
      {
        name: "Adidas Football Predator",
        description: "Sepatu bola dengan grip maksimal.",
        specifications: "Ukuran:39-44 | Warna:Merah",
      },
      {
        name: "Faber-Castell Pencil Case Set",
        description: "Set tempat pensil lengkap dengan alat tulis.",
        specifications: "12 pcs | Berbagai warna",
      },
      {
        name: "H&M Basic Tee",
        description: "Kaos basic bahan katun combed.",
        specifications: "Ukuran:S-XL | Warna:Putih",
      },
      {
        name: "JBL Flip 6 Speaker",
        description: "Speaker portable tahan air.",
        specifications: "IP67 | 12 jam baterai",
      },
      {
        name: "The Ordinary Niacinamide 10%",
        description: "Serum niacinamide untuk mencerahkan kulit.",
        specifications: "30ml",
      },
      {
        name: "Electrolux Rice Cooker 1.8L",
        description: "Rice cooker kapasitas keluarga kecil.",
        specifications: "1.8L | 400W",
      },
      {
        name: "Nike Dri-FIT Training Shirt",
        description: "Kaos olahraga dengan teknologi menyerap keringat.",
        specifications: "Ukuran:S-XL | Warna:Biru",
      },
      {
        name: "Standard Notebook Set A5",
        description: "Set buku catatan ukuran A5.",
        specifications: "3 pcs | 100 halaman/buku",
      },
      {
        name: "Converse Chuck Taylor All Star",
        description: "Sepatu sneakers klasik ikonik.",
        specifications: "Ukuran:36-44 | Warna:Hitam Putih",
      },
      {
        name: "Logitech MX Master 3S",
        description: "Mouse wireless premium untuk produktivitas.",
        specifications: "Bluetooth & USB Receiver",
      },
      {
        name: "Avoskin Miraculous Retinol Serum",
        description: "Serum retinol untuk anti-aging.",
        specifications: "20ml",
      },
      {
        name: "Lock&Lock Food Container Set",
        description: "Set wadah makanan kedap udara.",
        specifications: "5 pcs | BPA-free",
      },
      {
        name: "Puma RS-X Sneakers",
        description: "Sneakers chunky dengan desain retro-futuristik.",
        specifications: "Ukuran:38-44 | Warna:Putih-Biru",
      },
      {
        name: "Levi's 501 Original Jeans",
        description: "Jeans klasik potongan lurus, ikonik sepanjang masa.",
        specifications: "Ukuran:28-38 | Warna:Biru Indigo",
      },
      {
        name: "Xiaomi Mi Band 8",
        description: "Smartband ringan dengan pelacak kesehatan lengkap.",
        specifications: "AMOLED 1.62 inch | Baterai 16 hari",
      },
      {
        name: "Asus ROG Gaming Mouse",
        description: "Mouse gaming presisi tinggi dengan sensor optik.",
        specifications: "16000 DPI | RGB Aura Sync",
      },
      {
        name: "Innisfree Green Tea Serum",
        description: "Serum hidrasi dengan ekstrak teh hijau Jeju.",
        specifications: "80ml",
      },
      {
        name: "Maybelline Fit Me Foundation",
        description: "Foundation ringan hasil akhir matte natural.",
        specifications: "30ml | Berbagai shade",
      },
      {
        name: "Xiaomi Smart Bulb",
        description: "Lampu pintar warna-warni terhubung aplikasi.",
        specifications: "9W | RGBW | Wi-Fi",
      },
      {
        name: "Oxone Blender Set",
        description: "Blender multifungsi dengan 3 jar berbeda.",
        specifications: "1.5L | 400W",
      },
      {
        name: "Under Armour Running Shorts",
        description: "Celana lari ringan dengan teknologi anti bau.",
        specifications: "Ukuran:S-XL | Warna:Hitam",
      },
      {
        name: "Puma Football Boots",
        description: "Sepatu bola grip firm ground untuk lapangan rumput.",
        specifications: "Ukuran:39-44 | Warna:Hijau",
      },
      {
        name: "Deep Work - Cal Newport",
        description: "Buku tentang fokus mendalam di era distraksi.",
        specifications: "296 halaman | Bahasa Indonesia",
      },
      {
        name: "Pilot Fountain Pen Set",
        description: "Set pulpen fountain pen untuk menulis presisi.",
        specifications: "3 pcs | Tinta biru-hitam-merah",
      },
      {
        name: "New Balance 550",
        description: "Sneakers basketball klasik gaya retro.",
        specifications: "Ukuran:38-45 | Warna:Putih-Hijau",
      },
      {
        name: "Anker PowerCore 20000mAh",
        description: "Power bank kapasitas besar dengan fast charging.",
        specifications: "20000mAh | PD 20W",
      },
      {
        name: "COSRX Snail Mucin Essence",
        description: "Essence lendir siput untuk kulit lembab dan sehat.",
        specifications: "100ml",
      },
      {
        name: "Miyako Rice Cooker Mini",
        description: "Rice cooker mini cocok untuk 1-2 orang.",
        specifications: "0.6L | 300W",
      },
      {
        name: "Nike Pro Compression Shirt",
        description: "Baju kompresi untuk performa olahraga maksimal.",
        specifications: "Ukuran:S-XL | Warna:Hitam",
      },
      {
        name: "Sidu Gel Pen Set",
        description: "Set pulpen gel warna-warni untuk sehari-hari.",
        specifications: "12 pcs | Berbagai warna",
      },
      {
        name: "Vans Old Skool",
        description: "Sneakers skate klasik dengan side stripe ikonik.",
        specifications: "Ukuran:36-44 | Warna:Hitam Putih",
      },
    ];
    for (const detail of details) {
      const productId = productMap[detail.name];

      if (!productId) {
        throw new Error(`Product "${detail.name}" tidak ditemukan`);
      }

      const [existing] = await queryInterface.sequelize.query(
        `
        SELECT id
        FROM product_details
        WHERE product_id = :product_id
        `,
        {
          replacements: {
            product_id: productId,
          },
        },
      );

      if (existing.length === 0) {
        await queryInterface.bulkInsert("product_details", [
          {
            product_id: productId,
            description: detail.description,
            specifications: detail.specifications,
          },
        ]);
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
    await queryInterface.bulkDelete("product_details", null, {});
  },
};
