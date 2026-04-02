import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Route Imports (Ensure you add .js extension for ESM)
import authRoutes from './routes/auth.route.js';
import campaignRoutes from './routes/campaign.route.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Match CORS policy for standard dev environment
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

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

// SOCKET.IO REAL-TIME ENGINE
io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
});

// Dummy Rule Engine: Simulate an event every 30 seconds to test realtime functionality
setInterval(() => {
    const alerts = [
        { id: Date.now() + 1, type: 'campaign_alert', title: 'Threshold Reached', message: 'The current campaign has reached 85% of budget.' },
        { id: Date.now() + 2, type: 'ai_alert', title: 'Brief Ready', message: 'CampaignHQ AI successfully drafted the new creative brief.' },
        { id: Date.now() + 3, type: 'system_alert', title: 'System Sync', message: 'Live data successfully synchronizing with database.' }
    ];
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    io.emit('receive_alert', randomAlert);
}, 30000);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} with Socket.io Enabled`);
});