import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

// Apply middleware
app.use(cors());
app.use(express.json());

// Define a simple API route
app.get('/api/username', (req, res) => {
  console.log(`Received request for /api/username`);
  res.json({ message: 'Mekas' });
});

app.get('/api/greeting', (req, res) => {
  console.log(`Received request for /api/greeting`);
  res.json({ message: 'Mekas ganteng banget' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});