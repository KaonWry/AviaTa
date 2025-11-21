import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

// Apply middleware
app.use(cors());
app.use(express.json());

// Dummy API endpoint for username
app.get('/api/username', (req, res) => {
  res.json({ username: 'Mekas' });
});


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
  res.json({ destinations: POPULAR_DESTINATIONS });
});

// API endpoint for country destinations
app.get('/api/country-destinations/:country', (req, res) => {
  const country = req.params.country;
  const items = COUNTRY_DESTINATIONS[country] || [];
  res.json({ destinations: items });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});