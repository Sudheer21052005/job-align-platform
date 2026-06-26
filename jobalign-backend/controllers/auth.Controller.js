// controllers/auth.Controller.js

import { generateNewToken } from '../utils/jwt.js';  // JWT generator
import { findUserByEmail, registerNewUser, validatePassword } from '../services/userService.js';  // User service functions
import User from '../models/User.js';               // Mongoose User model
import getDataUri from '../utils/datauri.js';        // Converts file buffer to Data URI
import cloudinary from '../utils/cloudinary.js';     // Cloudinary configuration

/**
 * registerUser
 * -----------------------------
 * Registers a new user.
 * Expects: fullName, email, password, phoneNumber, role, and profilePicture (optional) in req.body.
 * Generates a JWT token and returns it along with user details.
 * Frontend: Called on the registration page.
 */
export const registerUser = async (req, res) => {
  // Accept profilePicture URL if provided; otherwise default to empty string.
  const { fullName, email, password, phoneNumber, role = 'jobSeeker', profilePicture = "" } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ msg: 'Email is already in use' });
    }

    // Register the new user (profilePicture will be stored if provided)
    const userId = await registerNewUser({ fullName, email, password, phoneNumber, role, profilePicture });

    // Generate a JWT token for the new user
    const token = generateNewToken({ id: userId, email, role });

    // Respond with token and user details
    res.json({
      token,
      user: { id: userId, fullName, email, phoneNumber, role, profilePicture },
    });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

/**
 * loginUser
 * -----------------------------
 * Logs in a user by verifying credentials.
 * Expects: email and password in req.body.
 * Generates a JWT token and returns it along with user details.
 * Frontend: Called on the login page.
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve the user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Validate the provided password against the stored hash
    const isMatch = await validatePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate a JWT token for the authenticated user
    const token = generateNewToken({ id: user.id, email, role: user.role });

    // Respond with token and user details (including profilePicture)
    res.json({
      token,
      user: { 
        id: user.id, 
        fullName: user.fullName, 
        email: user.email, 
        phoneNumber: user.phoneNumber, 
        role: user.role, 
        profilePicture: user.profilePicture 
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

/**
 * logout
 * -----------------------------
 * Logs out the user by clearing the "token" cookie.
 * Frontend: Called when a user clicks "Logout".
 */
export const logout = async (req, res) => {
  try {
    // Clear the token cookie by setting maxAge to 0
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: error.message, success: false });
  }
};

/**
 * updateProfile
 * -----------------------------
 * Updates the profile of the logged-in user.
 * Expects: fullname, email, phoneNumber, bio, skills in req.body; a file (profile picture) in req.file.
 * Uses Cloudinary to upload the profile picture if provided.
 * Frontend: Called from the "Update Profile" page.
 */
export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;  // Profile picture file, if uploaded

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    // Use req.user.id instead of req.id
    const userId = req.user.id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false
      });
    }

    // Update user fields if provided
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    
    // Update additional profile info (bio, skills)
    if (bio) {
      user.profile = user.profile || {};
      user.profile.bio = bio;
    }
    if (skills) {
      user.profile = user.profile || {};
      user.profile.skills = skillsArray;
    }
    
    // Process profile picture upload using Cloudinary if a file is provided
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profilePicture = cloudResponse.secure_url;

    }

    // Save updated user details
    await user.save();

    // Return updated user details (select fields to return)
    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profilePicture: user.profilePicture,
        profile: user.profile
      },
      success: true
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: error.message, success: false });
  }
};