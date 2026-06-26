// routes/applicationMatchingRoutes.js

import express from 'express';
import { analyzeApplicationMatching, fetchApplicationMatchDetails } from '../controllers/applicationMatching.Controller.js';
import { verifyToken } from '../utils/jwt.js';
import { authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /match/:applicationId
 * -----------------------------
 * Triggers the matching analysis for a specific job application.
 * This endpoint:
 *  - Uses the applicationId provided in the URL.
 *  - Requires authentication (via verifyToken).
 *  - Restricts access to recruiters only (via authorizeRoles('recruiter')).
 * 
 * When this endpoint is hit, the controller retrieves the job application (including job, user, and resume details),
 * calls the matching analysis service to generate a detailed analysis,
 * saves the analysis in the ApplicationMatchingModel,
 * and returns the analysis result.
 */
router.post('/match/:applicationId', verifyToken, authorizeRoles('recruiter'), async (req, res) => {
  await analyzeApplicationMatching(req, res);
});

// 🔍 Fetch AI-Generated Match Details (Recruiters & Applicants)
router.get('/details/:applicationId', verifyToken, fetchApplicationMatchDetails);

export default router;
