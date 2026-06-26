// pages/Auth/ChangePasswordPage.jsx
import React, { useState } from "react";
import { changePassword } from "../../api/api";
import { TextField, Button, Typography, Box, Snackbar, Alert } from "@mui/material";

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (password.length < minLength) {
      return "Password must be at least 8 characters.";
    }
    if (!specialCharRegex.test(password)) {
      return "Password must contain at least one special character.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match!");
      return;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setMessage(response.message || "Password changed successfully!");
      setOpenSnackbar(true);
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Change Password
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Current Password"
          type="password"
          name="currentPassword"
          fullWidth
          margin="normal"
          required
          value={formData.currentPassword}
          onChange={handleChange}
        />
        <TextField
          label="New Password"
          type="password"
          name="newPassword"
          fullWidth
          margin="normal"
          required
          value={formData.newPassword}
          onChange={handleChange}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          fullWidth
          margin="normal"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Updating..." : "Change Password"}
        </Button>
      </form>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChangePasswordPage;
