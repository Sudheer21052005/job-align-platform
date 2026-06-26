// src/pages/NotFoundPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <ErrorOutlineIcon style={{ fontSize: 80, color: "#f44336" }} />
        <Typography variant="h4" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Oops! The page you are looking for does not exist.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/")}> 
          Go Back Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
