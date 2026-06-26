// src/pages/ApplyJobPage.jsx

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Divider, 
  useTheme, 
  alpha, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import JobDetails from '../components/JobListings/JobDetails';
import ApplyJobForm from '../components/JobSeekers/ApplyJobForm';
import JobApplicationslist from '../components/JobSeekers/JobApplicationslist';
import { fetchJobDetails } from '../api/api';
import { useAuth } from '../auth/AuthContext';

const ApplyJobPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplications, setShowApplications] = useState(false);

  // Fetch job details
  useEffect(() => {
    const loadJobDetails = async () => {
      if (!id) {
        setError('No job ID provided');
        setLoading(false);
        return;
      }
      
      try {
        const jobData = await fetchJobDetails(id);
        if (!jobData) {
          throw new Error('Job not found');
        }
        setJob(jobData);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(err.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    
    loadJobDetails();
  }, [id]);

  // Check if user is logged in and is a job seeker
  useEffect(() => {
    if (!loading && userRole && userRole !== 'jobSeeker') {
      setError('Only job seekers can apply for jobs');
    }
  }, [loading, userRole]);

  const handleToggleApplications = () => {
    setShowApplications((prev) => !prev);
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: theme.shape.borderRadius,
            bgcolor: alpha(theme.palette.error.light, 0.1),
            borderLeft: `4px solid ${theme.palette.error.main}`,
          }}
        >
          <Typography variant="h6" color="error.main" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1" paragraph>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  // Not logged in state
  if (!currentUser) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: theme.shape.borderRadius,
            bgcolor: alpha(theme.palette.primary.light, 0.1),
            borderLeft: `4px solid ${theme.palette.primary.main}`,
          }}
        >
          <Typography variant="h6" color="primary.main" gutterBottom>
            Login Required
          </Typography>
          <Typography variant="body1" paragraph>
            You need to log in as a job seeker to apply for this job.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/login', { state: { from: `/apply/${id}` } })}
          >
            Log In
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {job && (
        <>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ fontWeight: theme.typography.fontWeightBold }}
            >
              Apply for {job.title}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              Complete the application form below to apply for this position. Make sure to provide all required information for the best chance of success.
            </Typography>
          </Paper>
          
          {/* Job Details Section */}
          <Box sx={{ mb: 4 }}>
            <JobDetails job={job} hideApplyButton={true} />
          </Box>

          <Divider sx={{ my: 4 }} />
          
          {/* Job Application Form */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <ApplyJobForm jobId={job._id} jobTitle={job.title} />
          </Paper>

          {/* Button to Toggle Application List */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              onClick={handleToggleApplications}
              sx={{
                borderRadius: '50px',
                px: 3,
                py: 1,
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                },
              }}
            >
              {showApplications ? 'Hide My Applications' : 'View My Applications'}
            </Button>
          </Box>

          {/* Conditionally render the Application List */}
          {showApplications && (
            <Box sx={{ mt: 4 }}>
              <JobApplicationslist />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ApplyJobPage;
