import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildAssetUrl = (req, assetPath) => {
  if (!assetPath) return null;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const normalized = String(assetPath).replace(/^\/+/, '');
  return `${baseUrl}/${normalized}`;
};

const resolveDestinationCardImageFilename = (title) => {
  if (!title) return null;

  // Prefer destination part after arrow ("Jakarta → Bali" => "Bali")
  const raw = String(title);
  const arrowMatch = raw.split(/→|->/);
  const candidate = (arrowMatch.length > 1 ? arrowMatch[arrowMatch.length - 1] : raw).trim();

  // Remove parentheses ("Tokyo (NRT)" => "Tokyo")
  const city = candidate.replace(/\s*\([^)]*\)\s*/g, " ").trim().toLowerCase();

  // Map known destinations to filenames in server/assets/cards
  const map = {
    bali: 'bali.jpg',
    jakarta: 'jakarta.jpg',
    singapore: 'singapore.jpg',
    surabaya: 'surabaya.webp',
    'kuala lumpur': 'kuala lumpur.jpg',
    tokyo: 'tokyo.png',
    osaka: 'osaka.png',
    penang: 'penang.webp',
    pyongyang: 'pyongyang.jpg',
  };

  return map[city] || null;
};

const withDestinationCardImage = (req, destinations) => {
  if (!Array.isArray(destinations)) return [];
  return destinations.map((d) => {
    const filename = resolveDestinationCardImageFilename(d?.title);
    return {
      ...d,
      image: filename ? buildAssetUrl(req, `assets/cards/${filename}`) : null,
    };
  });
};

// Apply middleware
app.use(cors());
app.use(express.json());

