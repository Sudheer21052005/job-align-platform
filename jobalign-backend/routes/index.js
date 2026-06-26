import express from 'express';
import authRoutes from './authRoutes.js';
import companyRoutes from './companyRoutes.js';
import jobApplicationsRoutes from './jobApplicationsRoutes.js';
import resumeRoutes from './resumeRoutes.js';
import jobSeekerRoutes from './jobSeeker.js';
import recruiterRoutes from './recruiter.js';
import userRoutes from './userRoutes.js';
import applicationMatchingRoutes from './applicationMatchRoutes.js';
import aiAssistantRoutes from './aiAssistant.routes.js';

const router = express.Router();

// Mount the authentication routes under /auth
router.use('/auth', authRoutes);

// Mount company-related routes under /company
router.use('/company', companyRoutes);

// Mount job application-related routes under /applications
router.use('/applications', jobApplicationsRoutes);

// Mount resume upload and processing routes under /resumes
router.use('/resumes', resumeRoutes);

// Mount job seeker-specific routes under /jobseekers
router.use('/jobseekers', jobSeekerRoutes);

// Mount recruiter-specific routes under /recruiters
router.use('/recruiters', recruiterRoutes);

// Mount user profile routes under /users (for profile retrieval and updates)
router.use('/users', userRoutes);

// Mount application matching analysis routes under /matching
router.use('/matching', applicationMatchingRoutes);

// Mount AI assistant routes under /ai
router.use('/ai', aiAssistantRoutes);

export default router;
