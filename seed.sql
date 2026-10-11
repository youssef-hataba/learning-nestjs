-- 1. Truncate existing tables
TRUNCATE TABLE users, products, reviews CASCADE;

-- 2. Seed Users
INSERT INTO users (id, username, email, password, "userType", "isAccountVerified", "createdAt", "updatedAt") VALUES
('a1111111-1111-4111-8111-111111111111', 'youssef_admin', 'admin@example.com', '$2b$10$l1bcXjUM51NIgtN8UgnRhO9rOgbdlwiu7GKR9iF9GL8JnJgaMsHLy', 'admin', true, NOW(), NOW()),
('a2222222-2222-4222-8222-222222222222', 'ahmed_seller', 'ahmed@example.com', '$2b$10$8DUik/QThMh0cLPmssKPTemT.4PzV/WqZgMNB0/nXksJHO3fJBTgW', 'user', true, NOW(), NOW()),
('a3333333-3333-4333-8333-333333333333', 'sara_buyer', 'sara@example.com', '$2b$10$8DUik/QThMh0cLPmssKPTemT.4PzV/WqZgMNB0/nXksJHO3fJBTgW', 'user', true, NOW(), NOW());

-- 3. Seed Products (Linked to Users via userId)
INSERT INTO products (id, title, description, price, "userId", "createdAt", "updatedAt") VALUES
('b1111111-1111-4111-8111-111111111111', 'Gaming Mouse RGB', 'High-precision optical gaming mouse with customizable RGB lighting and ergonomic grip.', 100, 'a2222222-2222-4222-8222-222222222222', NOW(), NOW()),
('b2222222-2222-4222-8222-222222222222', 'Mechanical Keyboard', 'Tenkeyless mechanical keyboard with tactile blue switches and durable aluminum frame.', 200, 'a2222222-2222-4222-8222-222222222222', NOW(), NOW()),
('b3333333-3333-4333-8333-333333333333', 'UltraWide Gaming Monitor 27', '27-inch 165Hz IPS gaming monitor with 1ms response time and HDR support.', 350, 'a2222222-2222-4222-8222-222222222222', NOW(), NOW()),
('b4444444-4444-4444-8444-444444444444', 'Wireless ANC Headphones', 'Premium over-ear wireless headphones with active noise cancellation and 40h battery.', 250, 'a1111111-1111-4111-8111-111111111111', NOW(), NOW()),
('b5555555-5555-4555-8555-555555555555', 'Ergonomic Office Chair', 'Breathable mesh ergonomic chair with lumbar support and adjustable 3D armrests.', 180, 'a1111111-1111-4111-8111-111111111111', NOW(), NOW());

-- 4. Seed Reviews (Linked to Products via productId and to Users via userId)
INSERT INTO reviews (id, rating, comment, "productId", "userId", "createdAt", "updatedAt") VALUES
('c1111111-1111-4111-8111-111111111111', 5, 'Exceptional precision and comfortable grip for long gaming sessions!', 'b1111111-1111-4111-8111-111111111111', 'a3333333-3333-4333-8333-333333333333', NOW(), NOW()),
('c2222222-2222-4222-8222-222222222222', 4, 'Very good build quality, click latency is minimal.', 'b1111111-1111-4111-8111-111111111111', 'a1111111-1111-4111-8111-111111111111', NOW(), NOW()),
('c3333333-3333-4333-8333-333333333333', 5, 'Amazing tactile feedback and solid aluminum body. Highly recommended!', 'b2222222-2222-4222-8222-222222222222', 'a3333333-3333-4333-8333-333333333333', NOW(), NOW()),
('c4444444-4444-4444-8444-444444444444', 5, 'Crisp colors, smooth 165Hz refresh rate. Best monitor in this price range.', 'b3333333-3333-4333-8333-333333333333', 'a3333333-3333-4333-8333-333333333333', NOW(), NOW()),
('c5555555-5555-4555-8555-555555555555', 4, 'Active noise cancellation works like a charm. Comfortable ear pads.', 'b4444444-4444-4444-8444-444444444444', 'a2222222-2222-4222-8222-222222222222', NOW(), NOW());
