-- =============================================
-- AviaTa Database Schema v3.0
-- Updated with Refund, Reschedule, and Promo features
-- =============================================

-- Create Airlines Table
CREATE TABLE IF NOT EXISTS airlines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Airports Table
CREATE TABLE IF NOT EXISTS airports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Flight Classes Table
CREATE TABLE IF NOT EXISTS flight_classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    multiplier DECIMAL(3, 2) DEFAULT 1.00
);

-- Create Flights Table (Extended with refund/reschedule)
CREATE TABLE IF NOT EXISTS flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    airline_id INT NOT NULL,
    flight_number VARCHAR(20) NOT NULL,
    origin_airport_id INT NOT NULL,
    destination_airport_id INT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    departure_terminal VARCHAR(10) NULL,
    arrival_terminal VARCHAR(10) NULL,
    base_price DECIMAL(12, 2) NOT NULL,
    available_seats INT DEFAULT 150,
    aircraft_type VARCHAR(100) DEFAULT 'Boeing 737-800',
    seat_layout VARCHAR(20) DEFAULT '3-3',
    seat_pitch INT DEFAULT 30,
    baggage_allowance INT DEFAULT 20,
    cabin_baggage INT DEFAULT 7,
    has_wifi BOOLEAN DEFAULT FALSE,
    has_entertainment BOOLEAN DEFAULT FALSE,
    has_power BOOLEAN DEFAULT FALSE,
    has_meal BOOLEAN DEFAULT FALSE,
    is_refundable BOOLEAN DEFAULT TRUE,
    is_reschedulable BOOLEAN DEFAULT TRUE,
    reschedule_fee DECIMAL(12, 2) DEFAULT 150000,
    status ENUM('scheduled', 'delayed', 'cancelled', 'completed') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (airline_id) REFERENCES airlines(id) ON DELETE CASCADE,
    FOREIGN KEY (origin_airport_id) REFERENCES airports(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_airport_id) REFERENCES airports(id) ON DELETE CASCADE
);

-- Create Users Table (Extended)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    gender ENUM('male', 'female') NULL,
    birth_date DATE NULL,
    city VARCHAR(100) NULL,
    phone VARCHAR(20) NULL,
    avatar_url VARCHAR(255) NULL,
    priority_level ENUM('bronze', 'silver', 'gold', 'platinum') DEFAULT 'bronze',
    points INT DEFAULT 0,
    provider ENUM('email', 'google', 'facebook', 'apple') DEFAULT 'email',
    provider_id VARCHAR(255) NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create User Emails Table (Multiple emails per user)
CREATE TABLE IF NOT EXISTS user_emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    email VARCHAR(100) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_email (email)
);

-- Create User Phones Table (Multiple phones per user)
CREATE TABLE IF NOT EXISTS user_phones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Saved Passengers Table
CREATE TABLE IF NOT EXISTS saved_passengers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title ENUM('Mr', 'Mrs', 'Ms') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    nationality VARCHAR(50) DEFAULT 'Indonesia',
    id_type ENUM('ktp', 'passport', 'sim') DEFAULT 'ktp',
    id_number VARCHAR(50) NULL,
    birth_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create User Cards Table (Payment Cards)
CREATE TABLE IF NOT EXISTS user_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    card_type ENUM('visa', 'mastercard', 'amex', 'jcb') NOT NULL,
    card_number_masked VARCHAR(20) NOT NULL,
    card_holder_name VARCHAR(100) NOT NULL,
    expiry_month INT NOT NULL,
    expiry_year INT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(10) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    flight_id INT NOT NULL,
    flight_class_id INT NOT NULL,
    trip_type ENUM('one-way', 'round-trip') DEFAULT 'one-way',
    return_flight_id INT NULL,
    total_passengers INT NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'refunded') DEFAULT 'pending',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
    FOREIGN KEY (flight_class_id) REFERENCES flight_classes(id),
    FOREIGN KEY (return_flight_id) REFERENCES flights(id) ON DELETE SET NULL
);

