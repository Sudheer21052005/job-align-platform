// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Authentication Middleware:
 * Verifies that the request has a valid JWT token.
 * If valid, attaches the decoded user data to req.user.
 */
export const authMiddleware = (req, res, next) => {
  try {
    // Retrieve the Authorization header
    const token = req.header('Authorization');

    // Check if token exists and has the proper "Bearer" format
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Extract the token (remove "Bearer " prefix)
    const extractedToken = token.split(' ')[1];
    const decoded = jwt.verify(extractedToken, JWT_SECRET);

    // Attach decoded user data (e.g., id, role) to the request
    req.user = decoded;

    next(); // Proceed to next middleware
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

/**
 * Role-Based Access Control (RBAC) Middleware:
 * Allows access only if the user’s role is one of the allowed roles.
 * Usage: authorizeRoles('recruiter', 'admin') etc.
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied: Insufficient permissions' });
    }
    next();
  };
};
