import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = '127.0.0.1';

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'CypressBeans API', uptime: process.uptime() });
});

app.listen(Number(PORT), HOST, () => {
  console.log(`☕ CypressBeans API corriendo en http://${HOST}:${PORT}`);
});
