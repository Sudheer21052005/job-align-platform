// routes/recruiter.js


import express from 'express';
import JobApplication from '../models/JobApplication.js';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware.js';
import JobModel, { getJobById } from '../models/JobModel.js';



// Import controller functions (including createJobListing)
import { 
  createJobListing, 
  getJobsByRecruiterId, 
  getJob, 
  getAllJobs, 
  updateJobListing, 
  deleteJobListing, 
  markJobClosed, 
  getJobAnalytics, 
  saveJobEntry, 
  unsaveJobEntry, 
  addApplicantEntry 
} from '../controllers/job.Controller.js';

const router = express.Router();

/**
 * POST /create
 * -----------------------------
 * Registers a new job posting.
 * This endpoint now uses the createJobListing controller, which integrates AI job analysis
 * to generate recommendations for missing fields (like degree and certificate) based on the job description.
 */
router.post('/create', authMiddleware, authorizeRoles('recruiter'), createJobListing);

/**
 * GET /myJobs
 * -----------------------------
 * Retrieves all jobs posted by the authenticated recruiter with pagination.
 */
router.get('/myJobs', authMiddleware, authorizeRoles('recruiter'), getJobsByRecruiterId);


/**
 * GET /jobApplicants/:jobId
 * -----------------------------
 * Retrieves the applicants for a specific job posting.
 */
router.get('/jobApplicants/:jobId', authMiddleware, authorizeRoles('recruiter'), async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await getJobById(jobId);
    if (!job || job.recruiter.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const applicants = await JobApplication.find({ job: jobId }).populate('user', 'name email');
    res.status(200).json(applicants);
  } catch (err) {
    console.error('Error fetching applicants:', err);
    res.status(500).json({ message: 'Error fetching applicants', error: err.message });
  }
});

/**
 * GET /jobDetails/:id
 * -----------------------------
 * Retrieves detailed information for a specific job posting.
 */
router.get('/jobDetails/:id', authMiddleware, authorizeRoles('recruiter'), async (req, res) => {
  try {
    const { id } = req.params;
    const job = await JobModel.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (err) {
    console.error('Error fetching job details:', err);
    res.status(500).json({ message: 'Error fetching job details', error: err.message });
  }
});



/**
 * PUT /update/:jobId
 * -----------------------------
 * Updates an existing job posting.
 */
router.put('/update/:jobId', authMiddleware, authorizeRoles('recruiter'), updateJobListing);



/**
 * DELETE /delete/:jobId
 * -----------------------------
 * Deletes a job posting.
 */
router.delete('/delete/:jobId', authMiddleware, authorizeRoles('recruiter'), async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await getJob(jobId);
    if (!job || job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this job' });
    }

    const result = await deleteJobListing(jobId);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ message: 'Error deleting job', error: err.message });
  }
});

/**
 * GET /analytics/:jobId
 * -----------------------------
 * Retrieves analytics for a specific job posting.
 */
router.get('/analytics/:jobId', authMiddleware, authorizeRoles('recruiter'), async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await getJob(jobId);
    if (!job || job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized or job not found' });
    }

    const analytics = await getJobAnalytics({ params: { jobId } }, res);
  } catch (err) {
    console.error('Error fetching job analytics:', err);
    res.status(500).json({ message: 'Error fetching job analytics', error: err.message });
  }
});

/**
 * PUT /markClosed/:jobId
 * -----------------------------
 * Marks a job as closed.
 */
router.put('/markClosed/:jobId', authMiddleware, authorizeRoles('recruiter'), async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await getJob(jobId);
    if (!job || job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized or job not found' });
    }

    const updatedJob = await markJobClosed({ params: { jobId } }, res);
  } catch (err) {
    console.error('Error marking job as closed:', err);
    res.status(500).json({ message: 'Error marking job as closed', error: err.message });
  }
});

/**
 * POST /saveJob
 * -----------------------------
 * Saves a job posting for a job seeker.
 */
router.post('/saveJob', authMiddleware, async (req, res) => {
  const { jobId } = req.body;
  try {
    const job = await saveJobEntry(jobId, req.user.id);
    res.status(200).json(job);
  } catch (err) {
    console.error('Error saving job:', err);
    res.status(500).json({ message: 'Error saving job', error: err.message });
  }
});

/**
 * POST /unsaveJob
 * -----------------------------
 * Removes a saved job for a job seeker.
 */
router.post('/unsaveJob', authMiddleware, async (req, res) => {
  const { jobId } = req.body;
  try {
    const job = await unsaveJobEntry(jobId, req.user.id);
    res.status(200).json(job);
  } catch (err) {
    console.error('Error unsaving job:', err);
    res.status(500).json({ message: 'Error unsaving job', error: err.message });
  }
});

export default router;
