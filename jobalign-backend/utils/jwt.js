// utils/jwt.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables.");
}
if (!REFRESH_TOKEN_SECRET) {
  console.error("REFRESH_TOKEN_SECRET is not defined in environment variables.");
}

/**
 * Middleware to verify JWT token.
 * - Extracts the token from the "Authorization" header.
 * - Verifies the token using the JWT_SECRET.
 * - Retrieves the user from MongoDB (using Mongoose).
 * - Attaches the user data to req.user.
 * - Optionally restricts access for non-recruiters for job creation routes.
 */
const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expected format: "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Fetch user from MongoDB using Mongoose
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Attach user data to request

    // Restrict access for certain routes: Only recruiters can create jobs.
    if (user.role !== 'recruiter' && req.originalUrl.includes('/jobs/create')) {
      return res.status(403).json({ message: 'You must be a recruiter to create jobs' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Failed to authenticate token', error: err.message });
  }
};

/**
 * Function to generate a new JWT token.
 * - Signs the payload with JWT_SECRET and an expiration time of 1 day.
 * - Logs the generated token for debugging purposes.
 * 
 * Usage: Called during user login or token refresh.
 */
const generateNewToken = (payload) => {
  try {
    if (!JWT_SECRET) {
      throw new Error("JWT secret is not defined");
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    return token;
  } catch (err) {
    console.error('Error generating token:', err.message);
    return null;
  }
};

/**
 * Function to generate a refresh token.
 * - Signs the payload with REFRESH_TOKEN_SECRET and an expiration time of 7 days.
 * - Logs the generated refresh token for debugging purposes.
 * 
 * Usage: Typically used alongside the primary token to allow session renewal.
 */
const generateRefreshToken = (payload) => {
  try {
    if (!REFRESH_TOKEN_SECRET) {
      throw new Error("Refresh token secret is not defined");
    }
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return refreshToken;
  } catch (err) {
    console.error('Error generating refresh token:', err.message);
    return null;
  }
};

export { verifyToken, generateNewToken, generateRefreshToken };
