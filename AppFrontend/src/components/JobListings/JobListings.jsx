import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Pagination,
} from "@mui/material";
import JobFilters from "./JobFilters";
import JobList from "./JobList";
import { fetchJobs } from "../../api/api";

const JobListings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    minSalary: "",
    maxSalary: "",
    query: "",
    jobType: "",
  });

  // Pagination
  const [page, setPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const data = await fetchJobs();
        if (data && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
          setFilteredJobs(data.jobs);
        } else if (Array.isArray(data)) {
          setJobs(data);
          setFilteredJobs(data);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (err) {
        console.error("Failed to fetch job listings:", err);
        setError(err.message || "Failed to load job listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Apply filters whenever filters state changes
  useEffect(() => {
    const applyFilters = () => {
      let result = [...jobs];

      // Filter by location
      if (filters.location && filters.location !== "All") {
        result = result.filter(
          (job) =>
            job.location &&
            job.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      // Filter by salary range
      if (filters.minSalary !== "") {
        result = result.filter(
          (job) => job.salaryLPA && job.salaryLPA >= parseFloat(filters.minSalary)
        );
      }

      if (filters.maxSalary !== "") {
        result = result.filter(
          (job) => job.salaryLPA && job.salaryLPA <= parseFloat(filters.maxSalary)
        );
      }

      // Filter by job type
      if (filters.jobType && filters.jobType !== "All") {
        result = result.filter(
          job => job.jobType && job.jobType.toLowerCase() === filters.jobType.toLowerCase()
        );
      }

      // Filter by search query (title, company name)
      if (filters.query) {
        const query = filters.query.toLowerCase();
        result = result.filter(
          (job) =>
            (job.title && job.title.toLowerCase().includes(query)) ||
            (job.company?.name && job.company.name.toLowerCase().includes(query))
        );
      }

      setFilteredJobs(result);
      setPage(1); // Reset to first page when filters change
    };

    applyFilters();
  }, [filters, jobs]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice(
    (page - 1) * jobsPerPage,
    page * jobsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: { xs: 2, md: 3 },
          fontWeight: theme.typography.fontWeightBold,
          textAlign: "center",
        }}
      >
        Find Your Perfect Job
      </Typography>

      <Grid container spacing={3}>
        {/* Filters Section */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            order: { xs: 2, md: 1 },
            ...(isMobile && { mt: 2 }),
          }}
        >
          <JobFilters onFilterChange={handleFilterChange} filters={filters} />
        </Grid>

        {/* Job Listings Section */}
        <Grid item xs={12} md={9} sx={{ order: { xs: 1, md: 2 } }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "50vh",
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : filteredJobs.length === 0 ? (
            <Box
              sx={{
                bgcolor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius,
                p: 4,
                textAlign: "center",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No jobs match your criteria
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your filters or search for something different
              </Typography>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" component="h2">
                  Showing {currentJobs.length} of {filteredJobs.length} jobs
                </Typography>
              </Box>

              <JobList jobs={currentJobs} />

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    size={isMobile ? "small" : "medium"}
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default JobListings; 