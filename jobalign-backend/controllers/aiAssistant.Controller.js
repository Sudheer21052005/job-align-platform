import axios from 'axios';
import User from '../models/User.js';
import Resume from '../models/ResumeModel.js';
import Job from '../models/JobModel.js';


// Access the Gemini API key from environment variables
const GEMINI_API_KEY = "AIzaSyDZV63mTqeq1ngqxBqHJbW5bHi-l_HPaa4";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent";

// Base system prompt for the AI assistant
const getBaseSystemPrompt = () => {
  return `You are JobAssistant AI, a helpful career advisor for job seekers. 
Your goal is to provide accurate, helpful, and encouraging advice about job hunting, resume writing, 
interview preparation, and career development.

When giving advice:
- Be concise but thorough
- Provide specific, actionable recommendations
- Be encouraging and supportive
- Base your advice on best practices in the industry
- Format your responses in a way that's easy to read and scan
- Use bullet points and lists when appropriate
- If you don't know something, be honest and don't make up information

Your tone should be professional but approachable, like a friendly career coach or mentor.`;
};

// Helper function to enrich the prompt with user data
const enrichPromptWithUserData = (prompt, userContext) => {
  if (!userContext || Object.keys(userContext).length === 0) {
    return prompt;
  }

  let enrichedPrompt = `User Context:\n`;

  if (userContext.username) {
    enrichedPrompt += `Name: ${userContext.username}\n`;
  }

  if (userContext.skills && userContext.skills.length > 0) {
    enrichedPrompt += `Skills: ${userContext.skills.join(', ')}\n`;
  }

  if (userContext.experience && userContext.experience.length > 0) {
    enrichedPrompt += `Experience: ${userContext.experience.map(exp =>
      `${exp.title} at ${exp.company} (${exp.duration || 'Duration not specified'})`
    ).join(', ')}\n`;
  }

  if (userContext.education && userContext.education.length > 0) {
    enrichedPrompt += `Education: ${userContext.education.map(edu =>
      `${edu.degree} from ${edu.institution} (${edu.year || 'Year not specified'})`
    ).join(', ')}\n`;
  }

  if (userContext.jobPreferences) {
    const prefs = userContext.jobPreferences;
    enrichedPrompt += `Job Preferences: `;

    const prefDetails = [];
    if (prefs.jobType) prefDetails.push(`Job Type: ${prefs.jobType}`);
    if (prefs.location) prefDetails.push(`Location: ${prefs.location}`);
    if (prefs.salary) prefDetails.push(`Desired Salary: ${prefs.salary}`);
    if (prefs.industry) prefDetails.push(`Industry: ${prefs.industry}`);

    enrichedPrompt += prefDetails.join(', ') + '\n';
  }

  enrichedPrompt += `\nUser Query: ${prompt}\n\nProvide helpful career advice based on this information:`;

  return enrichedPrompt;
};

