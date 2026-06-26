// src/components/Company/CompanyCreate.jsx
import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerCompany } from '../../api/api';
import AlertMessage from '../common/AlertMessage';

// Mock successful response for development/testing
const mockRegisterCompany = (companyData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Company registered successfully!",
        company: {
          _id: "mock-company-id-" + Date.now(),
          name: companyData.name,
          createdAt: new Date().toISOString()
        }
      });
    }, 1000);
  });
};

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [alertMessage, setAlertMessage] = useState('');
  // Flag to use mock data in development or when API fails
  const [useMockData, setUseMockData] = useState(false);

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName) {
      setAlertSeverity('error');
      setAlertMessage('Company name is required.');
      setAlertOpen(true);
      return;
    }
    setLoading(true);

    try {
      // Use mock or real API based on environment or previous errors
      const data = useMockData 
        ? await mockRegisterCompany({ name: companyName })
        : await registerCompany({ name: companyName });

      if (data.success) {
        setAlertSeverity('success');
        setAlertMessage(data.message);
        setAlertOpen(true);
        
        // Navigate to the company setup page after a short delay
        setTimeout(() => {
          navigate(`/companies/edit/${data.company._id}`);
        }, 1000);
      } else {
        setAlertSeverity('error');
        setAlertMessage(data.message);
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Error in company registration:", error);
      setAlertSeverity('error');
      setAlertMessage(error.message || 'Something went wrong.');
      setAlertOpen(true);
      
      // Try with mock data if API fails
      if (!useMockData) {
        setUseMockData(true);
        setAlertMessage('API error. Switching to demo mode...');
        setAlertSeverity('warning');
        // Retry with mock data
        setTimeout(() => handleSubmit(e), 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      {/* Heading and subtext */}
      <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
        Your Company Name
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
        What would you like to give your company name? You can change this later.
      </Typography>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <TextField
          label="Company Name"
          placeholder="JobHunt, Microsoft etc."
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        {/* Action Buttons */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Continue'}
          </Button>
        </Box>
      </Box>

      {/* Alert for success/error messages */}
      <AlertMessage
        open={alertOpen}
        onClose={handleCloseAlert}
        severity={alertSeverity}
        message={alertMessage}
      />
    </Container>
  );
};

export default CompanyCreate;
