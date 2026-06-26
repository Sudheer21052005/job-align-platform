// services/jobAnalysisService.js
import axios from "axios";
import {
  jobAnalysisPrompt,
  jobResponsePrompt,
} from "./jobAnalysis.js";
import {
  processAiResponse,
  createGeminiRequest,
  createGeminiHeaders,
  isGeminiConfigured
} from "../utils/aiResponseProcessor.js";

/**
 * analyzeJob
 * -----------------------------
 * Analyzes a job description using AI analysis.
 *
 * Workflow:
 * 1. Build a text summary of the job details.
 * 2. Combine the summary with the job analysis prompt and response format instructions.
 * 3. Check if AI analysis is enabled via environment variables.
 * 4. Call the AI API (e.g., Google Gemini) with the full prompt.
 * 5. Process the AI response by removing any markdown formatting, extracting and parsing the JSON.
 * 6. Return the structured job analysis object.
 *
 * @param {Object} jobData - Object containing job details (title, description, experience, responsibilities, skills, soft_skill).
 * @returns {Object} - The structured job analysis results.
 */
export const analyzeJob = async (jobData) => {
  // Destructure relevant fields from jobData
  const {
    title,
    description,
    experience,
    responsibilities,
    skills,
    soft_skill,
  } = jobData;

  // Build a text summary of the job details.
  // For arrays, join them with commas for clarity.
  const jobDetailsText = `
Title: ${title}
Description: ${description}
Experience: ${experience}
Responsibilities: ${Array.isArray(responsibilities)
      ? responsibilities.join(", ")
      : responsibilities
    }
Skills: ${Array.isArray(skills) ? skills.join(", ") : skills}
Soft Skills: ${Array.isArray(soft_skill) ? soft_skill.join(", ") : soft_skill}
`;

  // Combine the job analysis prompt, the job details, and the response format prompt.
  const fullPrompt = `
${jobAnalysisPrompt}

Job Details:
${jobDetailsText}

${jobResponsePrompt}
`;

  // Step 3: Check if AI analysis is enabled via environment variables.
  if (!isGeminiConfigured()) {

    return {
      degree: [],
      experience: [experience],
      skills: Array.isArray(skills) ? skills : [],
      responsibility: Array.isArray(responsibilities) ? responsibilities : [],
      certificate: [],
      soft_skill: Array.isArray(soft_skill) ? soft_skill : [],
    };
  }

  // Step 4: Call the AI API using axios.
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
    throw new Error("AI job analysis failed. Please try again later.");
  }

  // Step 5: Process the AI response using our utility function.
  try {
    return processAiResponse(aiResponse, "job analysis");
  } catch (parseError) {
    console.error("Error processing AI response:", parseError.message);
    throw parseError;
  }
};

export default analyzeJob;
