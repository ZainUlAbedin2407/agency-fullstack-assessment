import express from 'express';
const router = express.Router();
import { getCampaigns, createCampaign, softDeleteCampaign, getCampaignById, updateCampaign } from '../controllers/campaign.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

// Protect ALL routes
router.use(verifyToken);

router.get('/', getCampaigns);
router.post('/', createCampaign);
router.get('/:id', getCampaignById);
router.put('/:id', updateCampaign);
router.delete('/:id', softDeleteCampaign);

export default router;