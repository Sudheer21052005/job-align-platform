// controllers/resume.controller.js
import ResumeModel from '../models/ResumeModel.js';
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/datauri.js';
import { processResume } from '../Services/resumeParserService.js';
import path from 'path';
import fs from 'fs';

/**
 * Controller: uploadResume
 * - Uses memory storage to handle the file
 * - Uploads the resume to Cloudinary.
 * - Uses resumeParserService to extract structured data (including AI analysis) from the resume.
 * - Creates a Resume document in MongoDB with all relevant details.
 */
export const uploadResume = async (req, res) => {
  const userId = req.user.id;
  
  if (!req.file) {
    return res.status(400).json({ msg: 'Resume file is required' });
  }
  
  try {
    // For memory storage use buffer directly
    let fileUri;
    let resumePath;
    
    if (req.file.buffer) {
      // Using memory storage
      fileUri = getDataUri(req.file);
      // Save temp file for processing if needed
      const tempDir = path.join(process.cwd(), 'uploads', 'resumes');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      resumePath = path.join(tempDir, `${Date.now()}-${req.file.originalname}`);
      fs.writeFileSync(resumePath, req.file.buffer);
    } else if (req.file.path) {
      // Using disk storage
      fileUri = getDataUri(req.file);
      resumePath = req.file.path;
    } else {
      return res.status(400).json({ msg: 'Invalid file format' });
    }
    
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const resumeUrl = cloudResponse.secure_url;
    
    // Pass the correct file object to processResume
    const modifiedFile = {
      ...req.file,
      path: resumePath // Ensure path is available for processing
    };
    
    const extractedData = await processResume(modifiedFile);
    
    // Use ResumeModel.create instead of createResume
    const newResume = await ResumeModel.create({
      user: userId,
      filePath: resumeUrl,
      content: extractedData.content,
      name: extractedData.name,
      phoneNumber: extractedData.phoneNumber || "",
      email: extractedData.email || "",
      aiComment: extractedData.aiComment || "",
      education: extractedData.education || [],
      experience: extractedData.experience || [],
      technicalSkills: extractedData.technicalSkills || [],
      responsibilities: extractedData.responsibilities || [],
      certifications: extractedData.certifications || [],
      softSkills: extractedData.softSkills || [],
      jobRecommendations: extractedData.jobRecommendations || [],
      resumeRankScore: extractedData.resumeRankScore,
      summary: extractedData.summary || "",
      analysisTimestamp: new Date(),
      analysisVersion: "1.0",
    });
    
    // Clean up temp file if we created one
    if (req.file.buffer && fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
    }
    
    res.status(201).json({ msg: 'Resume uploaded successfully', resume: newResume });
  } catch (err) {
    console.error('Error uploading resume:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

export const getResumes = async (req, res) => {
  const { userId } = req.params;
  try {
    // Find resumes for the given user and only return the needed fields.
    const resumes = await ResumeModel.find({ user: userId }).select(
      "filePath name phoneNumber email aiComment education experience technicalSkills responsibilities certifications softSkills jobRecommendations resumeRankScore summary analysisTimestamp createdAt updatedAt"
    );
    
    if (!resumes || resumes.length === 0) {
      return res.status(404).json({ msg: 'No resumes found for this user' });
    }
    // Return the resumes; filePath holds the Cloudinary URL.
    res.status(200).json({ resumes });
  } catch (err) {
    console.error('Error fetching resumes:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};