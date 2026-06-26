// src/pages/CompanyPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '../hooks/useGetAllCompanies';
import CompaniesTable from '../components/Company/CompaniesTable';
import AlertMessage from '../components/common/AlertMessage';

// Mock data for testing when API fails
const mockCompanies = [
  { 
    id: "1", 
    value: "1", 
    label: "Tech Solutions Inc.", 
    name: "Tech Solutions Inc.",
    location: "New York, NY",
    website: "https://techsolutions.example.com"
  },
  { 
    id: "2", 
    value: "2", 
    label: "Global Innovations", 
    name: "Global Innovations",
    location: "San Francisco, CA",
    website: "https://globalinnovations.example.com"
  }
];

const CompanyPage = () => {
  const navigate = useNavigate();
  const { companies = [], loading, error } = useGetAllCompanies();
  const [searchText, setSearchText] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  // Log the companies data when it updates
  useEffect(() => {
  }, [companies]);

  // Open alert if an error occurs
  useEffect(() => {
    if (error) {
      setAlertOpen(true);
      setUseMockData(true); // Use mock data if there's an API error
    }
  }, [error]);

  // Get the final list of companies to display
  const displayCompanies = useMockData ? mockCompanies : companies;

  // Filter companies based on search text with defensive checks
  const filteredCompanies = displayCompanies.filter((company) =>
    company.label && company.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Company Dashboard
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <TextField
            label="Search Companies"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ width: 300 }}
          />
          <Button variant="contained" onClick={() => navigate('/companies/create')}>
            New Company
          </Button>
        </Box>

        {useMockData && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Using demo data - actual company data could not be loaded.
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <AlertMessage
            open={alertOpen}
            onClose={() => setAlertOpen(false)}
            severity="error"
            message={error}
          />
        ) : filteredCompanies.length > 0 ? (
          <CompaniesTable companies={filteredCompanies} />
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
            No companies found.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default CompanyPage;
