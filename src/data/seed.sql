-- ===========================
-- USERS
-- password: admin123
-- password hash harus diganti dengan hasil bcrypt dari backend
-- ===========================

INSERT INTO users (email, password, role, is_verified, is_active)
VALUES
('admin@belimudah.com', '$2a$10$gIUEeph16qrrvVkPqpngeecklFH5PgI.IPKhPy1AHKmiBHWFNswi.', 'ADMIN', TRUE, TRUE),
('rafli@gmail.com', '$2a$10$584FDA1XBgSugyeBP1n3z.F7H3XhPCUrvMK7fgDI/UOl1zq0W4iii', 'CUSTOMER', TRUE, TRUE);

-- ===========================
-- USER PROFILES
-- ===========================

INSERT INTO user_profiles (user_id, full_name, phone_number, avatar, gender, birth_date)
VALUES
(1, 'Administrator', '081111111111', 'https://i.pravatar.cc/300?img=1', 'MALE', '2000-01-01'),
(2, 'Muhamad Rafli', '082222222222', 'https://i.pravatar.cc/300?img=2', 'MALE', '2003-06-10');

-- ===========================
-- CATEGORY
-- ===========================

INSERT INTO categories(name)
VALUES
('Fashion'), ('Elektronik'), ('Kecantikan'), ('Rumah & Dapur'), ('Olahraga'), ('Buku & Alat Tulis');

-- ===========================
-- TAGS
-- Disesuaikan dengan slug yang dipakai di frontend (data/products.js):
-- "new", "flash", "best", "star-seller", "free-shipping"
-- ===========================

INSERT INTO tags(name)
VALUES
('new'),
('flash'),
('best'),
('star-seller'),
('free-shipping');

-- id tag setelah insert di atas (asumsi tabel tags kosong sebelumnya):
-- 1 = new, 2 = flash, 3 = best, 4 = star-seller, 5 = free-shipping

-- ===========================
-- PRODUCTS (15 produk, tersebar di 6 kategori)
-- category_id: 1 Fashion, 2 Elektronik, 3 Kecantikan,
--              4 Rumah & Dapur, 5 Olahraga, 6 Buku & Alat Tulis
-- ===========================

