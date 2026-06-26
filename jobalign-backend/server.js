import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import './config/db.js'; // Connects to MongoDB

dotenv.config();
const app = express();


// Updated CORS configuration: Only allow http://localhost:3000 and enable credentials
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// Middleware to parse JSON
app.use(express.json());

// Mount routes under /api
app.use('/api', routes);

// Mount error handler after routes
app.use(errorHandler);

// Root Route for testing
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
