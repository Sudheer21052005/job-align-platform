// controllers/applicationMatching.controller.js

import ApplicationMatching from '../models/ApplicationMatchingModel.js';
import JobApplication from '../models/JobApplication.js';
import { getJobById } from '../models/JobModel.js';
import Job from '../models/JobModel.js';  // For fetching job details
import { analyse_matching } from '../services/jobMatching-AnalysisService.js';

/**
 * analyzeApplicationMatching
 * -----------------------------
 * Triggers the matching analysis for a specific job application.
 *
 * Steps:
 *  - Retrieves the job application by its ID and populates the associated job, user, and resume.
 *  - Constructs a matching input object using the job data and candidate details.
 *    (If available, the candidate details come from the processed resume; otherwise, from the user record.)
 *  - Calls the matching analysis service (which uses AI) to evaluate the match.
 *  - Saves the matching result in the ApplicationMatching model with fields such as overallScore,
 *    detailedScores (for degree, experience, technical_skill, responsibility, certificate, soft_skill),
 *    summaryComment, and analysisTimestamp.
 *  - Optionally updates the JobApplication record with a reference to the matching analysis.
 *  - Returns the analysis result to the frontend.
 *
 * Expects: applicationId in req.params.
 */
export const analyzeApplicationMatching = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({ 
        success: false,
        message: 'Application ID is required' 
      });
    }

    // Retrieve the job application and populate the job, user, and resume details.
    const application = await JobApplication.findById(applicationId)
      .populate('job')
      .populate('user')
      .populate('resume');
    
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job application not found' 
      });
    }
    
    // Check for required job and candidate data
    if (!application.job) {
      return res.status(400).json({
        success: false,
        message: 'Job data is missing for this application'
      });
    }

    if (!application.user && !application.resume) {
      return res.status(400).json({
        success: false,
        message: 'Candidate data is missing for this application'
      });
    }
    
    // Construct candidate data from resume if available, otherwise fall back to user data.
    const candidateData = application.resume 
      ? application.resume.toObject() 
      : application.user.toObject();
    // Use the job data as is.
    const jobData = application.job.toObject();

    // Prepare the matching input data.
    const matchingData = {
      job: jobData,
      candidate: candidateData
    };


    // Call the matching analysis service, which returns detailed scores and comments.
    let analysisResult;
    try {
      analysisResult = await analyse_matching(matchingData);
    } catch (analysisError) {
      console.error("Error during matching analysis:", analysisError);
      return res.status(500).json({
        success: false,
        message: "Matching analysis failed",
        error: analysisError.message
      });
    }


    // Save the matching analysis result in the ApplicationMatching model.
    let newMatching;
    try {
      newMatching = await ApplicationMatching.create({
        jobApplication: application._id,
        job: application.job._id,
        candidate: application.user._id,
        overallScore: analysisResult.score, // Overall score from the matching service.
        detailedScores: {
          degree: analysisResult.degree,
          experience: analysisResult.experience,
          technical_skill: analysisResult.technical_skill,
          responsibility: analysisResult.responsibility,
          certificate: analysisResult.certificate,
          soft_skill: analysisResult.soft_skill
        },
        summaryComment: analysisResult.summary_comment,
        analysisTimestamp: new Date()
      });

      // Optionally, update the job application with the matching analysis reference.
      application.applicationMatch = newMatching._id;
      await application.save();
    } catch (dbError) {
      console.error("Error saving matching results to database:", dbError);
      // Even if saving to DB failed, we can still return the analysis results
      return res.status(207).json({
        success: true,
        message: "Analysis completed but failed to save results",
        analysis: analysisResult,
        error: dbError.message
      });
    }

    res.status(200).json({
      success: true,
      message: "Matching analysis completed successfully",
      analysis: analysisResult,
      matchingId: newMatching._id
    });
  } catch (err) {
    console.error("Unexpected error performing matching analysis:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: err.message 
    });
  }
};

/**
 * fetchApplicationMatchDetails
 * -----------------------------
 * Retrieves AI-generated job match details for a specific job application.
 *
 * Steps:
 *  - Finds the matching analysis using the job application ID.
 *  - Populates references (job, applicant) for better frontend readability.
 *  - Returns the complete analysis results.
 *
 * Expects: applicationId in req.params.
 */
export const fetchApplicationMatchDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    if (!applicationId) {
      return res.status(400).json({ 
        success: false,
        message: 'Application ID is required' 
      });
    }

    // Fetch the matching analysis for the given job application
    const matchDetails = await ApplicationMatching.findOne({ jobApplication: applicationId })
      .populate("job")
      .populate("candidate");

    if (!matchDetails) {
      return res.status(404).json({ 
        success: false,
        message: "Matching analysis not found for this application." 
      });
    }

    res.status(200).json({ 
      success: true,
      matchDetails 
    });
  } catch (err) {
    console.error("Error fetching matching details:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: err.message 
    });
  }
};

export default {
  analyzeApplicationMatching,
  fetchApplicationMatchDetails,
};
