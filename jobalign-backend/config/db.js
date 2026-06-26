// config/db.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // The options useNewUrlParser and useUnifiedTopology are no longer needed in newer Mongoose/Node.js Driver versions
    });
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();

const db = mongoose.connection;

// These exports (admin, bucket) are placeholders.
// Remove or update them if you integrate functionality similar to Firebase later.
const admin = {};
const bucket = {};

export { db, admin, bucket };