-- Create Booking Passengers Table
CREATE TABLE IF NOT EXISTS booking_passengers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    passenger_type ENUM('adult', 'child', 'infant') NOT NULL,
    title ENUM('Mr', 'Mrs', 'Ms') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    nationality VARCHAR(50) DEFAULT 'Indonesia',
    id_type ENUM('ktp', 'passport', 'sim') DEFAULT 'ktp',
    id_number VARCHAR(50) NULL,
    birth_date DATE NULL,
    seat_number VARCHAR(10) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Create Transactions/Payments Table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_code VARCHAR(20) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    booking_id INT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method ENUM('credit_card', 'bank_transfer', 'e_wallet', 'va') NOT NULL,
    payment_status ENUM('pending', 'success', 'failed', 'expired', 'refunded') DEFAULT 'pending',
    payment_date DATETIME NULL,
    payment_details JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Create Points Transactions Table
CREATE TABLE IF NOT EXISTS point_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    points INT NOT NULL,
    transaction_type ENUM('earn', 'redeem', 'expire', 'bonus') NOT NULL,
    description VARCHAR(255),
    reference_id INT NULL,
    reference_type VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Promos Table
CREATE TABLE IF NOT EXISTS promos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    short_title VARCHAR(50) NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(12, 2) NOT NULL,
    max_discount DECIMAL(12, 2) NULL,
    min_purchase DECIMAL(12, 2) DEFAULT 0,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    usage_limit INT NULL,
    usage_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    applies_to ENUM('all', 'domestic', 'international', 'specific_routes') DEFAULT 'all',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Flight Promos Junction Table
CREATE TABLE IF NOT EXISTS flight_promos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL,
    promo_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
    FOREIGN KEY (promo_id) REFERENCES promos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_flight_promo (flight_id, promo_id)
);

-- Create Refund Requests Table
CREATE TABLE IF NOT EXISTS refund_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    refund_code VARCHAR(20) NOT NULL UNIQUE,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    reason ENUM('passenger_request', 'flight_cancelled', 'flight_rescheduled', 'other') NOT NULL,
    reason_detail TEXT NULL,
    refund_amount DECIMAL(12, 2) NOT NULL,
    admin_fee DECIMAL(12, 2) DEFAULT 0,
    final_refund_amount DECIMAL(12, 2) NOT NULL,
    refund_percentage INT DEFAULT 100,
    status ENUM('pending', 'reviewing', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    reviewed_by INT NULL,
    reviewed_at DATETIME NULL,
    completed_at DATETIME NULL,
    refund_method ENUM('original_payment', 'bank_transfer', 'points') DEFAULT 'original_payment',
    bank_name VARCHAR(50) NULL,
    bank_account_number VARCHAR(50) NULL,
    bank_account_holder VARCHAR(100) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Reschedule Requests Table
CREATE TABLE IF NOT EXISTS reschedule_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reschedule_code VARCHAR(20) NOT NULL UNIQUE,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    original_flight_id INT NOT NULL,
    new_flight_id INT NOT NULL,
    reschedule_fee DECIMAL(12, 2) NOT NULL,
    price_difference DECIMAL(12, 2) DEFAULT 0,
    service_fee DECIMAL(12, 2) DEFAULT 60000,
    total_fee DECIMAL(12, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'rejected', 'cancelled') DEFAULT 'pending',
    confirmed_at DATETIME NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (original_flight_id) REFERENCES flights(id) ON DELETE CASCADE,
    FOREIGN KEY (new_flight_id) REFERENCES flights(id) ON DELETE CASCADE
);

-- Create Refund Policies Table
CREATE TABLE IF NOT EXISTS refund_policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    airline_id INT NULL,
    flight_class_id INT NULL,
    hours_before_departure INT NOT NULL,
    refund_percentage INT NOT NULL,
    admin_fee DECIMAL(12, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (airline_id) REFERENCES airlines(id) ON DELETE CASCADE,
    FOREIGN KEY (flight_class_id) REFERENCES flight_classes(id) ON DELETE CASCADE
);

-- Create Indexes for better performance
CREATE INDEX idx_flights_departure ON flights(departure_time);
CREATE INDEX idx_flights_origin ON flights(origin_airport_id);
CREATE INDEX idx_flights_destination ON flights(destination_airport_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_code ON bookings(booking_code);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_refunds_booking ON refund_requests(booking_id);
CREATE INDEX idx_refunds_user ON refund_requests(user_id);
CREATE INDEX idx_refunds_status ON refund_requests(status);
CREATE INDEX idx_reschedules_booking ON reschedule_requests(booking_id);
CREATE INDEX idx_reschedules_user ON reschedule_requests(user_id);
CREATE INDEX idx_promos_active ON promos(is_active, start_date, end_date);
CREATE INDEX idx_transactions_status ON transactions(payment_status);
