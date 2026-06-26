// src/pages/TermsPage.jsx

import React from "react";
import { Container, Typography, Paper } from "@mui/material";

const TermsPage = () => {
  return (
    <Container>
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Terms and Conditions
        </Typography>

        <Typography variant="body1" paragraph>
          Welcome to JobAlign! These terms and conditions outline the rules and regulations
          for the use of our website and services. By accessing our platform, you agree to
          comply with and be bound by these terms. If you do not agree with any part of these
          terms, you may not use our services.
        </Typography>

        <Typography variant="h6">1. Use of the Platform</Typography>
        <Typography variant="body1" paragraph>
          You must be at least 18 years old to use JobAlign. You agree to provide accurate
          and complete information when creating an account and using our services.
        </Typography>

        <Typography variant="h6">2. Job Postings and Applications</Typography>
        <Typography variant="body1" paragraph>
          Recruiters must ensure job listings are accurate and comply with all applicable
          laws. Job seekers must submit truthful applications and resumes.
        </Typography>

        <Typography variant="h6">3. Privacy Policy</Typography>
        <Typography variant="body1" paragraph>
          Your use of JobAlign is also governed by our Privacy Policy, which explains how we
          collect, use, and protect your personal data.
        </Typography>

        <Typography variant="h6">4. Termination</Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to suspend or terminate accounts that violate these terms
          without prior notice.
        </Typography>

        <Typography variant="h6">5. Changes to Terms</Typography>
        <Typography variant="body1" paragraph>
          We may update these terms at any time. Continued use of our services after changes
          constitutes acceptance of the new terms.
        </Typography>

        <Typography variant="body1" paragraph>
          If you have any questions regarding these Terms and Conditions, please contact us.
        </Typography>
      </Paper>
    </Container>
  );
};

export default TermsPage;
