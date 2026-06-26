/**
 * Prompt for analyzing the job description.
 * This prompt instructs the AI to extract key details from the job description.
 * If certain fields (like degree or certificate) are not provided by the recruiter,
 * the AI should generate suggested values based solely on the provided job details.
 */
export const jobAnalysisPrompt = `
Analyze the following job description. Use only the information provided, and if specific details such as educational qualifications or required certificates are missing from the input, generate appropriate recommendations based on the job requirements.
Extract and structure the following information:
- Degree: Educational qualifications required. If not provided, suggest what is typically needed (e.g., Bachelor's in Computer Science).
- Experience: Required work experience, including duration and relevant job field (combine with the job title if applicable).
- Skills: Specific technical skills and proficiencies (e.g., Java, Python, Linux, SQL).
- Responsibility: Key responsibilities for the role.
- Certificate: Required certifications. If not provided, generate recommendations based on the job description.
- Soft Skill: Inferred soft skills from the job details (e.g., communication, teamwork, adaptability).
`;

/**
 * Prompt for formatting the AI response for job analysis.
 * This prompt instructs the AI to return the information in a clear, structured JSON format.
 * It ensures that even if the recruiter does not supply some fields, the AI generates
 * recommended values based on the job description.
 */
export const jobResponsePrompt = `
Please format your response as a JSON object with the following keys:
{
  "degree": ["string", ...],
  "experience": ["string", ...],
  "skills": ["string", ...],
  "responsibility": ["string", ...],
  "certificate": ["string", ...],
  "soft_skill": ["string", ...]
}
Ensure that if any field was not provided by the recruiter, you generate recommended suggestions based on the job description.
`;
