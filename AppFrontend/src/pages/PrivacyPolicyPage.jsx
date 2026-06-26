// src/pages/PrivacyPolicyPage.jsx

import React from "react";
import { Container, Typography, Paper } from "@mui/material";

const PrivacyPolicyPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
        </Typography>
        <Typography variant="h6" gutterBottom>
          1. Information We Collect
        </Typography>
        <Typography variant="body1" paragraph>
          We collect personal data such as name, email, and resume details when you register or apply for jobs.
        </Typography>
        <Typography variant="h6" gutterBottom>
          2. How We Use Your Information
        </Typography>
        <Typography variant="body1" paragraph>
          We use your information to process job applications, improve our services, and provide a better experience.
        </Typography>
        <Typography variant="h6" gutterBottom>
          3. Data Security
        </Typography>
        <Typography variant="body1" paragraph>
          We implement security measures to protect your data but cannot guarantee absolute security.
        </Typography>
        <Typography variant="h6" gutterBottom>
          4. Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions about this Privacy Policy, please contact us at support@jobalign.com.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicyPage;
