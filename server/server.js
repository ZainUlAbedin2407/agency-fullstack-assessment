import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Route Imports (Ensure you add .js extension for ESM)
import authRoutes from './routes/auth.route.js';
import campaignRoutes from './routes/campaign.route.js';

dotenv.config();

const app = express();

// 1. GLOBAL MIDDLEWARES
app.use(helmet());
app.use(cors());
app.use(express.json());

// 2. RATE LIMITER (Requirement: 100 requests/minute per IP)
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
    message: { error: "Too many requests, please try again after a minute." }
});
app.use(limiter);

// 3. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);

app.get('/', (req, res) => {
    res.send("Supabase Server is Live with ESM & Rate Limiting! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});