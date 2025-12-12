-- =============================================
-- AviaTa Database Seed Data v3.0
-- With Promos and Refund Policies
-- =============================================

-- Seed Airlines
INSERT INTO airlines (name, code, logo_url) VALUES
('Garuda Indonesia', 'GA', 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Garuda_Indonesia_logo.svg/1200px-Garuda_Indonesia_logo.svg.png'),
('Singapore Airlines', 'SQ', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/1200px-Singapore_Airlines_Logo_2.svg.png'),
('AirAsia Indonesia', 'QZ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/1200px-AirAsia_New_Logo.svg.png'),
('Lion Air', 'JT', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Lion_Air_logo.svg/1200px-Lion_Air_logo.svg.png'),
('Japan Airlines', 'JL', 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/Japan_Airlines_Logo_%282011%29.svg/1200px-Japan_Airlines_Logo_%282011%29.svg.png'),
('Batik Air', 'ID', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Batik_Air_logo.svg/1200px-Batik_Air_logo.svg.png'),
('Citilink', 'QG', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Citilink_logo.svg/1200px-Citilink_logo.svg.png'),
('AirAsia', 'AK', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/1200px-AirAsia_New_Logo.svg.png')
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

-- Seed Promos
INSERT INTO promos (code, title, short_title, description, discount_type, discount_value, max_discount, min_purchase, start_date, end_date, usage_limit, is_active, applies_to) VALUES
('SUPERSALE1212', '12.12 Super Sale', '12.12 Sale', 'Unlock Exclusive Deals only on 12.12 Super Sale! Get up to 50% off on selected flights.', 'percentage', 50, 500000, 500000, '2025-12-01 00:00:00', '2025-12-31 23:59:59', 10000, TRUE, 'all'),
('FLYAVIATA', 'First Flight Discount', 'First Flight', 'Booking your first flight? Use code FLYAVIATA to get up to Rp 250.000 off your first flight booking!', 'fixed', 250000, 250000, 1000000, '2025-01-01 00:00:00', '2025-12-31 23:59:59', NULL, TRUE, 'all'),
('FLYOVERSEANOW', 'Overseas First Flight', 'Fly Overseas', 'Use the code FLYOVERSEANOW to get up to Rp 250.000 off your first international flight!', 'fixed', 250000, 250000, 1500000, '2025-01-01 00:00:00', '2025-12-31 23:59:59', NULL, TRUE, 'international'),
('WEEKENDFLY', 'Weekend Getaway', 'Weekend Deal', 'Get extra 10% off for weekend flights. Valid for Friday to Sunday departures.', 'percentage', 10, 200000, 750000, '2025-01-01 00:00:00', '2025-12-31 23:59:59', NULL, TRUE, 'all'),
('GOFLYINT', 'International Route Promo', 'Intl Promo', 'Special price for international routes! Save up to Rp 500.000 on selected routes.', 'fixed', 500000, 500000, 2000000, '2025-12-01 00:00:00', '2026-03-31 23:59:59', 5000, TRUE, 'international'),
('DOMESTIC25', 'Domestic Discount 25%', 'Domestic 25%', 'Get 25% off on all domestic flights! Maximum discount Rp 300.000.', 'percentage', 25, 300000, 500000, '2025-12-01 00:00:00', '2025-12-31 23:59:59', 8000, TRUE, 'domestic'),
('NEWYEAR2026', 'New Year Special', 'New Year', 'Ring in the New Year with special discounts! Get 15% off on all flights.', 'percentage', 15, 400000, 1000000, '2025-12-25 00:00:00', '2026-01-07 23:59:59', 5000, TRUE, 'all')
ON DUPLICATE KEY UPDATE title=title;

-- Seed Refund Policies (Default policies for different airlines)
-- Garuda Indonesia (Full Service)
INSERT INTO refund_policies (airline_id, flight_class_id, hours_before_departure, refund_percentage, admin_fee, is_active) VALUES
(1, 1, 72, 75, 100000, TRUE),
(1, 1, 24, 50, 100000, TRUE),
(1, 1, 0, 25, 150000, TRUE),
(1, 2, 72, 80, 150000, TRUE),
(1, 2, 24, 60, 150000, TRUE),
(1, 2, 0, 30, 200000, TRUE),
(1, 3, 72, 90, 200000, TRUE),
(1, 3, 24, 75, 200000, TRUE),
(1, 3, 0, 50, 250000, TRUE);

-- Lion Air (Low Cost Carrier - more restrictive)
INSERT INTO refund_policies (airline_id, flight_class_id, hours_before_departure, refund_percentage, admin_fee, is_active) VALUES
(4, 1, 72, 50, 150000, TRUE),
(4, 1, 24, 25, 150000, TRUE),
(4, 1, 0, 0, 200000, TRUE);

-- Citilink (Low Cost Carrier)
INSERT INTO refund_policies (airline_id, flight_class_id, hours_before_departure, refund_percentage, admin_fee, is_active) VALUES
(7, 1, 72, 50, 100000, TRUE),
(7, 1, 24, 25, 100000, TRUE),
(7, 1, 0, 0, 150000, TRUE);

-- AirAsia Indonesia (Low Cost Carrier)
INSERT INTO refund_policies (airline_id, flight_class_id, hours_before_departure, refund_percentage, admin_fee, is_active) VALUES
(3, 1, 72, 40, 175000, TRUE),
(3, 1, 24, 20, 175000, TRUE),
(3, 1, 0, 0, 200000, TRUE);

-- Singapore Airlines (Premium)
INSERT INTO refund_policies (airline_id, flight_class_id, hours_before_departure, refund_percentage, admin_fee, is_active) VALUES
(2, 1, 72, 85, 150000, TRUE),
(2, 1, 24, 65, 150000, TRUE),
(2, 1, 0, 40, 200000, TRUE),
(2, 3, 72, 95, 200000, TRUE),
(2, 3, 24, 80, 200000, TRUE),
(2, 3, 0, 60, 250000, TRUE);