// Helper function to call the Gemini API
const callGeminiAPI = async (prompt) => {
  try {
    // Prepare the request body for Gemini
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            { text: getBaseSystemPrompt() + "\n\n" + prompt }
          ]
        }
      ],
      generation_config: {
        temperature: 0.7,
        max_output_tokens: 1024,
        top_p: 0.95
      }
    };


    // Make the API call to Gemini
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody
    );


    // Extract the generated text from the response
    if (response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts[0]) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      console.warn('Unexpected response structure from Gemini API:', JSON.stringify(response.data, null, 2));
      throw new Error('Unexpected response structure from Gemini API');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
    }

    // Provide a fallback response based on the prompt

    const promptLower = prompt.toLowerCase();

    // Web development skills fallback
    if (promptLower.includes('web development') && promptLower.includes('skills')) {
      return `For web development, I recommend learning these key skills:

1. **Frontend Fundamentals**:
   - HTML5, CSS3, and JavaScript
   - Responsive design principles
   - CSS frameworks like Bootstrap or Tailwind CSS

2. **JavaScript Frameworks/Libraries**:
   - React.js for building user interfaces
   - Vue.js or Angular for larger applications
   - State management with Redux or Context API

3. **Backend Technologies**:
   - Node.js with Express
   - Python with Django or Flask
   - Database skills (SQL and NoSQL options)

4. **Version Control and Deployment**:
   - Git for version control
   - CI/CD pipelines
   - Cloud platforms (AWS, Azure, or Google Cloud)

5. **Additional Skills**:
   - API development and integration
   - Testing (unit tests, integration tests)
   - Performance optimization

Start with HTML, CSS, and JavaScript, then gradually expand your knowledge based on your interests and career goals.`;
    }

    // Resume improvement fallback
    if (promptLower.includes('resume') && (promptLower.includes('improve') || promptLower.includes('help'))) {
      return `Here are key tips to improve your resume:

1. **Tailor for each job application**:
   - Match keywords from the job description
   - Highlight relevant skills and experiences

2. **Structure and formatting**:
   - Use a clean, professional template
   - Include clear section headings
   - Keep to 1-2 pages maximum
   - Use bullet points for readability

3. **Content recommendations**:
   - Start bullets with strong action verbs
   - Include quantifiable achievements
   - Focus on results, not just responsibilities
   - Include relevant technical skills

4. **Essential sections**:
   - Contact information
   - Professional summary/objective
   - Work experience
   - Education
   - Skills
   - Projects (if relevant)

5. **Proofreading**:
   - Check for grammar and spelling errors
   - Have someone else review it
   - Ensure consistent formatting

Remember to highlight transferable skills if you're changing careers.`;
    }

    // Interview tips fallback
    if (promptLower.includes('interview') && promptLower.includes('tips')) {
      return `Here are essential interview tips:

1. **Before the interview**:
   - Research the company thoroughly
   - Practice common questions
   - Prepare your own questions
   - Plan your outfit and route

2. **During the interview**:
   - Arrive 10-15 minutes early
   - Maintain good eye contact and posture
   - Use the STAR method for behavioral questions
   - Listen actively and ask clarifying questions
   - Show enthusiasm for the role

3. **Technical interviews**:
   - Think out loud to show your problem-solving process
   - Ask clarifying questions before solving problems
   - Test your solutions with examples
   - Be open to hints and feedback

4. **Questions to ask interviewers**:
   - "What does success look like in this role?"
   - "How would you describe the company culture?"
   - "What are the biggest challenges for this position?"

5. **Follow-up**:
   - Send a thank-you email within 24 hours
   - Reference specific discussion points
   - Express continued interest

Remember to be authentic and show your personality during the interview.`;
    }

    // Default fallback response
    return `I'm sorry, but I'm currently experiencing some technical difficulties. Here's some general career advice:

1. **Continuous learning** is crucial in today's job market. Consider online courses, certifications, or workshops in your field.

2. **Networking** remains one of the most effective ways to find new opportunities. Connect with professionals in your industry on LinkedIn and attend industry events.

3. **Personal branding** helps you stand out. Develop a consistent professional presence online and articulate your unique value proposition.

4. **Work-life balance** is essential for long-term career success. Set boundaries and prioritize your wellbeing.

5. **Seek mentorship** from experienced professionals who can provide guidance and help you navigate career challenges.

Please try your question again later when the system is fully operational.`;
  }
};

// Export the controller functions
export const getJobAssistanceResponse = async (req, res) => {
  try {

    const { prompt, userContext } = req.body;
    const userId = req.user?.id;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required',
      });
    }

    // Get enhanced user context if not provided
    let enhancedUserContext = userContext || {};

    if (!userContext || Object.keys(userContext).length === 0) {
      try {
        const user = userId ? await User.findById(userId) : null;
        if (user) {
          enhancedUserContext = {
            username: user.name,
            email: user.email,
            // Add any other relevant user data from your schema
          };

          // Try to get resume data if available
          try {
            const resume = await Resume.findOne({ user: userId });
            if (resume) {
              enhancedUserContext.skills = resume.skills || [];
              enhancedUserContext.experience = resume.experience || [];
              enhancedUserContext.education = resume.education || [];
            } else {
            }
          } catch (resumeErr) {
            console.error('Error fetching resume:', resumeErr);
          }
        } else {
        }
      } catch (userErr) {
        console.error('Error retrieving user data:', userErr);
        // Continue without user data if there's an error
      }
    }

    // Enrich the prompt with user context
    const enrichedPrompt = enrichPromptWithUserData(prompt, enhancedUserContext);

    // Call Gemini API with the enriched prompt

    const answer = await callGeminiAPI(enrichedPrompt);

    // Save the interaction to user history if needed
    // You could create a model for this if you want to track conversations

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error('Error in job assistant:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error getting AI response',
      error: error.message,
    });
  }
};

