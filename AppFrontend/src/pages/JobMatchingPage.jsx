// src/pages/JobMatchingPage.jsx

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  alpha,
  Divider,
  Alert,
  TextField,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import {
  fetchAllApplicants,
  analyzeApplicationMatching,
  getRecruiterJobs,
  fetchRecruiterJobDetails, // used for debugging job details if missing
} from "../api/api";
import MatchingDetails from "./MatchingDetails";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const JobMatchingPage = () => {
  const theme = useTheme();
  // State for all applications (fetched without a job filter)
  const [allApplications, setAllApplications] = useState([]);
  // State for filtered applications (based on job filter)
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(""); // "" means show all
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState({});
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });

  // Threshold for accepting the applicant (e.g., 50%)
  const MATCH_THRESHOLD = 50;

  // Fetch all applicants and recruiter jobs on mount
  useEffect(() => {
    loadData();
  }, []);

    const loadData = async () => {
      try {
        setRefreshing(true);
      setError("");
      
        // Fetch all applicants from the backend
        const applicantData = await fetchAllApplicants();
        const apps = applicantData.applications || applicantData;
      
      if (!apps || apps.length === 0) {
        setNotification({
          open: true,
          message: "No applications found",
          severity: "info"
        });
      } else {
        setAllApplications(apps);
        setFilteredApplications(apps);
      }

        // Fetch all jobs posted by the recruiter (for the dropdown filter)
        const jobsData = await getRecruiterJobs();
      const jobsList = jobsData.jobs || jobsData;
      
      if (!jobsList || jobsList.length === 0) {
        setNotification({
          open: true,
          message: "No jobs found",
          severity: "info"
        });
      } else {
        setJobs(jobsList);
      }
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
      setNotification({
        open: true,
        message: `Error loading data: ${err.message || "Unknown error"}`,
        severity: "error"
      });
        console.error("Error in loadData:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  // Filter applications when the selected job changes
  useEffect(() => {
    applyFilters();
  }, [selectedJobId, allApplications, searchTerm]);

  // Apply all filters (job and search)
  const applyFilters = () => {
    let results = [...allApplications];
    
    // Filter by job
    if (selectedJobId) {
      results = results.filter(
        (app) => app.job && app.job._id === selectedJobId
      );
    }
    
    // Filter by search term
    if (searchTerm.trim() !== "") {
      results = results.filter(app => {
        const name = app.resume?.name || app.user?.fullName || "";
        const email = app.resume?.email || app.user?.email || "";
        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    setFilteredApplications(results);
  };

  // Handler for job filter dropdown change
  const handleJobFilterChange = (e) => {
    setSelectedJobId(e.target.value);
  };

  // Handler to refresh data
  const handleRefreshData = async () => {
    await loadData();
  };

  // Handler to trigger AI matching analysis for an application using only applicationId
  const handleAnalyze = async (applicationId) => {
    try {
      // Set updating status for this application
      setStatusUpdating((prev) => ({ ...prev, [applicationId]: true }));

      // Retrieve the application from state
      const appToAnalyze = allApplications.find((app) => app._id === applicationId);
      if (!appToAnalyze) {
        setNotification({
          open: true,
          message: `Application not found with ID: ${applicationId}`,
          severity: "error"
        });
        return;
      }
      
      // Show notification for analysis start
      setNotification({
        open: true,
        message: "AI analysis in progress... This may take a moment.",
        severity: "info"
      });
      
      // Trigger analysis using only the applicationId
      const result = await analyzeApplicationMatching(applicationId);

      // Check if the response indicates a successful analysis
      if (!result.success && !result.analysis) {
        throw new Error(result.message || "Analysis failed");
      }

      // Extract analysis data
      const { analysis } = result;
      
      // Show success message
      setNotification({
        open: true,
        message: `Analysis complete! Match score: ${analysis.score}%`,
        severity: "success"
      });

      // Update the applications in state with the new analysis results
      const updatedApps = allApplications.map(app => {
        if (app._id === applicationId) {
          return {
            ...app,
            applicationMatch: {
              ...app.applicationMatch,
              overallScore: analysis.score,
              summaryComment: analysis.summary_comment,
              detailedScores: {
                degree: analysis.degree,
                experience: analysis.experience,
                technical_skill: analysis.technical_skill,
                responsibility: analysis.responsibility,
                certificate: analysis.certificate,
                soft_skill: analysis.soft_skill,
              }
            }
          };
        }
        return app;
      });
      
      // Update state with the new data
      setAllApplications(updatedApps);
    } catch (err) {
      console.error("Error in analysis process:", err);
      setNotification({
        open: true,
        message: `Analysis failed: ${err.message || "Unknown error"}`,
        severity: "error"
      });
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  // Open the Matching Details modal for an application
  const handleOpenDetails = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedApplicationId(null);
  };

  // Close notification handler
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Get color for match score
  const getScoreColor = (score) => {
    if (score === undefined) return theme.palette.text.secondary;
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    if (score >= MATCH_THRESHOLD) return theme.palette.info.main;
    return theme.palette.error.main;
  };

  // Render match score with visual indicators
  const renderMatchScore = (score) => {
    if (score === undefined) return (
      <Typography variant="body2" color="text.secondary">
        Not analyzed
      </Typography>
    );

    const scoreColor = getScoreColor(score);
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress 
            variant="determinate"
            value={score}
            sx={{
              height: 8,
              borderRadius: 5,
              backgroundColor: alpha(scoreColor, 0.1),
              '& .MuiLinearProgress-bar': {
                backgroundColor: scoreColor,
              }
            }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" fontWeight="bold" color={scoreColor}>
              {score}%
            </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <AnalyticsIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
          Candidate Matching
          </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRefreshData}
          disabled={refreshing}
          sx={{ fontWeight: 'medium' }}
        >
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, mb: 4, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="job-filter-label">Filter by Job</InputLabel>
        <Select
          labelId="job-filter-label"
          value={selectedJobId}
          onChange={handleJobFilterChange}
                label="Filter by Job"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterAltIcon color="action" />
                  </InputAdornment>
                }
        >
          <MenuItem value="">
            <em>All Jobs</em>
          </MenuItem>
          {jobs.map((job) => (
            <MenuItem key={job._id} value={job._id}>
                    {job.title} - {job.company}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Candidates"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 8 }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
            Loading application data...
          </Typography>
        </Box>
      ) : filteredApplications.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 5, 
            textAlign: 'center',
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            borderRadius: 2
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No applications found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedJobId 
              ? "No applications for the selected job. Try selecting a different job." 
              : "No applications have been received yet."}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
          <Table>
            <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <TableRow>
                <TableCell width="5%">#</TableCell>
                <TableCell width="25%">Candidate</TableCell>
                <TableCell width="35%">Analysis</TableCell>
                <TableCell width="15%">Match Score</TableCell>
                <TableCell width="20%">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications.map((app, index) => {
                // Extract name and email from either the resume or the user object
                const displayName = app.resume?.name || app.user?.fullName || "Unknown Candidate";
                const displayEmail = app.resume?.email || app.user?.email || "No email available";
                
                // Extract scores and comments from the applicationMatch if it exists
                const currentScore = app.applicationMatch?.overallScore;
                const currentComment = app.applicationMatch?.summaryComment;

                return (
                  <TableRow 
                    key={app._id}
                    hover
                    sx={{
                      '&:nth-of-type(even)': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                      },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            width: 40,
                            height: 40,
                            mr: 1.5,
                          }}
                        >
                          {displayName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {displayName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {displayEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {currentComment || "No analysis available"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {renderMatchScore(currentScore)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {statusUpdating[app._id] ? (
                          <Button
                            fullWidth
                            variant="outlined"
                            disabled
                            startIcon={<CircularProgress size={20} />}
                            sx={{ 
                              py: 0.7,
                              fontWeight: 'medium',
                            }}
                          >
                            Analyzing...
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                        onClick={() => handleAnalyze(app._id)}
                            sx={{ 
                              py: 0.7,
                              fontWeight: 'medium',
                            }}
                          >
                            {currentScore === undefined ? 'Analyze' : 'Re-analyze'}
                      </Button>
                        )}
                        
                      <Button
                          fullWidth
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenDetails(app._id)}
                          disabled={currentScore === undefined}
                          sx={{
                            py: 0.7,
                            fontWeight: 'medium',
                            bgcolor: currentScore !== undefined ? alpha(theme.palette.primary.main, 0.05) : 'transparent'
                          }}
                      >
                        Details
                      </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Matching Details Popup */}
      {selectedApplicationId && (
        <MatchingDetails
          applicationId={selectedApplicationId}
          open={isDetailsOpen}
          onClose={handleCloseDetails}
        />
      )}

      {/* Notifications */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default JobMatchingPage;