INSERT INTO products
(brand, name, image, category_id, regular_price, discount_price, rating, review_count, stock)
VALUES
('Nike', 'Nike Air Max 270', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 1, 2500000, 2100000, 4.8, 312, 30),
('Apple', 'iPhone 15 Pro', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569', 2, 18999000, 17999000, 4.9, 501, 15),
('Wardah', 'Wardah UV Shield', 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a', 3, 65000, 55000, 4.7, 80, 100),
('Adidas', 'Adidas Ultraboost Light', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a', 1, 2800000, 2350000, 4.6, 198, 25),
('Uniqlo', 'Uniqlo Heattech Jacket', 'https://images.unsplash.com/photo-1551028719-00167b16eac5', 1, 799000, 649000, 4.5, 143, 60),
('Samsung', 'Samsung Galaxy S24', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c', 2, 15999000, 14499000, 4.8, 276, 20),
('Sony', 'Sony WH-1000XM5', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb', 2, 5499000, 4799000, 4.9, 420, 18),
('Scarlett', 'Scarlett Whitening Serum', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be', 3, 89000, 72000, 4.6, 210, 150),
('Somethinc', 'Somethinc Niacinamide 10%', 'https://images.unsplash.com/photo-1556228720-195a672e8a03', 3, 99000, 79000, 4.7, 165, 120),
('Tefal', 'Tefal Non-Stick Frying Pan', 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1', 4, 450000, 375000, 4.5, 92, 40),
('Philips', 'Philips Air Fryer HD9252', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 4, 1299000, 1099000, 4.8, 340, 22),
('IKEA', 'IKEA Storage Organizer Set', 'https://images.unsplash.com/photo-1558997519-83ea9252edf8', 4, 350000, 299000, 4.4, 58, 75),
('Decathlon', 'Decathlon Yoga Mat Pro', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f', 5, 250000, 199000, 4.6, 130, 90),
('Wilson', 'Wilson Basketball Evolution', 'https://images.unsplash.com/photo-1519861531473-9200262188bf', 5, 550000, 469000, 4.7, 87, 45),
('Gramedia', 'Atomic Habits - James Clear', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', 6, 129000, 99000, 4.9, 890, 200);
('Zara', 'Zara Oversized Hoodie', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7', 1, 599000, 449000, 4.5, 120, 40),
('Xiaomi', 'Xiaomi Redmi Note 13', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97', 2, 3299000, 2899000, 4.7, 512, 35),
('Emina', 'Emina Bright Stuff Face Wash', 'https://images.unsplash.com/photo-1556228720-195a672e8a03', 3, 35000, NULL, 4.4, 64, 200),
('Cosmos', 'Cosmos Blender 2L', 'https://images.unsplash.com/photo-1570222094114-d054a817e56b', 4, 320000, NULL, 4.3, 45, 30),
('Adidas', 'Adidas Football Predator', 'https://images.unsplash.com/photo-1614632537190-23e4146777db', 5, 850000, 599000, 4.6, 98, 22),
('Faber-Castell', 'Faber-Castell Pencil Case Set', 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620', 6, 75000, NULL, 4.5, 30, 150),
('H&M', 'H&M Basic Tee', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 1, 199000, NULL, 4.2, 76, 90),
('JBL', 'JBL Flip 6 Speaker', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1', 2, 1699000, 1399000, 4.8, 245, 28),
('The Ordinary', 'The Ordinary Niacinamide 10%', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be', 3, 145000, 119000, 4.7, 310, 80),
('Electrolux', 'Electrolux Rice Cooker 1.8L', 'https://images.unsplash.com/photo-1585515320310-259814833e62', 4, 899000, 749000, 4.6, 156, 25),
('Nike', 'Nike Dri-FIT Training Shirt', 'https://images.unsplash.com/photo-1556906781-9a412961c28c', 5, 449000, NULL, 4.5, 52, 60),
('Standard', 'Standard Notebook Set A5', 'https://images.unsplash.com/photo-1531346878377-a5be20888e57', 6, 45000, NULL, 4.3, 40, 250),
('Converse', 'Converse Chuck Taylor All Star', 'https://images.unsplash.com/photo-1552346154-21d32810aba3', 1, 899000, 699000, 4.8, 402, 32),
('Logitech', 'Logitech MX Master 3S', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46', 2, 1499000, NULL, 4.9, 289, 18),
('Avoskin', 'Avoskin Miraculous Retinol Serum', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be', 3, 159000, 129000, 4.6, 187, 70),
('Lock&Lock', 'Lock&Lock Food Container Set', 'https://images.unsplash.com/photo-1584990347449-a2d4c2d0e3a4', 4, 275000, NULL, 4.4, 88, 55);
-- ===========================
-- PRODUCT DETAILS
-- ===========================

INSERT INTO product_details (product_id, description, specifications)
VALUES
(1, 'Sepatu running premium.', 'Ukuran:39-44 | Warna:Hitam'),
(2, 'Smartphone flagship Apple.', '256GB | Titanium'),
(3, 'Sunscreen SPF50.', '50ml'),
(4, 'Sepatu lari dengan bantalan responsif.', 'Ukuran:38-45 | Warna:Putih'),
(5, 'Jaket hangat teknologi Heattech.', 'Ukuran:S-XL | Warna:Navy'),
(6, 'Flagship Android terbaru Samsung.', '256GB | Titanium Gray'),
(7, 'Headphone noise-cancelling premium.', 'Bluetooth 5.2 | 30 jam baterai'),
(8, 'Serum pencerah wajah.', '20ml'),
(9, 'Serum niacinamide untuk pori-pori.', '30ml'),
(10, 'Wajan anti lengket serbaguna.', 'Diameter 28cm'),
(11, 'Air fryer kapasitas besar tanpa minyak.', '4.2L | 1400W'),
(12, 'Set organizer penyimpanan rumah.', '5 pcs | Plastik BPA-free'),
(13, 'Matras yoga anti-slip.', '183x61cm | Tebal 6mm'),
(14, 'Bola basket ukuran resmi.', 'Size 7 | Kulit sintetis'),
(15, 'Buku pengembangan diri terlaris.', '320 halaman | Bahasa Indonesia');
(16, 'Hoodie oversized bahan tebal, nyaman untuk sehari-hari.', 'Ukuran:S-XXL | Warna:Abu-abu'),
(17, 'Smartphone entry-mid dengan performa cepat.', '256GB | Warna:Hitam'),
(18, 'Face wash untuk kulit cerah dan bersih.', '100ml'),
(19, 'Blender serbaguna untuk kebutuhan dapur.', '2 Liter | 400W'),
(20, 'Sepatu bola dengan grip maksimal.', 'Ukuran:39-44 | Warna:Merah'),
(21, 'Set tempat pensil lengkap dengan alat tulis.', '12 pcs | Berbagai warna'),
(22, 'Kaos basic bahan katun combed.', 'Ukuran:S-XL | Warna:Putih'),
(23, 'Speaker portable tahan air.', 'IP67 | 12 jam baterai'),
(24, 'Serum niacinamide untuk mencerahkan kulit.', '30ml'),
(25, 'Rice cooker kapasitas keluarga kecil.', '1.8L | 400W'),
(26, 'Kaos olahraga dengan teknologi menyerap keringat.', 'Ukuran:S-XL | Warna:Biru'),
(27, 'Set buku catatan ukuran A5.', '3 pcs | 100 halaman/buku'),
(28, 'Sepatu sneakers klasik ikonik.', 'Ukuran:36-44 | Warna:Hitam Putih'),
(29, 'Mouse wireless premium untuk produktivitas.', 'Bluetooth & USB Receiver'),
(30, 'Serum retinol untuk anti-aging.', '20ml'),
(31, 'Set wadah makanan kedap udara.', '5 pcs | BPA-free');
-- ===========================
-- PRODUCT IMAGES
-- ===========================

INSERT INTO product_images (product_id, image_url, sort_order)
VALUES
(1, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 1),
(1, 'https://images.unsplash.com/photo-1549298916-b41d501d3772', 2),
(2, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569', 1),
(3, 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a', 1),
(4, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a', 1),
(5, 'https://images.unsplash.com/photo-1551028719-00167b16eac5', 1),
(6, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c', 1),
(7, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb', 1),
(8, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be', 1),
(9, 'https://images.unsplash.com/photo-1556228720-195a672e8a03', 1),
(10, 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1', 1),
(11, 'https://images.unsplash.com/photo-1585515320310-259814833e62', 1),
(12, 'https://images.unsplash.com/photo-1558997519-83ea9252edf8', 1),
(13, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f', 1),
(14, 'https://images.unsplash.com/photo-1519861531473-9200262188bf', 1),
(15, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', 1);
(16, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7', 1),
(17, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97', 1),
(18, 'https://images.unsplash.com/photo-1556228720-195a672e8a03', 1),
(19, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b', 1),
(20, 'https://images.unsplash.com/photo-1614632537190-23e4146777db', 1),
(21, 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620', 1),
(22, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 1),
(23, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1', 1),
(24, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be', 1),
(25, 'https://images.unsplash.com/photo-1585515320310-259814833e62', 1),
(26, 'https://images.unsplash.com/photo-1556906781-9a412961c28c', 1),
(27, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57', 1),
(28, 'https://images.unsplash.com/photo-1552346154-21d32810aba3', 1),
(29, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46', 1),
(30, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be', 1),
(31, 'https://images.unsplash.com/photo-1584990347449-a2d4c2d0e3a4', 1);
 
-- ===========================
-- PRODUCT TAGS
-- tag_id: 1=new, 2=flash, 3=best, 4=star-seller, 5=free-shipping
-- (kombinasi dibuat bervariasi, meniru pola tags di data/products.js lama)
-- ===========================

INSERT INTO product_tags (product_id, tag_id)
VALUES
(1, 2), (1, 3),          -- Nike Air Max: flash, best
(2, 3), (2, 5),          -- iPhone 15 Pro: best, free-shipping
(3, 1),                  -- Wardah UV Shield: new
(4, 1), (4, 3),          -- Adidas Ultraboost: new, best
(5, 4),                  -- Uniqlo Jacket: star-seller
(6, 2),                  -- Samsung S24: flash
(7, 3), (7, 4),          -- Sony WH-1000XM5: best, star-seller
(8, 1), (8, 2),          -- Scarlett Serum: new, flash
(9, 4),                  -- Somethinc Niacinamide: star-seller
(10, 5),                 -- Tefal Pan: free-shipping
(11, 2), (11, 3),        -- Philips Air Fryer: flash, best
(12, 1),                 -- IKEA Organizer: new
(13, 4), (13, 5),        -- Decathlon Yoga Mat: star-seller, free-shipping
(14, 2),                 -- Wilson Basketball: flash
(15, 3), (15, 4);        -- Atomic Habits: best, star-seller
(16, 1),                 -- Zara Hoodie: new
(17, 2), (17, 3),        -- Xiaomi Redmi Note 13: flash, best
(18, 1),                 -- Emina Face Wash: new (no discount)
(19, 5),                 -- Cosmos Blender: free-shipping (no discount)
(20, 2),                 -- Adidas Football: flash
(21, 1),                 -- Faber-Castell: new
(22, 5),                 -- H&M Basic Tee: free-shipping (no discount)
(23, 3), (23, 4),        -- JBL Flip 6: best, star-seller
(24, 2), (24, 1),        -- The Ordinary Niacinamide: flash, new
(25, 3),                 -- Electrolux Rice Cooker: best
(26, 1),                 -- Nike Dri-FIT: new (no discount)
(27, 5),                 -- Standard Notebook: free-shipping (no discount)
(28, 3), (28, 4),        -- Converse Chuck Taylor: best, star-seller
(29, 1),                 -- Logitech MX Master 3S: new (no discount)
(30, 2),                 -- Avoskin Retinol: flash
(31, 5);                 -- Lock&Lock: free-shipping (no discount)
-- ===========================
-- ADDRESS
-- ===========================

INSERT INTO addresses
(user_profile_id, label, province, city, district, subdistrict, postal_code, address, note, is_default)
VALUES
(2, 'Rumah', 'Jawa Barat', 'Bandung', 'Coblong', 'Dago', '40135', 'Jl. Ir. H. Juanda No.1', 'Pagar hitam', TRUE);

-- ===========================
-- CART
-- ===========================

INSERT INTO carts(user_id) VALUES (2);

-- ===========================
-- CART ITEMS
-- ===========================

INSERT INTO cart_items (user_id, product_id, quantity)
VALUES
(2, 1, 1),
(2, 3, 2);

-- ===========================
-- WISHLIST
-- ===========================

INSERT INTO wishlists (user_id, product_id)
VALUES
(2, 2),
(2, 3);

-- ===========================
-- ORDER
-- ===========================

INSERT INTO orders
(order_code, user_id, address_id, shipping_method, payment_method, shipping_cost, subtotal, total, status)
VALUES
('ORD-20260806-0001', 2, 1, 'JNE', 'BANK_TRANSFER', 15000, 2210000, 2225000, 'PAID');

-- ===========================
-- ORDER ITEMS
-- ===========================

INSERT INTO order_items
(order_id, product_id, product_name, product_image, price, qty, subtotal)
VALUES
(1, 1, 'Nike Air Max 270', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 2100000, 1, 2100000),
(1, 3, 'Wardah UV Shield', 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a', 55000, 2, 110000);