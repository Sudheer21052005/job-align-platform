import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import * as aiAssistantController from '../controllers/aiAssistant.Controller.js';

const router = express.Router();

// Route for general job assistance
router.post('/job-assistant', authMiddleware, aiAssistantController.getJobAssistanceResponse);

// Route for resume review
router.post('/resume-review', authMiddleware, aiAssistantController.getResumeReview);

// Route for interview tips
router.post('/interview-tips', authMiddleware, aiAssistantController.getInterviewTips);

// Route for job match analysis
router.post('/job-match', authMiddleware, aiAssistantController.getJobMatchAnalysis);

export default router; 