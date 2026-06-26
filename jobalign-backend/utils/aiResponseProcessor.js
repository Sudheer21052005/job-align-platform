/**
 * utils/aiResponseProcessor.js
 * 
 * Standardized utility functions for processing AI API responses
 * across all services (job analysis, resume parsing, and matching).
 */

/**
 * Processes the raw AI response from the Gemini API.
 * Cleans, extracts, and parses the JSON response in a standardized way.
 * 
 * @param {Object} aiResponse - The raw response from the Gemini API
 * @param {String} context - Context identifier for error messages (e.g., 'job analysis', 'resume parsing', 'matching')
 * @returns {Object} - The parsed data object from the AI response
 * @throws {Error} - If the response is empty, invalid, or cannot be parsed
 */
export const processAiResponse = (aiResponse, context) => {
  // Verify response structure
  if (!aiResponse?.data?.candidates || aiResponse.data.candidates.length === 0) {
    throw new Error(`Empty or invalid response from AI service during ${context}.`);
  }

  // Extract text from response
  let aiResponseText = aiResponse.data.candidates[0].content.parts[0].text;
  
  try {
    // Remove any markdown formatting (e.g., ```json and ```)
    aiResponseText = aiResponseText.replace(/^```json\s*/g, "").replace(/```$/g, "").trim();
    
    // Extract valid JSON portion by locating the first '{' and the last '}'
    const firstBrace = aiResponseText.indexOf("{");
    const lastBrace = aiResponseText.lastIndexOf("}");
    
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error(`No valid JSON object found in the AI response during ${context}.`);
    }
    
    aiResponseText = aiResponseText.substring(firstBrace, lastBrace + 1);
    
    // Parse the cleaned JSON response
    return JSON.parse(aiResponseText);
  } catch (parseError) {
    console.error(`Error parsing AI response as JSON during ${context}:`, parseError);
    throw new Error(`AI returned an invalid response format during ${context}. ${parseError.message}`);
  }
};

/**
 * Creates a standardized API request object for Gemini
 * 
 * @param {String} prompt - The full prompt to send to the API
 * @param {Object} options - Optional configuration settings
 * @returns {Object} - The formatted request object
 */
export const createGeminiRequest = (prompt, options = {}) => {
  const defaultOptions = {
    temperature: 0.1,
    maxOutputTokens: 8000
  };
  
  const config = { ...defaultOptions, ...options };
  
  return {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: config.temperature,
      maxOutputTokens: config.maxOutputTokens
    }
  };
};

/**
 * Creates standardized headers for the Gemini API request
 * 
 * @param {String} apiKey - The Gemini API key
 * @returns {Object} - The headers object
 */
export const createGeminiHeaders = (apiKey) => {
  return {
    "Content-Type": "application/json",
    "x-goog-api-key": apiKey
  };
};

/**
 * Validates API environment configuration
 * 
 * @returns {Boolean} - Whether the API is properly configured
 */
export const isGeminiConfigured = () => {
  return Boolean(process.env.GEMINI_API_URL && process.env.GEMINI_API_KEY);
}; 