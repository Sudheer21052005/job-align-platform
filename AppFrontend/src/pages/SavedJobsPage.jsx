import React, { useState, useEffect, Suspense } from 'react';
import { Box, Container, Typography, Breadcrumbs, Link, CircularProgress } from '@mui/material';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import SavedJobs from '../components/JobSeekers/SavedJobs';
import { useAuth } from '../auth/AuthContext';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const SavedJobsPage = () => {
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [componentLoaded, setComponentLoaded] = useState(false);

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to recruiter dashboard if user is a recruiter
  if (userRole === 'recruiter') {
    return <Navigate to="/recruiter-dashboard" replace />;
  }
  
  // Add a simple effect to ensure the component is loaded correctly
  useEffect(() => {
    
    try {
      // Test import of the SavedJobs component
      Promise.resolve(SavedJobs)
        .then(() => {
          setComponentLoaded(true);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error importing SavedJobs component:", err);
          setError(err.message || "Failed to load saved jobs component");
          setLoading(false);
        });
    } catch (err) {
      console.error("Critical error initializing SavedJobsPage:", err);
      setError(err.message || "Failed to load saved jobs page");
      setLoading(false);
    }
  }, []);

  // If there's an error loading the component
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Please try refreshing the page or contact support if the problem persists.
        </Typography>
      </Container>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 4 }}
      >
        <Link 
          component={RouterLink} 
          to="/"
          underline="hover"
          color="inherit"
        >
          Home
        </Link>
        <Link
          component={RouterLink}
          to="/dashboard"
          underline="hover"
          color="inherit"
        >
          Dashboard
        </Link>
        <Typography color="text.primary">Saved Jobs</Typography>
      </Breadcrumbs>

      {/* Main content */}
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      }>
        <SavedJobs />
      </Suspense>
    </Container>
  );
};

export default SavedJobsPage; 