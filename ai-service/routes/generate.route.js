import express from 'express';
import { generateCopySSE, generateSocial, generateHashtags } from '../controllers/generate.controller.js';

const router = express.Router();

router.post('/copy', generateCopySSE);
router.post('/social', generateSocial);
router.post('/hashtags', generateHashtags);

export default router;
