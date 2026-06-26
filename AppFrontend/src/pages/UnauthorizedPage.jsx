// src/pages/UnauthorizedPage.jsx

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || "You are not authorized to view this page.";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Typography variant="h4" color="error">
        Access Denied
      </Typography>
      <Typography variant="body1">{message}</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </Box>
  );
};

export default UnauthorizedPage;
