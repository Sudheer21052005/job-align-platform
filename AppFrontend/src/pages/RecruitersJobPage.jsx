// src/pages/RecruitersJobPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress, 
  Container,
  Paper,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import { 
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  BusinessCenter as BusinessIcon,
  LocationOn as LocationIcon, 
  Close as CloseIcon,
  WorkOutline as WorkOutlineIcon,
  People as PeopleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  CancelOutlined as CancelOutlinedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import JobsTable from "../components/Recruiters/JobsTable";
import { getRecruiterJobs, deleteJob } from "../api/api";

const RecruitersJobPage = () => {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  // Function to fetch jobs for the current recruiter
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRecruiterJobs();
      // Expect data in the form { jobs, totalJobs }
      if (data && Array.isArray(data.jobs)) {
      setJobs(data.jobs);
        setFilteredJobs(data.jobs);
      } else if (Array.isArray(data)) {
        setJobs(data);
        setFilteredJobs(data);
      } else {
        setJobs([]);
        setFilteredJobs([]);
        setError("No jobs found. Create your first job listing.");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch jobs.");
      console.error("Error fetching jobs:", err);
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh jobs when component mounts or refreshKey changes
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, refreshKey]);

  // Apply filters when filter criteria change
  useEffect(() => {
    if (!jobs.length) return;

    let result = [...jobs];

    // Apply text filter
    if (filterText) {
    const lowerFilter = filterText.toLowerCase();
      result = result.filter(
        (job) =>
      (job.companyName && job.companyName.toLowerCase().includes(lowerFilter)) ||
          (job.title && job.title.toLowerCase().includes(lowerFilter)) ||
          (job.location && job.location.toLowerCase().includes(lowerFilter))
      );
    }

    // Apply job type filter
    if (jobTypeFilter) {
      result = result.filter(
        (job) => job.jobType === jobTypeFilter
      );
    }

    // Apply status filter
    if (statusFilter) {
      if (statusFilter === "active") {
        result = result.filter(job => !job.isClosed);
      } else if (statusFilter === "closed") {
        result = result.filter(job => job.isClosed);
      }
    }

    setFilteredJobs(result);
  }, [jobs, filterText, jobTypeFilter, statusFilter]);

  // Get unique job types for filter dropdown
  const jobTypes = [...new Set(jobs.filter(job => job.jobType).map(job => job.jobType))];

  // Handler for deleting a job
  const handleDelete = async (job) => {
    if (!window.confirm(`Are you sure you want to delete "${job.title}"?`)) return;
    
    try {
      await deleteJob(job._id);
      setRefreshKey(prevKey => prevKey + 1); // Trigger a refresh of the job list
    } catch (err) {
      console.error("Error deleting job:", err);
      setError("Failed to delete job. Please try again.");
    }
  };

  // Handler for editing a job
  const handleEdit = (job) => {
    navigate(`/recruiter-dashboard/edit-job/${job._id}`);
  };

  // Handler for viewing applicants for a specific job
  const handleViewApplicants = (job) => {
    navigate(`/manage-applicants/${job._id}`);
  };

  // Handler for creating a new job posting
  const handleNewJob = () => {
    navigate("/recruiter-dashboard/new-job");
  };

  // Handler for refreshing the job list
  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Handler for clearing all filters
  const handleClearFilters = () => {
    setFilterText("");
    setJobTypeFilter("");
    setStatusFilter("");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        mb: 4
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: { xs: 2, sm: 0 }
          }}
        >
        My Jobs
      </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleNewJob}
          sx={{
            borderRadius: '4px', // Less curved edges
            textTransform: 'none',
            px: 3,
            py: 1,
            boxShadow: theme.shadows[1],
            '&:hover': {
              boxShadow: theme.shadows[2],
            }
          }}
        >
          Post New Job
        </Button>
      </Box>

      {/* Filters section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: '4px', // Less curved edges
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          mb: 2 
        }}>
          <FilterListIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight={600}>
            Filter Jobs
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
        <TextField
              fullWidth
              label="Search jobs"
          variant="outlined"
          size="small"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '4px', // Less curved edges
                }
              }}
              placeholder="Job title, company, location..."
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel>Job Type</InputLabel>
              <Select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                label="Job Type"
                sx={{ borderRadius: '4px' }} // Less curved edges
              >
                <MenuItem value="">All Types</MenuItem>
                {jobTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
                sx={{ borderRadius: '4px' }} // Less curved edges
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Clear filters">
                <IconButton 
                  onClick={handleClearFilters}
                  disabled={!filterText && !jobTypeFilter && !statusFilter}
                  size="small"
                  sx={{ 
                    color: theme.palette.grey[600],
                    border: `1px solid ${alpha(theme.palette.grey[400], 0.5)}`,
                    borderRadius: '4px', // Less curved edges
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton 
                  onClick={handleRefresh} 
                  size="small"
                  sx={{ 
                    color: theme.palette.primary.main,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    borderRadius: '4px', // Less curved edges
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats summary */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Card 
              elevation={0}
              sx={{ 
                textAlign: 'center',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '4px', // Less curved edges
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[2],
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <WorkOutlineIcon 
                    sx={{ 
                      color: theme.palette.primary.main, 
                      fontSize: 28,
                      p: 0.5,
                      borderRadius: '2px',
                      bgcolor: alpha(theme.palette.primary.main, 0.08)
                    }} 
                  />
                </Box>
                <Typography variant="h5" color="primary.main" fontWeight="bold">
                  {jobs.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Jobs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card 
              elevation={0}
              sx={{ 
                textAlign: 'center',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '4px', // Less curved edges
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[2],
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <CheckCircleOutlineIcon 
                    sx={{ 
                      color: theme.palette.success.main, 
                      fontSize: 28,
                      p: 0.5,
                      borderRadius: '2px',
                      bgcolor: alpha(theme.palette.success.main, 0.08)
                    }} 
                  />
                </Box>
                <Typography variant="h5" color="success.main" fontWeight="bold">
                  {jobs.filter(job => !job.isClosed).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Jobs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card 
              elevation={0}
              sx={{ 
                textAlign: 'center',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '4px', // Less curved edges
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[2],
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <CancelOutlinedIcon 
                    sx={{ 
                      color: theme.palette.error.main, 
                      fontSize: 28,
                      p: 0.5,
                      borderRadius: '2px',
                      bgcolor: alpha(theme.palette.error.main, 0.08)
                    }} 
                  />
                </Box>
                <Typography variant="h5" color="error.main" fontWeight="bold">
                  {jobs.filter(job => job.isClosed).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Closed Jobs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card 
              elevation={0}
              sx={{ 
                textAlign: 'center',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '4px', // Less curved edges
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[2],
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <PeopleIcon 
                    sx={{ 
                      color: theme.palette.info.main, 
                      fontSize: 28,
                      p: 0.5,
                      borderRadius: '2px',
                      bgcolor: alpha(theme.palette.info.main, 0.08)
                    }} 
                  />
                </Box>
                <Typography variant="h5" color="info.main" fontWeight="bold">
                  {jobs.reduce((total, job) => total + (job.applicants?.length || 0), 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Applicants
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Job listings */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '4px', // Less curved edges
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        }}
      >
        {/* Results summary */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.primary.main, 0.03)
        }}>
          <Typography variant="subtitle1" fontWeight={500}>
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </Typography>
          
          {(filterText || jobTypeFilter || statusFilter) && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {filterText && (
                <Chip 
                  label={`Search: ${filterText}`} 
                  size="small" 
                  onDelete={() => setFilterText('')}
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    borderRadius: '2px', // Less curved edges
                    height: '24px'
                  }}
                />
              )}
              {jobTypeFilter && (
                <Chip 
                  label={`Type: ${jobTypeFilter}`} 
                  size="small" 
                  onDelete={() => setJobTypeFilter('')}
                  sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.08),
                    borderRadius: '2px', // Less curved edges
                    height: '24px'
                  }}
                />
              )}
              {statusFilter && (
                <Chip 
                  label={`Status: ${statusFilter}`} 
                  size="small" 
                  onDelete={() => setStatusFilter('')}
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.08),
                    borderRadius: '2px', // Less curved edges
                    height: '24px'
                  }}
                />
              )}
            </Box>
          )}
        </Box>

        {/* Loading, error, empty, or job data states */}
      {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
            <CircularProgress color="primary" />
        </Box>
      ) : error ? (
          <Alert 
            severity="info" 
            sx={{ 
              m: 2,
              borderRadius: '4px' // Less curved edges 
            }}
          >
          {error}
            <Button 
              variant="text" 
              color="primary" 
              size="small" 
              onClick={handleNewJob}
              sx={{ ml: 2 }}
            >
              Create Job
            </Button>
          </Alert>
        ) : filteredJobs.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No matching jobs found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Try adjusting your search filters
        </Typography>
            <Button 
              variant="outlined"
              color="primary"
              onClick={handleClearFilters}
              sx={{ 
                mr: 1,
                borderRadius: '4px', // Less curved edges
                textTransform: 'none',
              }}
            >
              Clear Filters
            </Button>
            <Button 
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleNewJob}
              sx={{ 
                borderRadius: '4px', // Less curved edges
                textTransform: 'none',
              }}
            >
              Post New Job
            </Button>
          </Box>
      ) : (
        <JobsTable
          jobs={filteredJobs}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewApplicants={handleViewApplicants}
        />
      )}
      </Paper>
    </Container>
  );
};

export default RecruitersJobPage;
