-- ===========================
-- USERS
-- password: admin123
-- password hash harus diganti dengan hasil bcrypt dari backend
-- ===========================

INSERT INTO users (
    email,
    password,
    role,
    is_verified,
    is_active
)
VALUES
(
    'admin@belimudah.com',
    '$2a$10$gIUEeph16qrrvVkPqpngeecklFH5PgI.IPKhPy1AHKmiBHWFNswi.',
    'ADMIN',
    TRUE,
    TRUE
),
(
    'rafli@gmail.com',
    '$2a$10$584FDA1XBgSugyeBP1n3z.F7H3XhPCUrvMK7fgDI/UOl1zq0W4iii',
    'CUSTOMER',
    TRUE,
    TRUE
);

-- ===========================
-- USER PROFILES
-- ===========================

INSERT INTO user_profiles (
    user_id,
    full_name,
    phone_number,
    avatar,
    gender,
    birth_date
)
VALUES
(
    1,
    'Administrator',
    '081111111111',
    'https://i.pravatar.cc/300?img=1',
    'MALE',
    '2000-01-01'
),
(
    2,
    'Muhamad Rafli',
    '082222222222',
    'https://i.pravatar.cc/300?img=2',
    'MALE',
    '2003-06-10'
);

-- ===========================
-- CATEGORY
-- ===========================

INSERT INTO categories(name)
VALUES
('Fashion'),
('Elektronik'),
('Kecantikan'),
('Rumah & Dapur'),
('Olahraga'),
('Buku & Alat Tulis');

-- ===========================
-- TAGS
-- ===========================

INSERT INTO tags(name)
VALUES
('New'),
('Best Seller'),
('Diskon'),
('Promo'),
('Flash Deal');

-- ===========================
-- PRODUCTS
-- ===========================

INSERT INTO products
(
    brand,
    name,
    image,
    category_id,
    regular_price,
    discount_price,
    rating,
    review_count,
    stock
)
VALUES

(
    'Nike',
    'Nike Air Max 270',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    1,
    2500000,
    2100000,
    4.8,
    312,
    30
),

(
    'Apple',
    'iPhone 15 Pro',
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569',
    2,
    18999000,
    17999000,
    4.9,
    501,
    15
),

(
    'Wardah',
    'Wardah UV Shield',
    'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a',
    3,
    65000,
    55000,
    4.7,
    80,
    100
);

-- ===========================
-- PRODUCT DETAILS
-- ===========================

INSERT INTO product_details
(
    product_id,
    description,
    specifications
)
VALUES

(
    1,
    'Sepatu running premium.',
    'Ukuran:39-44 | Warna:Hitam'
),

(
    2,
    'Smartphone flagship Apple.',
    '256GB | Titanium'
),

(
    3,
    'Sunscreen SPF50.',
    '50ml'
);

-- ===========================
-- PRODUCT IMAGES
-- ===========================

INSERT INTO product_images
(
    product_id,
    image_url,
    sort_order
)
VALUES

(1,'https://images.unsplash.com/photo-1542291026-7eec264c27ff',1),
(1,'https://images.unsplash.com/photo-1549298916-b41d501d3772',2),

(2,'https://images.unsplash.com/photo-1695048133142-1a20484d2569',1),

(3,'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a',1);

-- ===========================
-- PRODUCT TAGS
-- ===========================

INSERT INTO product_tags
(product_id,tag_id)
VALUES

(1,1),
(1,2),

(2,2),
(2,5),

(3,3);

-- ===========================
-- ADDRESS
-- ===========================

INSERT INTO addresses
(
    user_profile_id,
    label,
    province,
    city,
    district,
    subdistrict,
    postal_code,
    address,
    note,
    is_default
)
VALUES
(
    2,
    'Rumah',
    'Jawa Barat',
    'Bandung',
    'Coblong',
    'Dago',
    '40135',
    'Jl. Ir. H. Juanda No.1',
    'Pagar hitam',
    TRUE
);

-- ===========================
-- CART
-- ===========================

INSERT INTO carts(user_id)
VALUES
(2);

-- ===========================
-- CART ITEMS
-- ===========================

INSERT INTO cart_items
(
    user_id,
    product_id,
    quantity
)
VALUES

(2,1,1),
(2,3,2);

-- ===========================
-- WISHLIST
-- ===========================

INSERT INTO wishlists
(
    user_id,
    product_id
)
VALUES

(2,2),
(2,3);

-- ===========================
-- ORDER
-- ===========================

INSERT INTO orders
(
    order_code,
    user_id,
    address_id,
    shipping_method,
    payment_method,
    shipping_cost,
    subtotal,
    total,
    status
)
VALUES
(
    'ORD-20260806-0001',
    2,
    1,
    'JNE',
    'BANK_TRANSFER',
    15000,
    2210000,
    2225000,
    'PAID'
);

-- ===========================
-- ORDER ITEMS
-- ===========================

INSERT INTO order_items
(
    order_id,
    product_id,
    product_name,
    product_image,
    price,
    qty,
    subtotal
)
VALUES
(
    1,
    1,
    'Nike Air Max 270',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    2100000,
    1,
    2100000
),
(
    1,
    3,
    'Wardah UV Shield',
    'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a',
    55000,
    2,
    110000
);