import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createClaim,
  getMyClaims,
  getAllClaims,
  getPendingClaimsCount,
  updateClaim,
  getClaimStats,
} from '../controllers/claimController.js';
import { protect, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

const claimLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: { success: false, message: 'Too many claim attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Contributor routes
router.post('/', claimLimiter, protect, createClaim);
router.get('/my-claims', protect, getMyClaims);

// Super Admin routes
router.get('/stats', protect, superAdminOnly, getClaimStats);
router.get('/pending/count', protect, superAdminOnly, getPendingClaimsCount);
router.get('/', protect, superAdminOnly, getAllClaims);
router.put('/:id', protect, superAdminOnly, updateClaim);

export default router;
