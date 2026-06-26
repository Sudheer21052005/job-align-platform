// controllers/jobApplication.Controller.js

import { createJobApplication, getApplicationsByUser, updateApplicationStatus, deleteJobApplication } from '../models/JobApplication.js';
import { getJobById } from '../models/JobModel.js';
import Job from '../models/JobModel.js';  // For fetching recruiter's jobs
import JobApplication from '../models/JobApplication.js'; // For direct queries

/**
 * applyForJob
 * --------------
 * Handles a job application submission.
 * Frontend: Called when a job seeker submits an application form that includes:
 *  - A cover letter
 *  - A resume file that has already been uploaded via the resume upload route,
 *    returning a processed resume ID (resumeId)
 * 
 * Steps:
 *  - Extracts jobId, coverLetter, and resumeId from req.body.
 *  - Uses req.user.id from the authentication token for the candidate's ID.
 *  - Verifies that the job exists.
 *  - Creates a new job application record linking the job, candidate, and the processed resume (via resumeId).
 */
export const applyForJob = async (req, res) => {
  const { jobId, coverLetter, resumeId } = req.body;  // Now expecting resumeId from resume upload
  const userId = req.user.id;  // Authenticated user's ID

  try {
    // Verify the job exists
    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Validate that resumeId is provided
    if (!resumeId) {
      return res.status(400).json({ message: 'Resume ID is required' });
    }
    
    // Create the job application record with the processed resume reference.
    const newApplication = await createJobApplication({
      jobId,
      userId,
      resumeId,  // Reference to the Resume document from the resume upload process
      coverLetter: coverLetter || '',
      status: 'applied',   // Default status
      recruiterNotes: ''   // Default empty notes
    });
    
    res.status(201).json({ msg: 'Job application created successfully', application: newApplication });
  } catch (err) {
    console.error('Error applying for job:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

/**
 * getJobApplicationsByUser
 * --------------
 * Retrieves all job applications submitted by a specific user.
 * Frontend: Used in the job seeker's dashboard ("My Applications").
 * Expects userId in req.params.
 */
export const getJobApplicationsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const applications = await getApplicationsByUser(userId);
    if (applications.length === 0) {
      return res.status(404).json({ msg: 'No applications found for this user' });
    }
    res.status(200).json({ applications });
  } catch (err) {
    console.error('Error fetching job applications by user:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

/**
 * updateJobApplicationStatus
 * --------------
 * Updates the status and recruiter notes of an application.
 * Frontend: Called by recruiters when reviewing an application.
 * Expects applicationId in req.params and new status & recruiterNotes in req.body.
 */
export const updateJobApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status, recruiterNotes } = req.body;
  try {
    const updatedApplication = await updateApplicationStatus(applicationId, status, recruiterNotes);
    res.status(200).json({ msg: 'Job application status updated successfully', application: updatedApplication });
  } catch (err) {
    console.error('Error updating job application status:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

/**
 * deleteApplication
 * --------------
 * Deletes a job application.
 * Frontend: Called when a job seeker withdraws an application or an admin removes it.
 * Expects applicationId in req.params.
 */
export const deleteApplication = async (req, res) => {
  const { applicationId } = req.params;
  try {
    const result = await deleteJobApplication(applicationId);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error deleting job application:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

/**
 * getAllApplicantsForRecruiter
 * --------------
 * Retrieves all job applications for all jobs posted by the authenticated recruiter.
 * Frontend: Allows recruiters to view every application across their job postings.
 * No parameters are needed; the recruiter’s ID is taken from the authentication token.
 */
export const getAllApplicantsForRecruiter = async (req, res) => {
  try {
    const recruiterId = req.user.id; // Recruiter's ID from the token

    // Fetch all jobs posted by this recruiter (only need their IDs)
    const recruiterJobs = await Job.find({ recruiter: recruiterId }, '_id');
    const jobIds = recruiterJobs.map(job => job._id);

    // Find all applications where the job field is in the list of job IDs
    const applications = await JobApplication.find({ job: { $in: jobIds } })
      .populate('job')
      .populate('user', 'fullName phoneNumber profilePicture')
      .populate('resume') // Populate resume details
      .sort({ applicationDate: -1 });

    res.status(200).json({ applications });
  } catch (err) {
    console.error("Error fetching all applicants for recruiter:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


export default {
  applyForJob,
  getJobApplicationsByUser,
  updateJobApplicationStatus,
  deleteApplication,
  getAllApplicantsForRecruiter
};