// Static assets (airline logos, etc.)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Register endpoint: create user and log in
app.post('/api/register', async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).json({ error: 'Semua data harus diisi.' });
  }
  if (password !== passwordConfirm) {
    return res.status(400).json({ error: 'Password dan konfirmasi tidak cocok.' });
  }
  try {
    // Check if user already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email sudah terdaftar.' });
    }
    // Insert new user
    await db.query('INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    // Get the new user
    const [rows] = await db.query(
      'SELECT id, full_name, email, phone, avatar_url, gender, birth_date, city FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Auth login endpoint (MySQL version, email only)
app.post('/api/login', async (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) {
    return res.status(400).json({ error: 'ID and password are required.' });
  }
  try {
    // Find user by email
    const [rows] = await db.query(
      'SELECT id, full_name, email, phone, avatar_url, gender, birth_date, city, password FROM users WHERE email = ? LIMIT 1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Email atau password salah.' });
    }
    const user = rows[0];
    // In production, use bcrypt to compare hashed passwords!
    if (user.password !== password) {
      return res.status(401).json({ success: false, error: 'Email atau password salah.' });
    }
    const { password: _pw, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get user profile by id
app.get('/api/user/profile', async (req, res) => {
  const { id } = req.query;
  const userId = Number.parseInt(String(id), 10);
  if (!Number.isFinite(userId)) {
    return res.status(400).json({ error: 'User id is required.' });
  }
  try {
    const [rows] = await db.query(
      'SELECT id, full_name, email, phone, avatar_url, gender, birth_date, city FROM users WHERE id = ? LIMIT 1',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Test DB Connection
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ message: 'Database connected successfully!', result: rows[0].result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Update user profile endpoint (by id)
app.put('/api/user/profile', async (req, res) => {
  const { id, full_name, gender, birth_date, city } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'User id is required.' });
  }
  try {
    const [result] = await db.query(
      'UPDATE users SET full_name = ?, gender = ?, birth_date = ?, city = ? WHERE id = ?',
      [full_name, gender, birth_date, city, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Dummy API endpoint for username (default guest session)
app.get('/api/username', (req, res) => {
  // For dev, always return guest (no username)
  res.json({ username: null });
});

// Dummy API endpoint for greeting
app.get('/api/greeting', (req, res) => {
  console.log(`Received request for /api/greeting`);
  res.json({ message: 'Mekas ganteng banget' });
});

// Dummy data for popular destinations
const POPULAR_DESTINATIONS = [
  { title: 'Jakarta → Bali', desc: 'Mulai dari Rp800.000 / orang' },
  { title: 'Jakarta → Singapore', desc: 'Penerbangan langsung tiap hari' },
  { title: 'Surabaya → Jakarta', desc: 'Pilihan maskapai lengkap' },
  { title: 'Jakarta → Kuala Lumpur', desc: 'Promo akhir pekan' }
];

// Dummy data for country destinations
const COUNTRY_DESTINATIONS = {
  Singapore: [
    { title: 'Jakarta → Singapore', desc: 'Durasi 1 jam 45 menit' },
    { title: 'Surabaya → Singapore', desc: 'Transit di Jakarta' },
    { title: 'Medan → Singapore', desc: 'Termasuk bagasi 20kg' },
    { title: 'Bali → Singapore', desc: 'Terbang malam hari' }
  ],
  Malaysia: [
    { title: 'Jakarta → Kuala Lumpur', desc: 'Penerbangan langsung setiap hari' },
    { title: 'Medan → Kuala Lumpur', desc: 'Durasi 1 jam 5 menit' },
    { title: 'Surabaya → Kuala Lumpur', desc: 'Termasuk bagasi 20kg' },
    { title: 'Bali → Penang', desc: 'Transit di Kuala Lumpur' }
  ],
  Japan: [
    { title: 'Jakarta → Tokyo (NRT)', desc: 'Durasi 7 jam, sekali transit' },
    { title: 'Jakarta → Osaka (KIX)', desc: 'Termasuk makan 2x, bagasi 30kg' },
    { title: 'Surabaya → Tokyo (HND)', desc: 'Transit di Jakarta' },
    { title: 'Bali → Tokyo (NRT)', desc: 'Paket liburan musim dingin' }
  ],
  'Korea Utara': [
    { title: 'Jakarta → Pyongyang', desc: 'Penerbangan charter khusus' },
    { title: 'Singapore → Pyongyang', desc: 'Transit di Beijing' },
    { title: 'Kuala Lumpur → Pyongyang', desc: 'Termasuk tur kota' },
    { title: 'Bangkok → Pyongyang', desc: 'Jadwal terbatas' }
  ]
};

// API endpoint for popular destinations
app.get('/api/popular-destinations', (req, res) => {
  res.json({ destinations: withDestinationCardImage(req, POPULAR_DESTINATIONS) });
});

// API endpoint for country destinations
app.get('/api/country-destinations/:country', (req, res) => {
  const country = req.params.country;
  const items = COUNTRY_DESTINATIONS[country] || [];
  res.json({ destinations: withDestinationCardImage(req, items) });
});

// =============================================
// Flight Search API Endpoints
// =============================================

// Get all airports for autocomplete
app.get('/api/airports', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, code, name, city, country FROM airports ORDER BY city ASC'
    );
    res.json({ airports: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch airports', details: error.message });
  }
});

// Get all airlines
app.get('/api/airlines', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, code, name, logo_url FROM airlines ORDER BY name ASC'
    );
    const airlines = rows.map((row) => ({
      ...row,
      logo_url: row.logo_url ? buildAssetUrl(req, `assets/airline-logo/${row.logo_url}`) : null,
    }));
    res.json({ airlines });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch airlines', details: error.message });
  }
});

// Search flights with pagination
app.get('/api/flights/search', async (req, res) => {
  try {
    const { 
      from, 
      to, 
      departure, 
      returnDate, 
      adults = 1, 
      children = 0, 
      infants = 0, 
      flightClass = 'economy',
      page = 1,
      limit = 10,
      sortBy = 'departure_time',
      sortOrder = 'ASC'
    } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Build the base query (using only columns that exist in the table)
    let baseQuery = `
      FROM flights f
      JOIN airlines a ON f.airline_id = a.id
      JOIN airports orig ON f.origin_airport_id = orig.id
      JOIN airports dest ON f.destination_airport_id = dest.id
      WHERE 1=1
    `;

    const baseParams = [];

    // Filter by origin airport (optional)
    if (from) {
      baseQuery += ` AND (orig.code = ? OR orig.city LIKE ?)`;
      baseParams.push(from, `%${from}%`);
    }

    // Filter by destination airport (optional)
    if (to) {
      baseQuery += ` AND (dest.code = ? OR dest.city LIKE ?)`;
      baseParams.push(to, `%${to}%`);
    }

    // Filter by departure date (optional)
    if (departure) {
      baseQuery += ` AND DATE(f.departure_time) = ?`;
      baseParams.push(departure);
    }

    // Get total count first
    const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
    const [countResult] = await db.query(countQuery, baseParams);
    const totalCount = countResult[0].total;
    const totalPages = Math.ceil(totalCount / limitNum);

    // Build the main select query (only select columns that exist)
    let selectQuery = `
      SELECT 
        f.id,
        f.flight_number,
        f.departure_time,
        f.arrival_time,
        f.base_price,
        a.id as airline_id,
        a.code as airline_code,
        a.name as airline_name,
        a.logo_url as airline_logo,
        orig.id as origin_id,
        orig.code as origin_code,
        orig.name as origin_name,
        orig.city as origin_city,
        dest.id as destination_id,
        dest.code as destination_code,
        dest.name as destination_name,
        dest.city as destination_city
      ${baseQuery}
    `;

    // Add sorting
    const validSortColumns = ['departure_time', 'price', 'arrival_time'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'departure_time';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    selectQuery += ` ORDER BY f.${sortColumn} ${order}`;

    // Add pagination
    selectQuery += ` LIMIT ? OFFSET ?`;
    const selectParams = [...baseParams, limitNum, offset];

    const [rows] = await db.query(selectQuery, selectParams);

    // Transform data to match frontend format
    const flights = rows.map(row => {
      const price = row.base_price;

      return {
        id: row.id,
        flightNumber: row.flight_number,
        airline: {
          id: row.airline_id,
          code: row.airline_code,
          name: row.airline_name,
          logo: row.airline_logo ? buildAssetUrl(req, `assets/airline-logo/${row.airline_logo}`) : null
        },
        origin: {
          id: row.origin_id,
          code: row.origin_code,
          name: row.origin_name,
          city: row.origin_city
        },
        destination: {
          id: row.destination_id,
          code: row.destination_code,
          name: row.destination_name,
          city: row.destination_city
        },
        departureTime: row.departure_time,
        arrivalTime: row.arrival_time,
        departureTerminal: 'Terminal 2',
        arrivalTerminal: 'Terminal 1',
        price: price,
        availableSeats: 50,
        stops: 0,
        flightClass: 'Economy',
        baggage: 20,
        cabinBaggage: 7,
        aircraft: 'Boeing 737-800',
        seatLayout: '3-3',
        seatPitch: 30,
        hasWifi: true,
        hasEntertainment: true,
        hasPower: true,
        hasMeal: true,
        isRefundable: true,
        isReschedulable: true,
        rescheduleFee: 150000,
        promos: []
      };
    });

    res.json({ 
      success: true,
      flights: flights,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      meta: {
        from: from || 'Semua',
        to: to || 'Semua',
        departure: departure || 'Semua tanggal',
        passengers: parseInt(adults) + parseInt(children) + parseInt(infants)
      }
    });
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({ error: 'Failed to search flights', details: error.message });
  }
});

// Get flight by ID with full details
app.get('/api/flights/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { flightClass = 'economy' } = req.query;

    const [rows] = await db.query(`
      SELECT 
        f.*,
        a.code as airline_code,
        a.name as airline_name,
        a.logo_url as airline_logo,
        orig.code as origin_code,
        orig.name as origin_name,
        orig.city as origin_city,
        dest.code as destination_code,
        dest.name as destination_name,
        dest.city as destination_city,
        fc.name as flight_class_name,
        fc.multiplier as class_multiplier
      FROM flights f
      JOIN airlines a ON f.airline_id = a.id
      JOIN airports orig ON f.origin_airport_id = orig.id
      JOIN airports dest ON f.destination_airport_id = dest.id
      LEFT JOIN flight_classes fc ON fc.code = ?
      WHERE f.id = ?
    `, [flightClass, id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    const row = rows[0];
    const classMultiplier = row.class_multiplier || 1;

    // Get promos for this flight
    const [promos] = await db.query(`
      SELECT p.code, p.title, p.short_title, p.description, p.discount_type, p.discount_value, p.max_discount
      FROM promos p
      JOIN flight_promos fp ON fp.promo_id = p.id
      WHERE fp.flight_id = ? AND p.is_active = TRUE AND NOW() BETWEEN p.start_date AND p.end_date
    `, [id]);

    const flight = {
      id: row.id,
      flightNumber: row.flight_number,
      airline: {
        code: row.airline_code,
        name: row.airline_name,
        logo: row.airline_logo ? buildAssetUrl(req, `assets/airline-logo/${row.airline_logo}`) : null
      },
      origin: {
        code: row.origin_code,
        name: row.origin_name,
        city: row.origin_city
      },
      destination: {
        code: row.destination_code,
        name: row.destination_name,
        city: row.destination_city
      },
      departureTime: row.departure_time,
      arrivalTime: row.arrival_time,
      departureTerminal: row.departure_terminal,
      arrivalTerminal: row.arrival_terminal,
      price: Math.round(row.base_price * classMultiplier),
      availableSeats: row.available_seats,
      stops: 0,
      flightClass: row.flight_class_name || 'Economy',
      baggage: row.baggage_allowance,
      cabinBaggage: row.cabin_baggage,
      aircraft: row.aircraft_type,
      seatLayout: row.seat_layout,
      seatPitch: row.seat_pitch,
      hasWifi: Boolean(row.has_wifi),
      hasEntertainment: Boolean(row.has_entertainment),
      hasPower: Boolean(row.has_power),
      hasMeal: Boolean(row.has_meal),
      isRefundable: Boolean(row.is_refundable),
      isReschedulable: Boolean(row.is_reschedulable),
      rescheduleFee: row.reschedule_fee,
      promos: promos.map(p => ({
        code: p.code,
        title: p.title,
        shortTitle: p.short_title,
        description: p.description
      }))
    };

    res.json({ success: true, flight });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch flight', details: error.message });
  }
});

// Get active promos
app.get('/api/promos', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, code, title, short_title, description, discount_type, discount_value, max_discount, min_purchase, applies_to
      FROM promos 
      WHERE is_active = TRUE AND NOW() BETWEEN start_date AND end_date
      ORDER BY discount_value DESC
    `);
    res.json({ promos: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch promos', details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});