// routes/resumeRoutes.js
import express from 'express';
import { uploadResume, getResumes} from '../controllers/resume.Controller.js';
import { uploadToMemory } from '../middleware/upload.js';
// Fix the import for the auth middleware
// Option 1: If it has named exports
import { authMiddleware } from '../middleware/authMiddleware.js';
// Option 2: If the file path is incorrect
// import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Use uploadToMemory instead of upload
router.post('/upload', authMiddleware, uploadToMemory.single('resume'), uploadResume);
router.get('/user/:userId', authMiddleware, getResumes);

export default router;