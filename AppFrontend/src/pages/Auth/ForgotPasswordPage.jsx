// pages/Auth/ForgotPasswordPage.jsx
import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { sendPasswordResetEmail } from "../../api/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(email);
      setSuccess("A password reset link has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          textAlign: "center",
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Forgot Password?
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Enter your email below, and we’ll send you a link to reset your password.
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || !email}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </Box>
        <Box mt={2}>
          <Link component={RouterLink} to="/login">
            Back to Login
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
