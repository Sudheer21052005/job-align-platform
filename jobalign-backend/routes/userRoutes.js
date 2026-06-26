// routes/userRoutes.js
import express from 'express';
import { verifyToken } from '../utils/jwt.js';
import multer from 'multer';
import User from '../models/User.js'; // Mongoose User model
import { updateProfile } from '../controllers/auth.Controller.js'; // Re-use updateProfile logic from auth controller
import JobModel from '../models/JobModel.js';

const router = express.Router();

// Configure multer for profile picture uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('profilePicture');

/**
 * GET /profile
 * Retrieves the authenticated user's profile.
 * Excludes sensitive fields and returns safe user data.
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // Find user by ID set in req.user from verifyToken middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Exclude sensitive fields
    const { password, resetToken, resetTokenExpires, ...safeUserData } = user.toObject();
    res.status(200).json(safeUserData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile', error: err.message });
  }
});

/**
 * GET /saved-jobs
 * Retrieves all jobs saved by the authenticated user.
 * This finds all jobs where the user's ID is in the savedBy array.
 */
router.get('/saved-jobs', verifyToken, async (req, res) => {
  try {
    const savedJobs = await JobModel.find({ savedBy: req.user.id })
      .populate('company', 'name logo location')
      .sort({ datePosted: -1 });
    
    
    // Add a savedAt field (using current date as we don't store when it was saved)
    const enhancedJobs = savedJobs.map(job => {
      const jobObj = job.toObject();
      jobObj.savedAt = new Date(); // We don't store this info, so use current date
      return jobObj;
    });
    
    res.status(200).json({ savedJobs: enhancedJobs });
  } catch (err) {
    console.error('Error fetching saved jobs:', err);
    res.status(500).json({ message: 'Error fetching saved jobs', error: err.message });
  }
});

/**
 * PUT /profile
 * Updates the authenticated user's profile details, including profile picture.
 */
router.put('/profile', verifyToken, upload, updateProfile);

export default router;
