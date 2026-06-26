// routes/jobApplicationRoutes.js

import express from 'express';
import { 
  applyForJob, 
  getJobApplicationsByUser, 
  updateJobApplicationStatus, 
  deleteApplication,
  getAllApplicantsForRecruiter
} from '../controllers/jobApplication.Controller.js';
import { verifyToken } from '../utils/jwt.js';
import { authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /apply/:jobId
 * -----------------------------
 * Allows job seekers to apply for a job.
 * Expects a resumeId in req.body (the resume should be processed via the resume upload route),
 * along with a coverLetter. The jobId is taken from the URL.
 */
router.post('/apply/:jobId', verifyToken, async (req, res) => {
  // Attach jobId from params to req.body for use in the controller
  req.body.jobId = req.params.jobId;
  // Expect that req.body contains a 'resumeId' from the resume upload process
  await applyForJob(req, res);
});

/**
 * GET /user/:userId
 * -----------------------------
 * Retrieves all job applications submitted by a given user.
 */
router.get('/user/:userId', verifyToken, getJobApplicationsByUser);

/**
 * PUT /update-status/:applicationId
 * -----------------------------
 * Updates the status and recruiter notes of a job application.
 */
router.put('/update-status/:applicationId', verifyToken, updateJobApplicationStatus);

/**
 * DELETE /delete/:applicationId
 * -----------------------------
 * Deletes a job application.
 */
router.delete('/delete/:applicationId', verifyToken, deleteApplication);

/**
 * GET /all-applicants
 * -----------------------------
 * Retrieves all job applications for all jobs posted by the authenticated recruiter.
 * This endpoint allows recruiters to view every application across their job postings.
 */
router.get('/all-applicants', verifyToken, authorizeRoles('recruiter'), async (req, res) => {
  await getAllApplicantsForRecruiter(req, res);
});

export default router;
