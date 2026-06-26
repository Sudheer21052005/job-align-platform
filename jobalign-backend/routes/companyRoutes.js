import express from 'express';
import { registerCompany, getCompany, getCompanyById, updateCompany } from '../controllers/company.Controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; // Updated import
import multer from 'multer';

const router = express.Router();

// Configure multer with memory storage to handle file uploads (for logos)
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('logo');

/**
 * POST /company/register
 * - Registers a new company.
 * - Protected route: Requires authentication (authMiddleware).
 * - Uses multer (upload) so that a logo file is processed if provided.
 */
router.post('/register', authMiddleware, registerCompany);

/**
 * GET /company/get
 * - Retrieves companies for the logged-in user.
 * - Protected route.
 */
router.get('/get', authMiddleware, getCompany);

/**
 * GET /company/get/:id
 * - Retrieves a company by its ID.
 * - Protected route.
 */
router.get('/get/:id', authMiddleware, getCompanyById);

/**
 * PUT /company/update/:id
 * - Updates company details and optionally the company logo.
 * - Uses multer (upload) to handle file upload.
 * - Protected route.
 */
router.put('/update/:id', authMiddleware, upload, updateCompany);

export default router;
