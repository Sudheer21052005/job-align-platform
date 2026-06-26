// controllers/company.Controller.js
import Company from "../models/CompanyModel.js";
import getDataUri from "../utils/datauri.js"; // Converts file buffer to Data URI
import cloudinary from "../utils/cloudinary.js"; // Cloudinary configuration

/**
 * registerCompany
 * -----------------------------
 * Registers a new company.
 * Expects: 'name' (required) and optionally description, website, location in req.body.
 * Uses: req.user.id for the owner.
 * Frontend: Called from the company registration form.
 */
export const registerCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Company name is required.", success: false });
    }
    let company = await Company.findOne({ name });
    if (company) {
      return res.status(400).json({ message: "Company already exists.", success: false });
    }

    // Process logo file if provided
    let logo;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url;
    }
    
    // Create company with logo (if available) and owner info.
    company = await Company.create({
      name,
      description,
      website,
      location,
      logo, // undefined if no file provided
      userId: req.user.id,
    });
    
    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Error registering company:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};


/**
 * getCompany
 * -----------------------------
 * Retrieves companies associated with the logged-in user.
 * Frontend: Used on the company dashboard/profile page.
 */
export const getCompany = async (req, res) => {
  try {
    // Assume req.user.id holds the logged-in user's ID.
    const companies = await Company.find({ userId: req.user.id });
    if (!companies || companies.length === 0) {
      return res
        .status(404)
        .json({ message: "Companies not found.", success: false });
    }
    return res.status(200).json({ companies, success: true });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

/**
 * getCompanyById
 * -----------------------------
 * Retrieves a single company by its ID.
 * Frontend: Used on a detailed company profile page.
 */
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found.", success: false });
    }
    return res.status(200).json({ company, success: true });
  } catch (error) {
    console.error("Error fetching company by ID:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

/**
 * updateCompany
 * -----------------------------
 * Updates company details and optionally the company logo.
 * Expects: Fields like name, description, website, location in req.body.
 * If a file is provided (req.file), it converts the file to a Data URI and uploads it to Cloudinary.
 * The returned secure_url is saved as the logo.
 * Frontend: Called from the company profile edit form.
 */
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const updateData = { name, description, website, location };
    // Check if a logo file is provided via multer (available as req.file)
    const file = req.file;
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      updateData.logo = cloudResponse.secure_url;

    }
    // Update company details with new data.
    const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!company) {
      return res.status(404).json({ message: "Company not found.", success: false });
    }
    return res.status(200).json({ message: "Company information updated.", company, success: true });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};
