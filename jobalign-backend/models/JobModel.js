// models/JobModel.js

import mongoose from 'mongoose';
import User from './User.js'; // Ensure User model exists

// Define the Job schema with enhancements and new fields for closed status, views, and AI analysis results
// Updated Job Schema
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  location: { type: String, required: true },
  skills: { type: [String], required: true },
  positions: { type: Number, required: true },
  jobType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
    required: true,
  },
  salaryLPA: { type: Number, required: true },
  experience: { type: String, required: true },
  responsibilities: { type: [String], required: true },
  softSkills: { type: [String], required: true },

  // AI analysis fields (updated names)
  degree: { type: [String], default: [] },
  technicalSkills: { type: [String], default: [] },
  certificates: { type: [String], default: [] },

  // Other fields
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datePosted: { type: Date, default: Date.now },
  lastUpdated: { type: Date },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expiryDate: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  isClosed: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


// Virtual property to get the number of applications for this job
jobSchema.virtual('applicationCount').get(function () {
  return this.applicants.length;
});

// Add Indexes for Improved Performance
jobSchema.index({ location: 1 });
jobSchema.index({ salaryLPA: 1 });
jobSchema.index({ datePosted: -1 });

// Create the Job model and export it as JobModel
const JobModel = mongoose.model('Jobs', jobSchema);

// ------------------------------
// Helper: Validate that the recruiter exists and has the "recruiter" role
// ------------------------------
const isValidRecruiter = async (recruiterId) => {
  const recruiter = await User.findById(recruiterId);
  if (!recruiter || recruiter.role !== 'recruiter') {
    throw new Error('Invalid recruiter or role mismatch');
  }
  return true;
};

// ------------------------------
// Create Job
// FRONTEND: Call this when a recruiter posts a new job.
// ------------------------------
// Updated createJob function in JobModel.js
export const createJob = async ({
  title, description, company, location, skills, positions,
  jobType, salaryLPA, recruiter, expiryDate, 
  experience, responsibilities, softSkills,
  degree, technicalSkills, certificates
}) => {
  // Check all required fields (note: degree, technicalSkills, certificates can be optional)
  if (!title || !description || !company || !location || !skills || !positions ||
      !jobType || !salaryLPA || !recruiter || !experience || !responsibilities || !softSkills) {
    throw new Error('All fields are required');
  }
  await isValidRecruiter(recruiter);
  const job = await JobModel.create({ 
    title, description, company, location, skills, positions, jobType, salaryLPA, recruiter, expiryDate,
    experience, responsibilities, softSkills,
    degree,
    technicalSkills,
    certificates
  });
  return job;
};




// ------------------------------
// Get Jobs by Recruiter
// FRONTEND: Display jobs posted by the recruiter on their dashboard.
// ------------------------------
export const getJobsByRecruiter = async (recruiterId, limit = 10, offset = 0) => {
  const totalJobs = await JobModel.countDocuments({ recruiter: recruiterId });
  const jobs = await JobModel.find({ recruiter: recruiterId })
                        .populate('company', 'name logo location')
                        .sort({ datePosted: -1 })
                        .skip(parseInt(offset, 10))
                        .limit(parseInt(limit, 10));
  return { jobs, totalJobs };
};

// ------------------------------
// Get Job by ID
// FRONTEND: Display detailed job information on the job detail page.
// ------------------------------
export const getJobById = async (jobId) => {
  const job = await JobModel.findById(jobId)
                      .populate('company', 'name logo location');
  if (!job) throw new Error('Job not found');
  return job;
};

// ------------------------------
// Update Job
// FRONTEND: Allow recruiters to edit job details on an edit job page.
// ------------------------------
export const updateJob = async (jobId, updatedData) => {
  // Allow updates to new fields as well
  const allowedUpdates = ["title", "description", "company", "location", "skills", "positions", "jobType", "salaryLPA", "expiryDate", "isClosed", "experience", "responsibilities", "softSkills"];
  const validUpdates = {};
  for (let key in updatedData) {
    if (allowedUpdates.includes(key)) {
      validUpdates[key] = updatedData[key];
    }
  }
  validUpdates.lastUpdated = Date.now();
  const job = await JobModel.findByIdAndUpdate(jobId, validUpdates, { new: true })
                      .populate('company', 'name logo location');
  if (!job) throw new Error('Job not found');
  return job;
};

// ------------------------------
// Delete Job
// FRONTEND: Allow recruiters to remove a job posting.
// ------------------------------
export const deleteJob = async (jobId) => {
  const job = await JobModel.findByIdAndDelete(jobId);
  if (!job) throw new Error('Job not found');
  return { id: jobId, message: 'Job deleted successfully' };
};

// ------------------------------
// Save Job, Unsave Job, and Add Applicant functions remain unchanged
// ------------------------------
export const saveJob = async (jobId, userId) => {
  const job = await JobModel.findById(jobId);
  if (!job) throw new Error('Job not found');
  if (!job.savedBy.includes(userId)) {
    job.savedBy.push(userId);
    await job.save();
  }
  return job;
};

export const unsaveJob = async (jobId, userId) => {
  const job = await JobModel.findById(jobId);
  if (!job) throw new Error('Job not found');
  job.savedBy = job.savedBy.filter(id => id.toString() !== userId.toString());
  await job.save();
  return job;
};

export const addApplicant = async (jobId, userId) => {
  const job = await JobModel.findById(jobId);
  if (!job) throw new Error('Job not found');
  if (!job.applicants.includes(userId)) {
    job.applicants.push(userId);
    await job.save();
  }
  return job;
};

export default JobModel;
