// middleware/upload.js

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// For operations that need the file saved to disk
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  }
});

// For operations that need the file in memory (like uploading to Cloudinary)
const memoryStorage = multer.memoryStorage();

// File filter for both storage types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
      
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
  }
      
  cb(null, true);
};

// Create both middleware options
const uploadToDisk = multer({
  storage: diskStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB size limit
  fileFilter: fileFilter
});

const uploadToMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB size limit
  fileFilter: fileFilter
});

export { uploadToDisk, uploadToMemory };