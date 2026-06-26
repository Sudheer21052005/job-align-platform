// src/components/Company/CompanySetup.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { updateCompany } from '../../api/api';
import useGetCompanyById from '../../hooks/useGetCompanyById';
import AlertMessage from '../common/AlertMessage';

// Mock data for when the API fails or for development
const mockCompanyData = {
  _id: "mock-company-1",
  name: "Tech Solutions Inc.",
  description: "A leading tech company specializing in enterprise software solutions.",
  website: "https://techsolutions.example.com",
  location: "New York, NY",
  logo: "https://via.placeholder.com/150"
};

// Mock successful update response
const mockUpdateCompany = (id, formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedCompany = {
        ...mockCompanyData,
        name: formData.get('name') || mockCompanyData.name,
        description: formData.get('description') || mockCompanyData.description,
        website: formData.get('website') || mockCompanyData.website,
        location: formData.get('location') || mockCompanyData.location,
      };
      
      resolve({
        success: true,
        message: "Company updated successfully!",
        company: updatedCompany
      });
    }, 1000);
  });
};

const CompanySetup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { company, loading: fetchLoading, error } = useGetCompanyById(id);

  // Form state for text inputs
  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
  });
  // State for logo file upload
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  // Alert state for feedback
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [alertMessage, setAlertMessage] = useState('');
  // Use mock data if API fails
  const [useMockData, setUseMockData] = useState(false);

  // Update form when company data is fetched from API
  useEffect(() => {
    if (error) {
      console.error("Error fetching company:", error);
      setAlertSeverity('warning');
      setAlertMessage('Using demo data as company details could not be loaded.');
      setAlertOpen(true);
      setUseMockData(true);
      // Set form with mock data
      setForm({
        name: mockCompanyData.name,
        description: mockCompanyData.description,
        website: mockCompanyData.website,
        location: mockCompanyData.location,
      });
    }
    else if (company) {
      setForm({
        name: company.name || '',
        description: company.description || '',
        website: company.website || '',
        location: company.location || '',
      });
    }
  }, [company, error]);

  // Handle text input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file input changes with validations
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      if (!allowedTypes.includes(file.type)) {
        setAlertSeverity('error');
        setAlertMessage('Invalid file type. Only JPG, PNG, or GIF files are allowed.');
        setAlertOpen(true);
        setLogoFile(null);
        return;
      }
      if (file.size > maxSize) {
        setAlertSeverity('error');
        setAlertMessage('File size exceeds the 5MB limit.');
        setAlertOpen(true);
        setLogoFile(null);
        return;
      }
      // File is valid
      setLogoFile(file);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  // Submit updated company data along with the logo file (if provided)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('website', form.website);
    formData.append('location', form.location);
    if (logoFile) {
      formData.append('logo', logoFile);
    }
    setLoading(true);
    try {
      // Use mock or real API based on flags
      const data = useMockData 
        ? await mockUpdateCompany(id, formData)
        : await updateCompany(id, formData);


      if (data.success) {
        setAlertSeverity('success');
        setAlertMessage(data.message);
        setAlertOpen(true);
        // Log the Cloudinary URL for debugging (logo stored as a string in the DB)
        // Navigate to the companies dashboard after a short delay
        setTimeout(() => {
          navigate('/companies');
        }, 1000);
      } else {
        setAlertSeverity('error');
        setAlertMessage(data.message);
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Error updating company:", error);
      setAlertSeverity('error');
      setAlertMessage(error.message || 'Update failed.');
      setAlertOpen(true);
      
      // Try with mock data if real API fails
      if (!useMockData) {
        setUseMockData(true);
        setAlertMessage('API error. Switching to demo mode...');
        setAlertSeverity('warning');
        setAlertOpen(true);
        // Retry with mock data after a short delay
        setTimeout(() => handleSubmit(e), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading && !useMockData) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !useMockData) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => setUseMockData(true)}
          sx={{ mr: 2 }}
        >
          Use Demo Data
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/companies')}
        >
          Back to Companies
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      {useMockData && (
        <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
          You are viewing demo data. Changes won't be saved to the database.
        </Alert>
      )}
      
      <Box
        sx={{
          mt: 4,
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button onClick={() => navigate('/companies')} startIcon={<ArrowBack />}>
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ ml: 2 }}>
            Company Setup
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Company Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            label="Website"
            name="website"
            value={form.website}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Upload Logo
            </Typography>
            <Button variant="contained" component="label">
              Choose File
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {logoFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {logoFile.name}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button variant="outlined" onClick={() => navigate('/companies')} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Update'}
            </Button>
          </Box>
        </form>
      </Box>
      <AlertMessage
        open={alertOpen}
        onClose={handleCloseAlert}
        severity={alertSeverity}
        message={alertMessage}
      />
    </Container>
  );
};

export default CompanySetup;
