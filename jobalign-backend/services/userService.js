// services/userService.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

/**
 * registerNewUser
 * -----------------------------
 * Registers a new user and returns the user ID.
 * Frontend: Called on the registration page when a new user signs up.
 */
export const registerNewUser = async ({ fullName, email, password, phoneNumber, role = 'jobSeeker', profilePicture = "" }) => {
  try {
    // Call the static method directly on the User model
    const userId = await User.createUser({ fullName, email, password, phoneNumber, role, profilePicture });
    return userId;
  } catch (err) {
    throw new Error('Error creating user: ' + err.message);
  }
};

/**
 * findUserByEmail
 * -----------------------------
 * Fetches user information based on email.
 * Frontend: Used during login to verify the user's existence.
 */
export const findUserByEmail = async (email) => {
  try {
    // Use the model's static method to fetch user by email
    return await User.getUserByEmail(email);
  } catch (err) {
    throw new Error('Error fetching user by email: ' + err.message);
  }
};

/**
 * findUserById
 * -----------------------------
 * Retrieves user information based on user ID.
 * Frontend: Typically used on the profile page to display user details.
 */
export const findUserById = async (userId) => {
  try {
    // Use the model's static method to fetch user by ID
    return await User.getUserById(userId);
  } catch (err) {
    throw new Error('Error fetching user by ID: ' + err.message);
  }
};

/**
 * validatePassword
 * -----------------------------
 * Compares the entered password with the stored hashed password.
 * Frontend: Called during login to authenticate user credentials.
 */
export const validatePassword = async (enteredPassword, storedPassword) => {
  try {
    return await bcrypt.compare(enteredPassword, storedPassword);
  } catch (err) {
    throw new Error('Error validating password: ' + err.message);
  }
};

/**
 * updateUserDetails
 * -----------------------------
 * Updates the user's profile information.
 * Frontend: Called when a user updates their profile details on the profile edit page.
 */
export const updateUserDetails = async (userId, updatedData) => {
  try {
    return await User.updateUser(userId, updatedData);
  } catch (err) {
    throw new Error('Error updating user: ' + err.message);
  }
};

/**
 * deleteUserAccount
 * -----------------------------
 * Deletes a user's account from the system.
 * Frontend: Can be used in account settings when a user chooses to delete their account.
 */
export const deleteUserAccount = async (userId) => {
  try {
    return await User.deleteUser(userId);
  } catch (err) {
    throw new Error('Error deleting user: ' + err.message);
  }
};
