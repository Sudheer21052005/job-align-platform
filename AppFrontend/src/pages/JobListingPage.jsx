// src/pages/JobListingsPage.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
  useTheme,
  alpha,
  Grid,
  Divider,
  Alert
} from "@mui/material";
import JobFilters from "../components/JobListings/JobFilters";
import JobCard from "../components/JobListings/JobCard";
import { fetchJobs } from "../api/api";
import { useJobFilters } from "../contexts/JobFiltersContext";

const JobListingsPage = () => {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const { filters } = useJobFilters();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const limit = 10; // Number of jobs per page

  // Fetch jobs with filters + pagination
  const loadJobs = async () => {
    setLoading(true);
    setError("");
    
    // Convert filters to the format expected by the API
    const apiFilters = {};
    if (filters.location && filters.location !== "All Locations") {
      apiFilters.location = filters.location;
    }
    if (filters.jobType && filters.jobType !== "All Types") {
      apiFilters.jobType = filters.jobType;
    }
    if (filters.salaryRange && filters.salaryRange !== "Any") {
      apiFilters.salaryRange = filters.salaryRange;
    }
    if (filters.query) {
      apiFilters.query = filters.query;
    }
    
    
    try {
      const data = await fetchJobs({ 
        page, 
        limit, 
        ...apiFilters 
      });
      
      
      if (data && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
        if (data.totalJobs !== undefined) {
          setTotalJobs(data.totalJobs);
        }
      } else if (data && Array.isArray(data)) {
        // Handle case where API returns array directly
        setJobs(data);
        setTotalJobs(data.length);
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (err) {
      console.error("Error loading jobs:", err);
      setError(err.message || "Error loading jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [page]);

  // Pagination
  const handleNextPage = () => {
    if (page * limit < totalJobs) {
      setPage(page + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleApplyFilters = () => {
    setPage(1); // Reset to first page when applying filters
    loadJobs();
  };

  return (
    <Container sx={{ py: 4 }}>
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
          sx={{ fontWeight: theme.typography.fontWeightBold, mb: 1 }}
        >
          Job Listings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find and apply for the best jobs matching your skills and experience
        </Typography>
      </Paper>

      {/* Main Layout: Left Sidebar (Filters) + Right Content (Job Cards) */}
      <Grid container spacing={3}>
        {/* Left Sidebar for Filters */}
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ fontWeight: theme.typography.fontWeightBold, mb: 2 }}
            >
              Filter Jobs
            </Typography>
            <JobFilters onApplyFilters={handleApplyFilters} />
          </Paper>
        </Grid>

        {/* Right Content: Job Cards */}
        <Grid item xs={12} md={9}>
          {/* Loading & Error States */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          )}
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: theme.shape.borderRadius,
              }}
            >
              {error}
              <Button 
                color="inherit" 
                size="small" 
                onClick={loadJobs}
                sx={{ ml: 2 }}
              >
                Retry
              </Button>
            </Alert>
          )}

          {/* Job Cards */}
          {!loading && !error && jobs.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {jobs.map((job) => (
                <JobCard 
                  key={job._id || job.id} 
                  job={job} 
                />
              ))}
            </Box>
          )}
          
          {/* No Jobs Found */}
          {!loading && !error && jobs.length === 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: alpha(theme.palette.secondary.light, 0.3)
              }}
            >
              <Typography variant="h6" gutterBottom>
                No jobs found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Try adjusting your search filters or check back later for new opportunities
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => {
                  // Reset filters through context will happen in handler
                  handleApplyFilters();
                }}
              >
                Reset Filters
              </Button>
            </Paper>
          )}

          {/* Pagination Controls */}
          {!loading && !error && jobs.length > 0 && totalJobs > limit && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 4,
                p: 2,
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={handlePreviousPage}
              >
                Previous
              </Button>
              <Typography variant="body1">
                Page {page} of {Math.ceil(totalJobs / limit)}
              </Typography>
              <Button
                variant="outlined"
                disabled={page * limit >= totalJobs}
                onClick={handleNextPage}
              >
                Next
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default JobListingsPage;
