import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

// Apply middleware
app.use(cors());
app.use(express.json());

// Define a simple API route
app.get('/api/greeting', (req, res) => {
  // You can also use template literals here for uniformity:
  console.log(`Received request for /api/greeting`);
  res.json({ message: 'Mekas Ganteng Banget sumpah asli' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});