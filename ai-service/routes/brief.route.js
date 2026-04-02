import express from 'express';
import { generateBrief } from '../controllers/brief.controller.js';

const router = express.Router();

router.post('/generate', generateBrief);

export default router;
