// routes/authRoutes.js

import express from 'express';
import { registerUser, loginUser, logout } from '../controllers/auth.Controller.js';
import { forgotPassword, resetPassword, changePassword } from '../controllers/password.Controller.js';
import { verifyToken, generateNewToken } from '../utils/jwt.js';
import { authMiddleware } from "../middleware/authMiddleware.js";
import jwt from 'jsonwebtoken';


const router = express.Router();



/**
 * POST /register
 * - Registers a new user.
 * - Controller: registerUser (called on the registration page).
 */
router.post('/register', registerUser);

/**
 * POST /login
 * - Logs in a user and returns a JWT token.
 * - Controller: loginUser (called on the login page).
 */
router.post('/login', loginUser);

/**
 * POST /verify-token
 * - Verifies if a provided JWT token is valid.
 * - Middleware: verifyToken (attaches user data to req.user if valid).
 * - Returns: A success message and user info.
 * - Frontend: Used to check the validity of stored tokens.
 */
router.post('/verify-token', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Token is valid', user: req.user });
});

/**
 * POST /refresh-token
 * - Generates a new JWT token using a provided refresh token.
 * - Expects: { refreshToken } in the request body.
 * - Frontend: Used when the access token expires; client sends refreshToken to get a new access token.
 */
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }
  try {
    // Verify the refresh token using its secret
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // Generate a new access token with payload containing userId
    const newToken = generateNewToken({ userId: decoded.userId });
    res.json({ newToken });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

/**
 * POST /logout
 * - Logs out the user by clearing the token cookie.
 */
router.post('/logout', logout);



/**
 * POST /forgot-password
 * - Initiates a password reset process by sending a reset link to the user's email.
 * - Controller: forgotPassword (used on the "Forgot Password" page).
 */
router.post('/forgot-password', forgotPassword);

/**
 * POST /reset-password
 * - Resets the user's password using a provided reset token.
 * - Controller: resetPassword (called on the "Reset Password" page).
 */
router.post('/reset-password', resetPassword);

/**
 * PUT /change-password
 * - Allows a logged-in user to change their password.
 * - Middleware: authMiddleware ensures the user is authenticated.
 * - Controller: changePassword (called on the "Change Password" page in the user profile).
 */
router.put("/change-password", authMiddleware, changePassword);

export default router;
