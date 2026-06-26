// Services/resumeParserService.js
import axios from "axios";
import { parsePdfResume, parseDocxResume } from "../utils/parseResume.js";
import {
  candidateAnalysisPrompt,
  candidateResponsePrompt,
} from "../services/resumeAnalysis.js";
import {
  processAiResponse,
  createGeminiRequest,
  createGeminiHeaders,
  isGeminiConfigured
} from "../utils/aiResponseProcessor.js";

/**
 * Processes a resume file for AI analysis.
 *
 * Workflow:
 * 1. Parse the resume using the appropriate parser (PDF or DOCX).
 * 2. Clean and prepare the extracted text.
 * 3. Build a full prompt by combining:
 *    - Candidate analysis instructions (candidateAnalysisPrompt)
 *    - The resume text
 *    - Desired JSON response format (candidateResponsePrompt)
 * 4. Call the Google Gemini API with the prompt.
 * 5. Process the AI response, merging it with the initial parsed data.
 * 6. Return the final structured object.
 *
 * @param {Object} file - The uploaded resume file object.
 * @returns {Object} - The final combined resume data.
 */
export const processResume = async (file) => {
  let parsedData;

  try {
    // Step 1: Parse the resume file based on its mimetype.
    if (file.mimetype === "application/pdf") {
      parsedData = await parsePdfResume(file.path);
    } else if (
      file.mimetype === "application/msword" ||
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      parsedData = await parseDocxResume(file.path);
    } else {
      throw new Error(
        "Invalid file type. Only PDF and DOCX files are allowed."
      );
    }
  } catch (parseError) {
    console.error("Error during resume parsing:", parseError.message);
    throw new Error("Failed to parse resume file.");
  }

  // Step 2: Clean the extracted text.
  const cleanText = parsedData.content ? parsedData.content.trim() : "";
  if (!cleanText) {
    throw new Error("No content extracted from resume.");
  }



  // Step 3: Check if AI analysis is enabled via environment variables
  if (!isGeminiConfigured()) {
    return {
      content: cleanText,
      name: parsedData.name || extractNameFromText(cleanText) || "Unknown",
      phoneNumber: extractPhoneFromText(cleanText) || "",
      email: extractEmailFromText(cleanText) || "",
      aiComment: "Resume successfully parsed. AI analysis not available.",
      education: [],
      experience: [],
      technicalSkills: [],
      responsibilities: [],
      certifications: [],
      softSkills: [],
      jobRecommendations: [],
      resumeRankScore: 70, // Default baseline score
      summary:
        "This is an automatically generated summary based on the parsed resume.",
    };
  }

  // Step 4: Prepare the full prompt for AI analysis.
  const fullPrompt = `
    ${candidateAnalysisPrompt}
    
    Resume Text: ${cleanText}
    
    ${candidateResponsePrompt}
  `;

  // Step 5: Call the Google Gemini API using axios.
  let aiResponse;
  try {
    aiResponse = await axios.post(
      process.env.GEMINI_API_URL,
      createGeminiRequest(fullPrompt),
      {
        headers: createGeminiHeaders(process.env.GEMINI_API_KEY)
      }
    );
  } catch (apiError) {
    console.error("Error calling AI service:", apiError.message);
    throw new Error("AI resume analysis failed. Please try again later.");
  }

  // Step 6: Process the AI response using our utility function.
  let aiData;
  try {
    aiData = processAiResponse(aiResponse, "resume parsing");
  } catch (parseError) {
    console.error("Error processing AI response:", parseError.message);
    throw parseError;
  }

  // Step 7: Merge the AI-enhanced data with the initial parsed data.
  const finalData = {
    content: cleanText,
    name: aiData.candidate_name || parsedData.name || "Unknown",
    phoneNumber: aiData.phone_number || "",
    email: aiData.email || "",
    aiComment: aiData.comment || "",
    education: aiData.degree || [],
    experience: aiData.experience || [],
    technicalSkills: aiData.technical_skill || [],
    responsibilities: aiData.responsibility || [],
    certifications: aiData.certificate || [],
    softSkills: aiData.soft_skill || [],
    jobRecommendations: aiData.job_recommended || [],
    resumeRankScore: aiData.resumeRankScore || 0,
    summary: aiData.summary || "",
  };


  // Step 8: Return the final combined data.
  return finalData;
};

// Helper functions to extract basic information from text
function extractNameFromText(text) {
  // Simple name extraction - assumes name is at the beginning
  const lines = text.split("\n");
  return lines[0] || "Unknown";
}

function extractPhoneFromText(text) {
  // Simple phone number extraction
  const phoneRegex =
    /(\+\d{1,3}[-\.\s]??)?\(?\d{3}\)?[-\.\s]?\d{3}[-\.\s]?\d{4}/g;
  const match = text.match(phoneRegex);
  return match ? match[0] : "";
}

function extractEmailFromText(text) {
  // Simple email extraction
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const match = text.match(emailRegex);
  return match ? match[0] : "";
}

export default processResume;
