import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import briefRoutes from './routes/brief.route.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/brief', briefRoutes); // Aapka endpoint ab /api/brief/generate hoga

const PORT = 5001; // Taake server (5000) se clash na ho
app.listen(PORT, () => {
    console.log(`🚀 AI Microservice running on http://localhost:${PORT}`);
});