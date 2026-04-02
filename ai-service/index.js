import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import briefRoutes from './routes/brief.route.js';
import generateRoutes from './routes/generate.route.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/brief', briefRoutes); // Aapka endpoint ab /api/brief/generate hoga
app.use('/generate', generateRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'ai-service' });
});

const PORT = 5001; // Taake server (5000) se clash na ho
app.listen(PORT, () => {
    console.log(`🚀 AI Microservice running on http://localhost:${PORT}`);
});