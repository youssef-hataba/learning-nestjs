-- 1. Reset tables and restart primary key IDs from 1
TRUNCATE TABLE users, products, reviews RESTART IDENTITY CASCADE;

-- 2. Seed Users
INSERT INTO users (username, email, password, "userType", "isAccountVerified", "createdAt", "updatedAt") VALUES
('youssef_admin', 'admin@example.com', 'Admin@123456', 'admin', true, NOW(), NOW()),
('ahmed_seller', 'ahmed@example.com', 'Password@123', 'user', true, NOW(), NOW()),
('sara_buyer', 'sara@example.com', 'Password@123', 'user', true, NOW(), NOW());

-- 3. Seed Products (Linked to Users via userId)
INSERT INTO products (title, description, price, "userId", "createdAt", "updatedAt") VALUES
('Gaming Mouse RGB', 'High-precision optical gaming mouse with customizable RGB lighting and ergonomic grip.', 100, 2, NOW(), NOW()),
('Mechanical Keyboard', 'Tenkeyless mechanical keyboard with tactile blue switches and durable aluminum frame.', 200, 2, NOW(), NOW()),
('UltraWide Gaming Monitor 27', '27-inch 165Hz IPS gaming monitor with 1ms response time and HDR support.', 350, 2, NOW(), NOW()),
('Wireless ANC Headphones', 'Premium over-ear wireless headphones with active noise cancellation and 40h battery.', 250, 1, NOW(), NOW()),
('Ergonomic Office Chair', 'Breathable mesh ergonomic chair with lumbar support and adjustable 3D armrests.', 180, 1, NOW(), NOW());

-- 4. Seed Reviews (Linked to Products via productId and to Users via userId)
INSERT INTO reviews (rating, comment, "productId", "userId", "createdAt", "updatedAt") VALUES
(5, 'Exceptional precision and comfortable grip for long gaming sessions!', 1, 3, NOW(), NOW()),
(4, 'Very good build quality, click latency is minimal.', 1, 1, NOW(), NOW()),
(5, 'Amazing tactile feedback and solid aluminum body. Highly recommended!', 2, 3, NOW(), NOW()),
(5, 'Crisp colors, smooth 165Hz refresh rate. Best monitor in this price range.', 3, 3, NOW(), NOW()),
(4, 'Active noise cancellation works like a charm. Comfortable ear pads.', 4, 2, NOW(), NOW());
