
//models/ResumeModel.js

import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filePath: { type: String, required: true },
    content: { type: String, required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, default: "" }, // Extracted from resume
    email: { type: String, default: "" }, // Extracted from resume
    aiComment: { type: String, default: "" }, // AI-generated comment on resume quality
    education: { type: [String], default: [] }, // List of degrees (previously a string)
    experience: { type: [String], default: [] }, // List of past job experiences
    technicalSkills: { type: [String], default: [] }, // Extracted technical skills
    responsibilities: { type: [String], default: [] }, // Extracted job responsibilities
    certifications: { type: [String], default: [] }, // List of certifications
    softSkills: { type: [String], default: [] }, // Extracted soft skills
    jobRecommendations: { type: [String], default: [] }, // AI-suggested job recommendations
    resumeRankScore: { type: Number, default: 0 }, // AI-generated ranking score
    summary: { type: String, default: "" }, // AI-generated summary of resume
    analysisTimestamp: { type: Date }, // Timestamp when AI analysis was performed
    analysisVersion: { type: String, default: "1.0" }, // Version of AI model used
  },
  { timestamps: true }
);

const ResumeModel = mongoose.model("Resume", ResumeSchema);
export default ResumeModel;
