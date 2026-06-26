// pages/Auth/ResetPasswordPage.jsx
import React, { useState } from "react";
import { useSearchParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Link,
} from "@mui/material";
import { resetPassword } from "../../api/api";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    try {
      const response = await resetPassword(token, password);
      setMessage(response.data?.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          textAlign: "center",
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Reset Your Password
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Enter a new password below.
        </Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading || password !== confirmPassword || password.length < 6}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
        <Box mt={2}>
          <Link component={RouterLink} to="/login">
            Back to Login
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;
