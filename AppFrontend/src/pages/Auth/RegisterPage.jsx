// pages/Auth/RegisterPage.jsx
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { registerUser } from "../../api/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "jobSeeker", // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes for the form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate the form inputs
  const validateForm = () => {
    const { fullName, email, password, confirmPassword, phoneNumber } = formData;
    if (!fullName.trim()) return "Full Name is required.";
    if (!email.trim()) return "Email is required.";
    if (password.length < 6) return "Password must be at least 6 characters long.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (phoneNumber && !/^[0-9]+$/.test(phoneNumber)) return "Phone Number must contain only digits.";
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      // Create a trimmed object with all necessary fields
      const trimmedData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        // Trim phoneNumber if provided; otherwise, it remains an empty string
        phoneNumber: formData.phoneNumber ? formData.phoneNumber.trim() : "",
        role: formData.role,
      };
      await registerUser(trimmedData);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Registration Error:", err);
      let errorMessage = "Registration failed. Please try again.";
      if (err.response && err.response.data?.msg) {
        errorMessage = err.response.data.msg;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          required
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="subtitle1">Select Role:</Typography>
        <RadioGroup name="role" value={formData.role} onChange={handleChange} row>
          <FormControlLabel value="jobSeeker" control={<Radio />} label="Job Seeker" />
          <FormControlLabel value="recruiter" control={<Radio />} label="Recruiter" />
        </RadioGroup>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Register"}
        </Button>
      </Box>
      <Box mt={2}>
        <Link component={RouterLink} to="/login">
          Already have an account? Login
        </Link>
      </Box>
    </Container>
  );
};

export default RegisterPage;
