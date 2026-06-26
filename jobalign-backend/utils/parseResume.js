// utils/parseResume.js

import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Parses a PDF resume and extracts structured data.
 * Uses pdf-parse to extract text from the PDF file.
 *
 * @param {String} filePath - The path to the PDF file.
 * @returns {Object} - An object containing normalized extracted fields.
 */
export const parsePdfResume = async (filePath) => {
  try {
    // Read the PDF file into a buffer
    const dataBuffer = fs.readFileSync(filePath);
    // Extract the text using pdf-parse
    const data = await pdfParse(dataBuffer);
    const rawContent = data.text;

    // TODO: Replace the placeholder extraction logic below with your own extraction routines.
    return {
      content: rawContent.trim(),
      name: "Extracted Name", // Placeholder - use regex or NLP for actual extraction.
      experienceSummary: "Extracted Experience Summary", // Placeholder
      skills: [], // Placeholder array; you can extract skills with custom logic.
      education: "", // Placeholder string; consider extracting with regex.
      qualifications: [] // Placeholder array for qualifications.
    };
  } catch (error) {
    console.error("Error parsing PDF resume:", error);
    throw new Error("Failed to parse PDF resume.");
  }
};

/**
 * Parses a DOCX resume and extracts structured data.
 * Uses mammoth to extract raw text from the DOCX file.
 *
 * @param {String} filePath - The path to the DOCX file.
 * @returns {Object} - An object containing normalized extracted fields.
 */
export const parseDocxResume = async (filePath) => {
  try {
    // Extract raw text from the DOCX file using mammoth
    const result = await mammoth.extractRawText({ path: filePath });
    const rawContent = result.value;

    // TODO: Replace the placeholder extraction logic below with your own extraction routines.
    return {
      content: rawContent.trim(),
      name: "Extracted Name", // Placeholder - use regex or NLP for actual extraction.
      experienceSummary: "Extracted Experience Summary", // Placeholder
      skills: [], // Placeholder array; implement skill extraction as needed.
      education: "", // Placeholder string; extract education details if possible.
      qualifications: [] // Placeholder array for qualifications.
    };
  } catch (error) {
    console.error("Error parsing DOCX resume:", error);
    throw new Error("Failed to parse DOCX resume.");
  }
};
