// utils/datauri.js
import DataUriParser from 'datauri/parser.js';
import path from 'path';
import fs from 'fs';

const getDataUri = (file) => {
  // If file is coming from disk storage
  if (file.path) {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname || path.basename(file.path));
    const fileBuffer = fs.readFileSync(file.path);
    return parser.format(extName, fileBuffer);
  } 
  // If file is in memory (for compatibility)
  else if (file.buffer) {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname);
    return parser.format(extName, file.buffer);
  }
  
  throw new Error('Invalid file object. Ensure either path or originalname and buffer exist.');
};

export default getDataUri;