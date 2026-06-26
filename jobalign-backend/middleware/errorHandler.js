

// middleware/errorHandler.js

/**
 * Global Error Handling Middleware
 * Catches errors from all routes and sends a standardized JSON response.
 */
const errorHandler = (err, req, res, next) => {
    console.error("Global Error Handler:", err); // Log the error for debugging
  
    // Set a default status code and message
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
  
    // Send the error response in a consistent format
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  };
  
  export default errorHandler;
  