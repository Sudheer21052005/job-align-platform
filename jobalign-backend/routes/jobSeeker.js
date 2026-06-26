// src/routes/jobSeeker.js
import express from 'express';
import { verifyToken } from '../utils/jwt.js';
import { Job } from '../models/indexModel.js'; // Using the consolidated models index

const router = express.Router();

/**
 * Inline Middleware: checkJobSeekerRole
 * - Description: Checks if the authenticated user has the role "jobSeeker."
 * - If the role is "jobSeeker", the request proceeds; otherwise, a 403 response is returned.
 */
const checkJobSeekerRole = (req, res, next) => {
  if (req.user && req.user.role === 'jobSeeker') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Job seekers only.' });
  }
};

/**
 * GET /jobs
 * -----------------------------
 * Retrieves all available jobs with pagination and filtering.
 * Query parameters supported:
 *   - page: the current page number (default 1)
 *   - limit: number of jobs per page (default 10)
 *   - location: filter by job location
 *   - salary: filter by salary range (format "min-max")
 */
router.get('/jobs', verifyToken, checkJobSeekerRole, async (req, res) => {
  try {
    let { limit = 10, page = 1, location, salary } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    // Build query object for filtering
    const query = {};
    if (location) {
      query.location = location;
    }
    if (salary) {
      const [min, max] = salary.split('-').map(Number);
      query.salaryLPA = { $gte: min, $lte: max };
    }

    const skip = (page - 1) * limit;
    
    // Get total count for pagination info
    const totalJobs = await Job.countDocuments(query);

    // Query jobs with filtering, sorting, and pagination
    const jobs = await Job.find(query)
      .sort({ datePosted: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ jobs, page, limit, totalJobs });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Error fetching jobs', error: err.message });
  }
});

/**
 * GET /jobs/:id
 * -----------------------------
 * Retrieves detailed information for a specific job.
 */
router.get('/jobs/:id', verifyToken, checkJobSeekerRole, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (err) {
    console.error('Error fetching job details:', err);
    res.status(500).json({ message: 'Error fetching job details', error: err.message });
  }
});


export default router;
