import express from 'express';
const router = express.Router();
import { getCampaigns, createCampaign, softDeleteCampaign } from '../controllers/campaign.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

// Protect ALL routes
router.use(verifyToken);

router.get('/', getCampaigns);
router.post('/', createCampaign);
router.delete('/:id', softDeleteCampaign);

export default router;