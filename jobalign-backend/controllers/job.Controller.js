
// controller/job.Controller.js
import { 
  createJob, 
  getJobsByRecruiter, 
  getJobById, 
  updateJob, 
  deleteJob, 
  saveJob, 
  unsaveJob, 
  addApplicant 
} from '../models/JobModel.js';
import JobApplication from '../models/JobApplication.js';
// Assume we have an AI analysis service for job analysis
import { analyzeJob } from '../services/jobAnalysisService.js';

/**
 * createJobListing
 * -----------------------------
 * Registers a new job posting.
 * Expects the following fields in req.body:
 * - title, description, company, location, skills,
 *   positions, jobType, salaryLPA, recruiter, and optional expiryDate,
 *   experience, responsibilities, softSkills.
 * Frontend: Called from the recruiter’s job posting form.
 */
export const createJobListing = async (req, res) => {
  const { 
    title, description, company, location, skills,
    positions, jobType, salaryLPA, expiryDate,
    experience, responsibilities, softSkills
  } = req.body;

  // Validate that all required recruiter-provided fields (except recruiter) are present
  if (!title || !description || !company || !location || !skills || !positions ||
      !jobType || !salaryLPA || !experience || !responsibilities || !softSkills) {
    return res.status(400).json({ msg: "All required fields are needed" });
  }

  try {
    // Use req.user.id for the recruiter field
    const aiAnalysis = await analyzeJob({ 
      title, 
      description, 
      experience, 
      responsibilities, 
      soft_skill: softSkills, 
      skills 
    });

    const finalDegree = aiAnalysis.degree && aiAnalysis.degree.length ? aiAnalysis.degree : [];
    const finalCertificates = aiAnalysis.certificate && aiAnalysis.certificate.length ? aiAnalysis.certificate : [];
    const finalTechnicalSkills = skills && skills.length ? skills : (aiAnalysis.skills || []);

    // Create the job with the merged data.
    const newJob = await createJob({ 
      title, 
      description, 
      company, 
      location, 
      skills: finalTechnicalSkills, 
      positions, 
      jobType, 
      salaryLPA,
      recruiter: req.user.id,  // Use authenticated recruiter's id
      expiryDate,
      experience, 
      responsibilities, 
      softSkills,
      degree: finalDegree,
      technicalSkills: finalTechnicalSkills,
      certificates: finalCertificates
    });
    res.status(201).json({ msg: "Job created successfully", job: newJob });
  } catch (err) {
    console.error("Job creation error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * getJobsByRecruiterId
 * -----------------------------
 * Retrieves jobs posted by a specific recruiter with pagination.
 * Expects recruiterId in req.params, page and limit in req.query.
 * Frontend: Used on the recruiter dashboard to list job postings.
 */
export const getJobsByRecruiterId = async (req, res) => {
  try {
    // Use req.user.id since the recruiter is authenticated
    const recruiterId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const result = await getJobsByRecruiter(recruiterId, limit, offset);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};



/**
 * getJob
 * -----------------------------
 * Retrieves detailed information for a specific job posting.
 * Expects job ID in req.params.
 * Frontend: Used on the job detail page.
 */
export const getJob = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await getJobById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ job });
  } catch (err) {
    console.error("Error fetching job by ID:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


/**
 * getAllJobs
 * -----------------------------
 * Retrieves all job postings sorted by datePosted in descending order.
 * Frontend: Used on the public job listings page for job seekers.
 */
export const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, location, salary } = req.query;
    const query = {};
    if (location) query.location = location;
    if (salary) {
      const [min, max] = salary.split('-').map(Number);
      query.salaryLPA = { $gte: min, $lte: max };
    }
    const skip = (page - 1) * limit;
    const jobs = await (await import('../models/JobModel.js')).default
      .find(query)
      .sort({ datePosted: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found" });
    }
    res.status(200).json({ jobs });
  } catch (err) {
    console.error('Error fetching all jobs:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

/**
 * updateJobListing
 * -----------------------------
 * Updates an existing job posting.
 * Expects jobId in req.params and updated data in req.body.
 * Frontend: Called from the job editing form on the recruiter dashboard.
 */

// controllers/job.Controller.js

export const updateJobListing = async (req, res) => {
  // Safely extract jobId from req.params
  const jobId = req.params ? req.params.jobId : undefined;
  if (!jobId) return res.status(400).json({ msg: "Job ID is required" });
  
  try {
    const updatedJob = await updateJob(jobId, req.body);
    res.status(200).json({ msg: 'Job updated successfully', job: updatedJob });
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * deleteJobListing
 * -----------------------------
 * Deletes a job posting.
 * Expects jobId in req.params.
 * Frontend: Used on the recruiter dashboard to remove a job posting.
 */
export const deleteJobListing = async (req, res) => {
  const { jobId } = req.params;
  if (!jobId) return res.status(400).json({ msg: "Job ID is required" });
  
  try {
    const result = await deleteJob(jobId);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * markJobClosed
 * -----------------------------
 * Marks a job as closed, preventing further applications.
 * Expects jobId in req.params.
 * Frontend: Used on the recruiter dashboard when a job should no longer accept applications.
 */
export const markJobClosed = async (req, res) => {
  const { jobId } = req.params;
  if (!jobId) return res.status(400).json({ msg: "Job ID is required" });
  
  try {
    // Update job to set 'isClosed' to true.
    const updatedJob = await updateJob(jobId, { isClosed: true });
    res.status(200).json({ msg: 'Job marked as closed', job: updatedJob });
  } catch (err) {
    console.error("Error marking job as closed:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * getJobAnalytics
 * -----------------------------
 * Retrieves analytics for a specific job, including total applications,
 * number of views, and a breakdown of application statuses.
 * Expects jobId in req.params.
 * Frontend: Used on the recruiter dashboard to assess job performance.
 */
export const getJobAnalytics = async (req, res) => {
  const { jobId } = req.params;
  if (!jobId) return res.status(400).json({ msg: "Job ID is required" });
  
  try {
    // Fetch applications for this job from JobApplication model
    const applications = await JobApplication.find({ job: jobId });
    const totalApplications = applications.length;
    
    // Calculate status breakdown (e.g., applied, under review, accepted, rejected)
    const statusMetrics = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
    
    // Retrieve job details for additional metrics (e.g., views)
    const job = await getJobById(jobId);
    const views = job.views || 0;
    
    res.status(200).json({
      jobId,
      totalApplications,
      views,
      statusMetrics,
    });
  } catch (err) {
    console.error("Error fetching job analytics:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * saveJob
 * -----------------------------
 * Adds a user's ID to the job's savedBy array when they save a job.
 * Expects jobId and userId.
 * Frontend: Used when a job seeker clicks "Save Job" on a job listing.
 */
export const saveJobEntry = async (jobId, userId) => {
  try {
    const job = await saveJob(jobId, userId);
    return job;
  } catch (err) {
    console.error("Error saving job:", err);
    throw new Error(err.message);
  }
};

/**
 * unsaveJob
 * -----------------------------
 * Removes a user's ID from the job's savedBy array when they unsave a job.
 * Expects jobId and userId.
 * Frontend: Used when a job seeker removes a saved job.
 */
export const unsaveJobEntry = async (jobId, userId) => {
  try {
    const job = await unsaveJob(jobId, userId);
    return job;
  } catch (err) {
    console.error("Error unsaving job:", err);
    throw new Error(err.message);
  }
};

/**
 * addApplicant
 * -----------------------------
 * Adds a user's ID to the job's applicants array when they apply.
 * Expects jobId and userId.
 * Frontend: Called when a job seeker applies to a job.
 */
export const addApplicantEntry = async (jobId, userId) => {
  try {
    const job = await addApplicant(jobId, userId);
    return job;
  } catch (err) {
    console.error("Error adding applicant:", err);
    throw new Error(err.message);
  }
};

export default {
  createJobListing,
  getJobsByRecruiterId,
  getJob,
  getAllJobs,
  updateJobListing,
  deleteJobListing,
  markJobClosed,
  getJobAnalytics,
  saveJobEntry,
  unsaveJobEntry,
  addApplicantEntry,
};
