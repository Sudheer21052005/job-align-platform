// models/ApplicationMatchingModel.js

import mongoose from 'mongoose';

const applicationMatchingSchema = new mongoose.Schema({
  // Reference to the job application for which the matching analysis was done
  jobApplication: { type: mongoose.Schema.Types.ObjectId, ref: 'JobApplication', required: true },
  // Reference to the job posting details
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs', required: true },
  // Reference to the candidate (user) who applied
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Overall matching score (e.g., 0-100)
  overallScore: { type: Number, required: true },
  // Detailed scores for each section, with each section having a score and a comment
  detailedScores: {
    degree: {
      score: { type: Number, required: true },
      comment: { type: String, required: true }
    },
    experience: {
      score: { type: Number, required: true },
      comment: { type: String, required: true }
    },
    technical_skill: {
      score: { type: Number, required: true },
      comment: { type: String, required: true }
    },
    responsibility: {
      score: { type: Number, required: true },
      comment: { type: String, required: true }
    },
    certificate: {
      score: { type: Number, required: true },
      comment: { type: String, required: true }
    },
    soft_skill: {
      score: { type: Number, required: true },
      comment: { type: String, required: true }
    }
  },
  // A summary comment about the overall match
  summaryComment: { type: String, required: true },
  // Timestamp indicating when the analysis was performed
  analysisTimestamp: { type: Date, default: Date.now }
});

const ApplicationMatching = mongoose.model('ApplicationMatching', applicationMatchingSchema);

export default ApplicationMatching;
