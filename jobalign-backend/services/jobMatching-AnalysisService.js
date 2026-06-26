// service/jobMatching-AnalysisService.js
import axios from "axios";
import {
  candidateMatchingPrompt,
  candidateEvaluationSchema
} from "./matchingAnalysis.js";
import {
  processAiResponse,
  createGeminiRequest,
  createGeminiHeaders,
  isGeminiConfigured
} from "../utils/aiResponseProcessor.js";

/**
 * analyse_matching
 * -----------------------------
 * Analyzes how well a candidate matches with a job using AI analysis.
 *
 * Workflow:
 * 1. Build text summaries of both the job and candidate details.
 * 2. Combine these summaries with the candidate matching prompt.
 * 3. Check if AI analysis is enabled via environment variables.
 * 4. Call the AI API (Google Gemini) with the full prompt.
 * 5. Process the AI response by removing any markdown formatting, extracting and parsing the JSON.
 * 6. Return the structured matching analysis object with appropriate scores and comments.
 *
 * @param {Object} matchingData - Object containing job and candidate details
 * @param {Object} matchingData.job - Job details including requirements
 * @param {Object} matchingData.candidate - Candidate details from resume or user profile
 * @returns {Object} - The structured matching analysis results with scores and comments
 */
export const analyse_matching = async (matchingData) => {
  // Destructure job and candidate data
  const { job, candidate } = matchingData;

  // Extract relevant job fields
  const jobDetails = {
    title: job.title || "",
    description: job.description || "",
    experience: job.experience || "",
    responsibilities: Array.isArray(job.responsibilities)
      ? job.responsibilities
      : (job.responsibilities ? [job.responsibilities] : []),
    skills: Array.isArray(job.skills)
      ? job.skills
      : (job.technicalSkills ? job.technicalSkills : []),
    soft_skill: Array.isArray(job.softSkills)
      ? job.softSkills
      : (job.soft_skill ? [job.soft_skill] : []),
    degree: Array.isArray(job.degree)
      ? job.degree
      : (job.degree ? [job.degree] : []),
    certificate: Array.isArray(job.certificates)
      ? job.certificates
      : (job.certificate ? [job.certificate] : [])
  };

  // Extract relevant candidate fields
  // Handling different possible structures based on if it's from resume or user profile
  const candidateEducation = candidate.education || candidate.degree || [];
  const candidateExperience = candidate.workExperience || candidate.experience || [];
  const candidateSkills = candidate.technicalSkills || candidate.skills || [];
  const candidateResponsibilities = candidate.responsibilities || [];
  const candidateCertificates = candidate.certifications || candidate.certificates || candidate.certificate || [];
  const candidateSoftSkills = candidate.softSkills || candidate.soft_skill || [];

  // Format job details into text
  const jobDetailsText = `
JOB REQUIREMENTS:
Job Title: ${jobDetails.title}
Job Description: ${jobDetails.description}

Required Degree: ${jobDetails.degree.join(", ") || "Not specified"}

Required Experience: ${jobDetails.experience || "Not specified"}

Required Responsibilities:
${jobDetails.responsibilities.map(r => `- ${r}`).join("\n") || "Not specified"}

Required Technical Skills:
${jobDetails.skills.map(s => `- ${s}`).join("\n") || "Not specified"}

Required Certificates:
${jobDetails.certificate.map(c => `- ${c}`).join("\n") || "Not specified"}

Required Soft Skills:
${jobDetails.soft_skill.map(s => `- ${s}`).join("\n") || "Not specified"}
`;

  // Format candidate education details
  let candidateEducationText = "Not provided";
  if (Array.isArray(candidateEducation) && candidateEducation.length > 0) {
    candidateEducationText = candidateEducation.map(edu => {
      if (typeof edu === 'string') return `- ${edu}`;
      const degree = edu.degree || edu.qualification || "";
      const field = edu.field || edu.major || "";
      const institution = edu.institution || edu.school || "";
      const startDate = edu.startDate || "";
      const endDate = edu.endDate || "";
      return `- ${degree} ${field ? "in " + field : ""} ${institution ? "from " + institution : ""} ${startDate || endDate ? "(" + startDate + " - " + endDate + ")" : ""}`;
    }).join("\n");
  }

  // Format candidate experience details
  let candidateExperienceText = "Not provided";
  if (Array.isArray(candidateExperience) && candidateExperience.length > 0) {
    candidateExperienceText = candidateExperience.map(exp => {
      if (typeof exp === 'string') return `- ${exp}`;
      const title = exp.title || exp.role || "";
      const company = exp.company || "";
      const startDate = exp.startDate || "";
      const endDate = exp.endDate || "";
      const description = exp.description || "";
      return `- ${title} ${company ? "at " + company : ""} ${startDate || endDate ? "(" + startDate + " - " + endDate + ")" : ""}${description ? ": " + description : ""}`;
    }).join("\n");
  }

  // Format candidate skills and other details
  const candidateSkillsText = Array.isArray(candidateSkills) && candidateSkills.length > 0
    ? candidateSkills.map(s => `- ${s}`).join("\n")
    : "Not provided";

  const candidateResponsibilitiesText = Array.isArray(candidateResponsibilities) && candidateResponsibilities.length > 0
    ? candidateResponsibilities.map(r => `- ${r}`).join("\n")
    : "Not provided";

  const candidateCertificatesText = Array.isArray(candidateCertificates) && candidateCertificates.length > 0
    ? candidateCertificates.map(c => `- ${c}`).join("\n")
    : "Not provided";

  const candidateSoftSkillsText = Array.isArray(candidateSoftSkills) && candidateSoftSkills.length > 0
    ? candidateSoftSkills.map(s => `- ${s}`).join("\n")
    : "Not provided";

  // Compile full candidate details text
  const candidateDetailsText = `
CANDIDATE DETAILS:
Education:
${candidateEducationText}

Work Experience:
${candidateExperienceText}

Technical Skills:
${candidateSkillsText}

Past Responsibilities:
${candidateResponsibilitiesText}

Certificates:
${candidateCertificatesText}

Soft Skills:
${candidateSoftSkillsText}
`;

  // Response format instruction based on the schema
  const responseFormatPrompt = `
Please analyze how well this candidate matches the job requirements based on the scoring guide.
Return your analysis as a JSON object with the following structure:
{
  "degree": { 
    "score": <number 0-100>, 
    "comment": "<explanation of the degree match>"
  },
  "experience": { 
    "score": <number 0-100>, 
    "comment": "<explanation of the experience match>"
  },
  "technical_skill": { 
    "score": <number 0-100>, 
    "comment": "<explanation of the technical skills match>"
  },
  "responsibility": { 
    "score": <number 0-100>, 
    "comment": "<explanation of the responsibilities match>"
  },
  "certificate": { 
    "score": <number 0-100>, 
    "comment": "<explanation of the certificate match>"
  },
  "soft_skill": { 
    "score": <number 0-100>, 
    "comment": "<explanation of the soft skills match>"
  },
  "summary_comment": "<overall evaluation of the candidate's match>"
}

Do not include a total score field, as this will be calculated separately.
`;

  // Combine the candidate matching prompt, the job and candidate details, and the response format prompt
  const fullPrompt = `
${candidateMatchingPrompt}

${jobDetailsText}

${candidateDetailsText}

${responseFormatPrompt}
`;

  // Log the prompt for debugging (masked for privacy if needed, but here we need full detail)
  console.log("--- START OF GEMINI MATCHING PROMPT ---");
  console.log(fullPrompt);
  console.log("--- END OF GEMINI MATCHING PROMPT ---");

  // Check if AI analysis is enabled via environment variables
  if (!isGeminiConfigured()) {

    // Return a basic matching result when AI is not available
    return {
      score: 50,
      summary_comment: "AI analysis not available. This is a default matching score.",
      degree: { score: 50, comment: "AI analysis not available." },
      experience: { score: 50, comment: "AI analysis not available." },
      technical_skill: { score: 50, comment: "AI analysis not available." },
      responsibility: { score: 50, comment: "AI analysis not available." },
      certificate: { score: 50, comment: "AI analysis not available." },
      soft_skill: { score: 50, comment: "AI analysis not available." }
    };
  }

  // Call the AI API using axios
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
    console.error("--- GEMINI API ERROR IN MATCHING ---");
    console.error("Status:", apiError.response?.status);
    console.error("Message:", apiError.message);
    if (apiError.response?.data) {
      console.error("Error Data:", JSON.stringify(apiError.response.data, null, 2));
    }
    console.error("-------------------------------------");
    throw new Error("AI matching analysis failed. Please try again later.");
  }

  // Process the AI response using our utility function
  let aiData;
  try {
    aiData = processAiResponse(aiResponse, "job matching");
  } catch (parseError) {
    console.error("Error processing AI response:", parseError.message);
    throw parseError;
  }

  // Calculate the average score across all categories
  const scores = [
    aiData.degree?.score || 0,
    aiData.experience?.score || 0,
    aiData.technical_skill?.score || 0,
    aiData.responsibility?.score || 0,
    aiData.certificate?.score || 0,
    aiData.soft_skill?.score || 0
  ];

  const averageScore = Math.round(
    scores.reduce((sum, score) => sum + score, 0) / scores.length
  );

  // Return the final result with calculated overall score
  return {
    ...aiData,
    score: averageScore
  };
};

export default analyse_matching;