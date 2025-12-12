-- =============================================
-- AviaTa Database Seed Data v2.0
-- =============================================

-- Seed Airlines
INSERT INTO airlines (name, code, logo_url) VALUES
('Garuda Indonesia', 'GA', 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Garuda_Indonesia_logo.svg/1200px-Garuda_Indonesia_logo.svg.png'),
('Singapore Airlines', 'SQ', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/1200px-Singapore_Airlines_Logo_2.svg.png'),
('AirAsia', 'AK', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/1200px-AirAsia_New_Logo.svg.png'),
('Lion Air', 'JT', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Lion_Air_logo.svg/1200px-Lion_Air_logo.svg.png'),
('Japan Airlines', 'JL', 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/Japan_Airlines_Logo_%282011%29.svg/1200px-Japan_Airlines_Logo_%282011%29.svg.png'),
('Batik Air', 'ID', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Batik_Air_logo.svg/1200px-Batik_Air_logo.svg.png'),
('Citilink', 'QG', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Citilink_logo.svg/1200px-Citilink_logo.svg.png')
ON DUPLICATE KEY UPDATE name=name;

-- Seed Airports
INSERT INTO airports (code, name, city, country) VALUES
('CGK', 'Soekarno-Hatta International Airport', 'Jakarta', 'Indonesia'),
('DPS', 'Ngurah Rai International Airport', 'Bali', 'Indonesia'),
('SIN', 'Changi Airport', 'Singapore', 'Singapore'),
('KUL', 'Kuala Lumpur International Airport', 'Kuala Lumpur', 'Malaysia'),
('NRT', 'Narita International Airport', 'Tokyo', 'Japan'),
('HND', 'Haneda Airport', 'Tokyo', 'Japan'),
('SUB', 'Juanda International Airport', 'Surabaya', 'Indonesia'),
('KNO', 'Kualanamu International Airport', 'Medan', 'Indonesia'),
('UPG', 'Sultan Hasanuddin International Airport', 'Makassar', 'Indonesia'),
('JOG', 'Adisucipto International Airport', 'Yogyakarta', 'Indonesia'),
('BKK', 'Suvarnabhumi Airport', 'Bangkok', 'Thailand'),
('HKG', 'Hong Kong International Airport', 'Hong Kong', 'Hong Kong')
ON DUPLICATE KEY UPDATE name=name;

-- Seed Flight Classes
INSERT INTO flight_classes (name, code, multiplier) VALUES
('Economy', 'economy', 1.00),
('Premium Economy', 'premium', 1.50),
('Business', 'business', 2.50),
('First Class', 'first', 4.00)
ON DUPLICATE KEY UPDATE name=name;

-- Seed Flights (Future dates from Dec 2025)
INSERT INTO flights (airline_id, flight_number, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, available_seats) VALUES
-- Jakarta (CGK) -> Bali (DPS)
(1, 'GA402', 1, 2, '2025-12-15 08:00:00', '2025-12-15 10:50:00', 1500000, 150),
(3, 'QZ7510', 1, 2, '2025-12-15 09:30:00', '2025-12-15 12:20:00', 850000, 180),
(4, 'JT32', 1, 2, '2025-12-15 14:00:00', '2025-12-15 16:50:00', 900000, 180),
(6, 'ID6502', 1, 2, '2025-12-15 16:30:00', '2025-12-15 19:20:00', 1200000, 150),
(7, 'QG802', 1, 2, '2025-12-15 18:00:00', '2025-12-15 20:50:00', 750000, 180),

-- Jakarta (CGK) -> Singapore (SIN)
(1, 'GA836', 1, 3, '2025-12-16 08:30:00', '2025-12-16 11:15:00', 2500000, 150),
(2, 'SQ950', 1, 3, '2025-12-16 06:15:00', '2025-12-16 09:00:00', 3200000, 200),
(3, 'QZ262', 1, 3, '2025-12-16 13:00:00', '2025-12-16 15:45:00', 1200000, 180),

-- Jakarta (CGK) -> Surabaya (SUB)
(1, 'GA310', 1, 7, '2025-12-17 07:00:00', '2025-12-17 08:30:00', 800000, 150),
(4, 'JT570', 1, 7, '2025-12-17 10:00:00', '2025-12-17 11:30:00', 650000, 180),
(7, 'QG410', 1, 7, '2025-12-17 14:00:00', '2025-12-17 15:30:00', 550000, 180),

-- Jakarta (CGK) -> Yogyakarta (JOG)
(1, 'GA206', 1, 10, '2025-12-18 06:30:00', '2025-12-18 07:45:00', 900000, 150),
(6, 'ID6370', 1, 10, '2025-12-18 12:00:00', '2025-12-18 13:15:00', 750000, 150),

-- Surabaya (SUB) -> Kuala Lumpur (KUL)
(3, 'AK363', 7, 4, '2025-12-19 10:00:00', '2025-12-19 13:35:00', 1100000, 180),

-- Jakarta (CGK) -> Tokyo (NRT/HND)
(5, 'JL726', 1, 5, '2025-12-20 21:25:00', '2025-12-21 06:35:00', 8500000, 200),
(1, 'GA874', 1, 6, '2025-12-20 23:15:00', '2025-12-21 08:50:00', 9200000, 150),

-- Jakarta (CGK) -> Bangkok (BKK)
(1, 'GA864', 1, 11, '2025-12-22 09:00:00', '2025-12-22 12:30:00', 3500000, 150),
(3, 'QZ8450', 1, 11, '2025-12-22 14:00:00', '2025-12-22 17:30:00', 1800000, 180),

-- Jakarta (CGK) -> Hong Kong (HKG)
(1, 'GA878', 1, 12, '2025-12-23 08:00:00', '2025-12-23 13:30:00', 4500000, 150);

-- Seed Sample Users
INSERT INTO users (email, password, full_name, gender, birth_date, city, priority_level, points) VALUES
('demo@aviata.com', '$2b$10$example_hashed_password', 'Demo User', 'male', '1995-05-15', 'Jakarta', 'bronze', 0),
('admin@aviata.com', '$2b$10$example_hashed_password', 'Admin AviaTa', 'male', '1990-01-01', 'Jakarta', 'platinum', 50000)
ON DUPLICATE KEY UPDATE email=email;

-- Seed Sample Saved Passengers for demo user (assuming id=1)
INSERT INTO saved_passengers (user_id, title, first_name, last_name, nationality, id_type, id_number) VALUES
(1, 'Mr', 'Demo', 'User', 'Indonesia', 'ktp', '3171234567890001')
ON DUPLICATE KEY UPDATE first_name=first_name;