export const getResumeReview = async (req, res) => {
  try {
    const { resumeText } = req.body;
    const userId = req.user.id;

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is required',
      });
    }

    const prompt = `Please review the following resume and provide specific, actionable feedback to improve it. Focus on:
    
1. Overall structure and formatting
2. Content and clarity
3. Action verbs and impactful descriptions
4. Skills presentation
5. Areas for improvement

Resume to review:
${resumeText}

Provide a detailed review with specific suggestions for improvement:`;

    // Call Gemini API with the resume review prompt
    const answer = await callGeminiAPI(prompt);

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error('Error in resume review:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting resume review',
      error: error.message,
    });
  }
};

export const getInterviewTips = async (req, res) => {
  try {
    const { jobTitle, company, jobDescription } = req.body;
    const userId = req.user.id;

    if (!jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Job title is required',
      });
    }

    let prompt = `Provide interview preparation tips for a ${jobTitle} position`;

    if (company) {
      prompt += ` at ${company}`;
    }

    prompt += `. Include:
    
1. Common interview questions for this role
2. Technical topics to prepare for
3. How to answer behavioral questions
4. Questions to ask the interviewer
5. Tips for standing out from other candidates`;

    if (jobDescription) {
      prompt += `\n\nHere is the job description for more targeted advice:\n${jobDescription}`;
    }

    // Get user context if available
    try {
      const user = await User.findById(userId);
      const resume = await Resume.findOne({ user: userId });

      if (user && resume) {
        prompt += `\n\nUser background:
        - Skills: ${resume.skills ? resume.skills.join(', ') : 'Not specified'}
        - Experience: ${resume.experience ? resume.experience.length : 0} roles listed
        - Education: ${resume.education ? resume.education.map(e => e.degree || 'Degree').join(', ') : 'Not specified'}
        
        Provide tailored interview preparation guidance based on this background:`;
      }
    } catch (err) {
    }

    // Call Gemini API
    const answer = await callGeminiAPI(prompt);

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error('Error getting interview tips:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting interview tips',
      error: error.message,
    });
  }
};

export const getJobMatchAnalysis = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required',
      });
    }

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Get user's resume
    const resume = await Resume.findOne({ user: userId });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found for user',
      });
    }

    // Create prompt for job match analysis
    const prompt = `Analyze how well the candidate's profile matches the job requirements:

Job Title: ${job.title}
Company: ${job.companyName || 'Not specified'}
Job Description: ${job.description || 'Not provided'}
Required Skills: ${job.skills ? job.skills.join(', ') : 'Not specified'}
Job Location: ${job.location || 'Not specified'}
Job Type: ${job.jobType || 'Not specified'}

Candidate Resume:
- Skills: ${resume.skills ? resume.skills.join(', ') : 'Not provided'}
- Experience: ${resume.experience ? resume.experience.map(exp => `${exp.title} at ${exp.company}`).join('; ') : 'Not provided'}
- Education: ${resume.education ? resume.education.map(edu => `${edu.degree} from ${edu.institution}`).join('; ') : 'Not provided'}

Provide a detailed analysis of:
1. Overall match percentage
2. Strengths that align with the job
3. Skills gaps or missing qualifications
4. Suggestions to improve candidacy
5. Tips for highlighting relevant experience in application`;

    // Call Gemini API
    const answer = await callGeminiAPI(prompt);

    return res.status(200).json({
      success: true,
      answer,
      jobTitle: job.title,
      companyName: job.companyName
    });
  } catch (error) {
    console.error('Error in job match analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing job match',
      error: error.message,
    });
  }
}; 