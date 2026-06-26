// models/jobApplication.js

import mongoose from 'mongoose';
import Job from './JobModel.js';
import User from './User.js';

// Define the JobApplication schema
const jobApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Reference to the Resume model document (processed resume data)
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  coverLetter: { type: String, default: '' },
  status: {
    type: String,
    enum: ['applied', 'on process', 'accepted', 'rejected'],
    default: 'applied'
  },
  applicationDate: { type: Date, default: Date.now },
  recruiterNotes: { type: String, default: '' },
  lastUpdated: { type: Date },
  // New field: reference to the matching analysis results (ApplicationMatch model)
  applicationMatch: { type: mongoose.Schema.Types.ObjectId, ref: 'ApplicationMatch', default: null }
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

// Helper: Validate that the job and user exist
const validateJobAndUser = async (jobId, userId) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new Error('Job not found');
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return { job, user };
};

/**
 * createJobApplication
 * Creates a new job application record.
 * Note: The resumeId should already exist in the Resume model.
 */
export const createJobApplication = async ({
  jobId,
  userId,
  resumeId,  // Reference to the Resume document's _id
  coverLetter,
  status = 'applied',
  recruiterNotes = ''
}) => {
  try {
    // Validate existence of job and user
    const { job, user } = await validateJobAndUser(jobId, userId);

    const newApplication = await JobApplication.create({
      job: jobId,
      user: userId,
      resume: resumeId,
      coverLetter,
      status,
      recruiterNotes,
      applicationDate: Date.now()
    });

    return { id: newApplication._id, job, user };
  } catch (err) {
    console.error('Error creating job application:', err);
    throw new Error('Error creating job application: ' + err.message);
  }
};

/**
 * getApplicationsByUser
 * Retrieves all job applications for a given user and populates job, user, and resume details.
 */
export const getApplicationsByUser = async (userId) => {
  try {
    const applications = await JobApplication.find({ user: userId })
      .populate('job')
      .populate('user', 'fullName phoneNumber profilePicture')
      .populate('resume') // Populate resume details
      .sort({ applicationDate: -1 });
    return applications;
  } catch (err) {
    console.error('Error fetching job applications by user:', err);
    throw new Error('Error fetching job applications by user: ' + err.message);
  }
};

/**
 * updateApplicationStatus
 * Updates the status and recruiter notes of an application.
 */
export const updateApplicationStatus = async (applicationId, status, recruiterNotes) => {
  try {
    const application = await JobApplication.findById(applicationId);
    if (!application) {
      throw new Error('Job application not found');
    }
    application.status = status;
    application.recruiterNotes = recruiterNotes;
    application.lastUpdated = Date.now();
    await application.save();
    return { id: application._id, status, recruiterNotes };
  } catch (err) {
    console.error('Error updating job application status:', err);
    throw new Error('Error updating job application status: ' + err.message);
  }
};

/**
 * deleteJobApplication
 * Deletes a job application.
 */
export const deleteJobApplication = async (applicationId) => {
  try {
    const application = await JobApplication.findByIdAndDelete(applicationId);
    if (!application) {
      throw new Error('Job application not found');
    }
    return { id: applicationId, message: 'Job application deleted successfully' };
  } catch (err) {
    console.error('Error deleting job application:', err);
    throw new Error('Error deleting job application: ' + err.message);
  }
};

export default JobApplication;
