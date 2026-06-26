// services/matchingAnalysis.js

/**
 * Prompt for evaluating candidate match.
 * This prompt instructs the AI to evaluate a candidate's match against specific job requirements.
 * It defines a detailed scoring system for each category:
 * - Degree: Evaluate major relevance over degree level.
 * - Experience: Assess the relevance of the candidate's work history.
 * - Technical Skills: Rate based on how well the candidate's skills align with the job.
 * - Responsibility: Score according to the similarity of past job responsibilities.
 * - Certificate: Award points for required and related certifications.
 * - Soft Skill: Prioritize skills like foreign language proficiency and leadership.
 * All comments must refer to the candidate using singular pronouns (e.g., "he", "she", "the candidate").
 */
export const candidateMatchingPrompt = `
Scoring Guide:
It's ok to say candidate does not match the requirement.
Degree Section: Prioritize major than degree level. Candidate with degrees more directly relevant to the required degree should receive higher score, even if their degree level is lower.
Experience Section: Candidate with more relevant experience field get higher score.
Technical Skills Section: Candidate with more relevant technical skills get higher score.
Responsibilities Section: Candidate with more relevant responsibilities get higher score.
Certificates Section: Candidate with required certificates get higher score. Candidate without required certificates get no score. Candidate with related certificates to the position get medium score.
Soft Skills Section: Prioritize foreign language and leadership skills. Candidate with more relevant soft skills get higher score.
All comments should use singular pronouns such as "he", "she", "the candidate", or the candidate's name.
`;

/**
 * Schema for the candidate matching evaluation.
 * The AI should return a JSON object with the following structure:
 *
 * {
 *   "degree": { "score": <number 0-100>, "comment": "<explanation>" },
 *   "experience": { "score": <number 0-100>, "comment": "<explanation>" },
 *   "technical_skill": { "score": <number 0-100>, "comment": "<explanation>" },
 *   "responsibility": { "score": <number 0-100>, "comment": "<explanation>" },
 *   "certificate": { "score": <number 0-100>, "comment": "<explanation>" },
 *   "soft_skill": { "score": <number 0-100>, "comment": "<explanation>" },
 *   "summary_comment": "<overall evaluation comment>"
 * }
 */
export const candidateEvaluationSchema = {
  "degree": {
    "score": 0, // Score from 0 to 100
    "comment": "String explaining the degree evaluation"
  },
  "experience": {
    "score": 0,
    "comment": "String explaining the experience evaluation"
  },
  "technical_skill": {
    "score": 0,
    "comment": "String explaining the technical skills evaluation"
  },
  "responsibility": {
    "score": 0,
    "comment": "String explaining the responsibility evaluation"
  },
  "certificate": {
    "score": 0,
    "comment": "String explaining the certificate evaluation"
  },
  "soft_skill": {
    "score": 0,
    "comment": "String explaining the soft skills evaluation"
  },
  "summary_comment": "Overall comment summarizing the candidate's match."
};
