// components/JobSeekers/ResumeUpload.jsx

import React, { useState } from 'react';
import { uploadResume } from '../../api/api'; 
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';

const ResumeUpload = () => {
  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('resume', resume);

    const response = await uploadResume(formData); // Backend API call

    if (response.success) {
      setSuccessMessage('Resume uploaded successfully!');
      setSnackbarOpen(true);
      setResume(null);
    } else {
      setError('Failed to upload resume. Please try again.');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Upload Your Resume
      </Typography>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} required style={{ marginBottom: '16px' }} />
        <Button type="submit" variant="contained" color="primary">
          Upload
        </Button>
      </form>

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Resume uploaded successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResumeUpload;
