-- Seed Airlines
INSERT INTO airlines (name, code, logo_url) VALUES
('Garuda Indonesia', 'GA', 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Garuda_Indonesia_logo.svg/1200px-Garuda_Indonesia_logo.svg.png'),
('Singapore Airlines', 'SQ', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/1200px-Singapore_Airlines_Logo_2.svg.png'),
('AirAsia', 'AK', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/1200px-AirAsia_New_Logo.svg.png'),
('Lion Air', 'JT', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Lion_Air_logo.svg/1200px-Lion_Air_logo.svg.png'),
('Japan Airlines', 'JL', 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/Japan_Airlines_Logo_%282011%29.svg/1200px-Japan_Airlines_Logo_%282011%29.svg.png')
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
('KNO', 'Kualanamu International Airport', 'Medan', 'Indonesia')
ON DUPLICATE KEY UPDATE name=name;

-- Seed Flights (Dynamic dates would be better in code, but static for SQL seed)
-- Assuming current date is around Nov 2025 based on context, let's put some future dates
INSERT INTO flights (airline_id, flight_number, origin_airport_id, destination_airport_id, departure_time, arrival_time, price) VALUES
-- Jakarta (CGK) -> Bali (DPS)
(1, 'GA402', 1, 2, '2025-12-01 08:00:00', '2025-12-01 10:50:00', 1500000),
(3, 'QZ7510', 1, 2, '2025-12-01 09:30:00', '2025-12-01 12:20:00', 850000),
(4, 'JT32', 1, 2, '2025-12-01 14:00:00', '2025-12-01 16:50:00', 900000),

-- Jakarta (CGK) -> Singapore (SIN)
(1, 'GA836', 1, 3, '2025-12-02 08:30:00', '2025-12-02 11:15:00', 2500000),
(2, 'SQ950', 1, 3, '2025-12-02 06:15:00', '2025-12-02 09:00:00', 3200000),
(3, 'QZ262', 1, 3, '2025-12-02 13:00:00', '2025-12-02 15:45:00', 1200000),

-- Surabaya (SUB) -> Kuala Lumpur (KUL)
(3, 'AK363', 7, 4, '2025-12-03 10:00:00', '2025-12-03 13:35:00', 1100000),

-- Jakarta (CGK) -> Tokyo (NRT)
(5, 'JL726', 1, 5, '2025-12-04 21:25:00', '2025-12-05 06:35:00', 8500000),
(1, 'GA874', 1, 6, '2025-12-04 23:15:00', '2025-12-05 08:50:00', 9200000);

-- Seed Users
INSERT INTO users (username, email, password) VALUES
('mekas', 'mekas@example.com', 'password123'),
('admin', 'admin@aviata.com', 'admin123')
ON DUPLICATE KEY UPDATE username=username;
