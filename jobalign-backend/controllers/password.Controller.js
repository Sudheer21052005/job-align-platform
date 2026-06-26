// controllers/password.Controller.js

import User from '../models/User.js';
import sendEmail from '../services/emailService.js';
import bcrypt from 'bcryptjs';

/**
 * forgotPassword
 * - Expects: { email } in req.body.
 * - Action: Sets a reset token in the user record, builds a reset link,
 *   and sends an email with that link.
 * - Frontend: Called from the "Forgot Password" page.
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Generate reset token and update user record
    const { resetToken } = await User.setResetToken(email);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send reset email to user
    await sendEmail(email, "Password Reset Request", `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `);

    res.json({ message: "Password reset link sent to your email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * resetPassword
 * - Expects: { token, newPassword } in req.body.
 * - Action: Uses the provided token to reset the user's password.
 * - Frontend: Called from the "Reset Password" page after a user clicks the reset link.
 */
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    await User.resetPassword(token, newPassword);
    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * changePassword
 * - Expects: { currentPassword, newPassword } in req.body.
 * - Action: Verifies the current password, validates the new password,
 *   hashes it, and updates the user's record.
 * - Frontend: Called from the "Change Password" page in the user profile/dashboard.
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // Obtained from auth middleware
  try {
    // Fetch user from MongoDB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare current password with stored hash
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    // Validate new password (minimum 8 characters and at least one special character)
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: "New password must be at least 8 characters long and contain at least one special character." });
    }

    // Hash and update the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
