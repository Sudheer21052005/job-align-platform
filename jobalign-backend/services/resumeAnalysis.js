/**
 * Prompt for analyzing the candidate's resume.
 * This prompt instructs the AI to extract key details from the resume.
 */
export const candidateAnalysisPrompt = `
Analyze the resume and extract key details about the candidate. The CV may be incomplete or out of order.
Extract the following information:
- Candidate Name, Phone Number, and Email.
- Educational qualifications in the format: Degree - Institution - GPA - Year (if available).
- Work experience including job titles and duration.
- Specific technical skills (not just broad categories).
- Responsibilities from projects or previous roles.
- Certifications and soft skills.
- A brief summary comment about the candidate's strengths.
- Recommended job roles.
- Years of experience in office skills.
- Provide a ranking score (resumeRankScore) between 0 and 100 based on:
  - Quality of education and GPA.
  - Relevant work experience and duration.
  - Number and depth of technical skills.
  - Responsibilities that indicate leadership or specialization.
  - Certifications and relevant soft skills.
  - Overall completeness and clarity of the resume.
`;

/**
 * Prompt for formatting the AI response.
 * This prompt instructs the AI to return the information in a clear, structured JSON format.
 */
export const candidateResponsePrompt = `
Please format your response as a JSON object with the following keys:
{
  "candidate_name": "string",
  "phone_number": "string",
  "email": "string",
  "degree": ["string", ...],
  "experience": ["string", ...],
  "technical_skill": ["string", ...],
  "responsibility": ["string", ...],
  "certificate": ["string", ...],
  "soft_skill": ["string", ...],
  "comment": "string",
  "job_recommended": ["string", ...],
  "office": "number",
  "resumeRankScore": "number"
}
Ensure the response uses singular pronouns (e.g., 'he', 'she', 'the candidate') when referring to the candidate.
The resumeRankScore should be an integer from 0 to 100.
`
