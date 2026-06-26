// models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["jobSeeker", "recruiter"], default: "jobSeeker" },
  phoneNumber: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  // New optional resume field linking to Resume model
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', default: null },
  profile: {
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  resetToken: String,
  resetTokenExpires: Date,
});

userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

userSchema.methods.validatePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.statics.createUser = async function ({ fullName, email, password, role = "jobSeeker", profilePicture = "", phoneNumber = "" }) {
  if (!fullName || !email || !password) {
    throw new Error("Full name, email, and password are required");
  }
  const existingUser = await this.findOne({ email });
  if (existingUser) {
    throw new Error("Email already in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await this.create({
    fullName,
    email,
    password: hashedPassword,
    role,
    profilePicture,
    phoneNumber,
  });
  return newUser._id;
};

userSchema.statics.getUserByEmail = async function (email) {
  return await this.findOne({ email });
};

userSchema.statics.getUserById = async function (userId) {
  return await this.findById(userId)
    .select('_id fullName email role profilePicture profile phoneNumber resume createdAt');
};

userSchema.statics.updateUser = async function (userId, updatedData) {
  updatedData.updatedAt = Date.now();
  return await this.findByIdAndUpdate(userId, updatedData, { new: true });
};

userSchema.statics.deleteUser = async function (userId) {
  return await this.findByIdAndDelete(userId);
};

userSchema.statics.setResetToken = async function (email) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpires = Date.now() + 3600000; // 1 hour
  await user.save();
  return { resetToken, email };
};

userSchema.statics.resetPassword = async function (resetToken, newPassword) {
  const user = await this.findOne({ resetToken });
  if (!user) {
    throw new Error("Invalid or expired reset token.");
  }
  if (user.resetTokenExpires < Date.now()) {
    throw new Error("Reset token has expired.");
  }
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  return { message: "Password reset successful." };
};

const User = mongoose.model('User', userSchema);

export const createUser = User.createUser;
export const getUserByEmail = User.getUserByEmail;
export const getUserById = User.getUserById;
export const updateUser = User.updateUser;
export const deleteUser = User.deleteUser;
export const setResetToken = User.setResetToken;
export const resetPassword = User.resetPassword;

export default User;
