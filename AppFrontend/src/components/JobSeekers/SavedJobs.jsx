import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Avatar,
  Alert,
  Stack,
  useTheme,
  alpha,
  IconButton,
  Card,
  CardActionArea,
  CardContent,
  Tooltip,
  useMediaQuery,
  Container,
  CircularProgress
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
  AttachMoney as SalaryIcon,
  ErrorOutline as ErrorIcon,
  Info as InfoIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../auth/AuthContext';
import { fetchSavedJobs, unsaveJob } from '../../api/api';
import { formatDistanceToNow } from 'date-fns';


const SavedJobs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingJobId, setDeletingJobId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Custom border radius for more curved corners
  const borderRadius = '8px';

  // Function to load saved jobs
  const loadSavedJobs = useCallback(async () => {
    // Ensure we're reading from localStorage if context hasn't initialized yet
    let userFromStorage = null;
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        userFromStorage = JSON.parse(userStr);
      }
    } catch (err) {
      console.error('Error parsing user from localStorage:', err);
    }
    
    // Check authentication from both context and localStorage
    if (!currentUser && !userFromStorage) {
      setLoading(false);
      setError("Please login to view your saved jobs");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      
      // Use the real API call
      const response = await fetchSavedJobs();
      
      if (response && response.savedJobs) {
        setSavedJobs(response.savedJobs);
        if (response.savedJobs.length === 0) {
        }
      } else {
        console.warn("Unexpected response format from fetchSavedJobs:", response);
        setSavedJobs([]);
      }
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
      setError('Failed to load your saved jobs. Please try again.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [currentUser]);

  // Load saved jobs on component mount
  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);

  // Handle removing a job from saved list
  const handleUnsaveJob = async (jobId) => {
    if (!jobId) return;
    
    setDeletingJobId(jobId);
    
    try {
      
      // Use the real API call
      await unsaveJob(jobId);
      
      // Remove the job from state
      setSavedJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
    } catch (err) {
      console.error('Error removing saved job:', err);
      setError('Failed to remove job from saved list. Please try again.');
    } finally {
      setDeletingJobId(null);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadSavedJobs();
    } catch (err) {
      console.error("Error during manual refresh:", err);
    }
  };

  // Format salary range for display
  const formatSalaryRange = (min, max, type) => {
    if (!min && !max) return 'Salary not specified';
    
    const formatSalary = (amount) => {
      if (!amount) return '';
      return amount >= 1000 ? `$${(amount/1000).toFixed(0)}k` : `$${amount}`;
    };
    
    if (min && max) {
      return `${formatSalary(min)} - ${formatSalary(max)} ${type || 'annually'}`;
    } else if (min) {
      return `From ${formatSalary(min)} ${type || 'annually'}`;
    } else if (max) {
      return `Up to ${formatSalary(max)} ${type || 'annually'}`;
    }
  };

  // Renders the page header with title and action buttons
  const renderPageHeader = () => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      flexWrap: 'wrap',
      mb: 3
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: { xs: 2, sm: 0 }
        }}
      >
        Saved Jobs
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Tooltip title="Refresh saved jobs">
          {loading || isRefreshing ? (
            <span>
              <IconButton 
                color="primary"
                onClick={handleRefresh}
                disabled={true}
                sx={{
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: '4px',
                }}
              >
                <CircularProgress size={24} color="inherit" />
              </IconButton>
            </span>
          ) : (
            <IconButton 
              color="primary"
              onClick={handleRefresh}
              sx={{
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: '4px',
              }}
            >
              <RefreshIcon />
            </IconButton>
          )}
        </Tooltip>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/jobs')}
          sx={{
            borderRadius: '4px',
            textTransform: 'none',
            px: 3,
            py: 1,
            boxShadow: theme.shadows[1],
            '&:hover': {
              boxShadow: theme.shadows[2],
            }
          }}
        >
          Browse Jobs
        </Button>
      </Box>
    </Box>
  );

  // Render loading skeletons
  const renderSkeletons = () => {
    return (
      <Grid container spacing={3}>
        {Array(3).fill().map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
      <Card 
        elevation={0}
        sx={{ 
                height: '100%',
                borderRadius: borderRadius,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={45} height={45} sx={{ mr: 1.5 }} />
            <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" height={24} />
                    <Skeleton variant="text" width="40%" height={18} />
            </Box>
          </Box>
          <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={36} sx={{ mt: 2, borderRadius: '4px' }} />
        </CardContent>
      </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: alpha(theme.palette.primary.main, 0.03)
      }}
    >
      <BookmarkBorderIcon
        sx={{
          fontSize: 64,
          color: theme.palette.grey[400],
          mb: 2,
        }}
      />
      <Typography variant="h6" gutterBottom>
        No saved jobs yet
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 500 }}
      >
        When you find jobs you're interested in, save them here to apply later or keep track of opportunities.
      </Typography>
      <Button
        variant="contained"
        startIcon={<SearchIcon />}
        onClick={() => navigate('/jobs')}
        sx={{
          borderRadius: '4px',
          textTransform: 'none',
        }}
      >
        Browse Jobs
      </Button>
    </Paper>
  );

  // Render error state
  const renderError = () => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: alpha(theme.palette.error.main, 0.03),
        mb: 3
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: '4px',
            flexGrow: 1
          }}
        >
          <Typography variant="subtitle1" fontWeight={500} gutterBottom>
            We're having trouble loading your saved jobs
          </Typography>
          <Typography variant="body2">
            {typeof error === 'string' ? error : 'There was an error retrieving your saved jobs data. This might be a temporary issue with the server.'}
          </Typography>
        </Alert>
      </Box>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
        <Button 
          variant="contained"
          onClick={handleRefresh}
          sx={{ 
            mr: 2,
            borderRadius: '4px',
            textTransform: 'none'
          }}
        >
          Retry Loading
        </Button>
        
        <Button
          variant="outlined"
          onClick={() => navigate('/jobs')}
          sx={{ 
            borderRadius: '4px',
            textTransform: 'none'
          }}
        >
          Browse Available Jobs
        </Button>
      </Box>
    </Paper>
  );

  // Render job cards
  const renderJobCard = (job) => {
    const isDeleting = deletingJobId === job._id;
    
    return (
      <Grid item xs={12} sm={6} md={4} key={job._id}>
      <Card
        elevation={0}
        sx={{
            height: '100%',
            borderRadius: borderRadius,
          border: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: theme.palette.primary.main,
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[2],
            },
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Blue bookmark banner */}
            <Box 
              sx={{ 
                width: '100%', 
                p: 0.5, 
                textAlign: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main
              }}
            >
              <Typography variant="caption" fontWeight={500} sx={{ textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookmarkIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem' }} />
                Saved Job
              </Typography>
            </Box>
            
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    flex: 1,
                    cursor: 'pointer',
                  }}
                >
                  <Avatar
                    src={job.company?.logo}
                    alt={job.company?.name || 'Company logo'}
                    sx={{
                      width: 45,
                      height: 45,
                      mr: 1.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.1)
                    }}
                  >
                    {job.company?.name?.charAt(0) || <BusinessIcon />}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: theme.typography.fontWeightBold,
                        fontSize: '1rem',
                        lineHeight: 1.3,
                        color: theme.palette.text.primary,
                        mb: 0.5
                      }}
                    >
                      {job.title || 'Untitled Position'}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      noWrap
                    >
                      {job.company?.name || 'Unknown Company'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box>
                  <Tooltip title="Remove from saved">
                    {isDeleting ? (
                      <span>
                        <IconButton
                          disabled={true}
                          size="small"
                          sx={{
                            color: 'action.disabled',
                          }}
                        >
                          <CircularProgress size={20} color="inherit" />
                        </IconButton>
                      </span>
                    ) : (
                    <IconButton
                      onClick={() => handleUnsaveJob(job._id)}
                      size="small"
                      sx={{
                          color: 'error.main',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                        },
                      }}
                    >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Tooltip>
                </Box>
              </Box>
            
              <Box 
                sx={{
                  display: "flex", 
                  alignItems: "center",
                  mt: 1,
                  mb: 0.5,
                  color: 'text.secondary'
                }}
              >
                <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.9rem' }} />
                <Typography variant="body2" noWrap>
                  {job.location || "Location not specified"}
              </Typography>
              </Box>
              
                {job.jobType && (
                <Box 
                    sx={{
                    display: "flex", 
                    alignItems: "center",
                    mb: 1,
                    color: 'text.secondary'
                  }}
                >
                  <WorkIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.9rem' }} />
                  <Typography variant="body2" noWrap>
                    {job.jobType}
                  </Typography>
                </Box>
                )}
                
                {(job.salaryMin || job.salaryMax) && (
                <Box 
                    sx={{
                    display: "flex", 
                    alignItems: "center",
                    mb: 1,
                    color: 'text.secondary'
                  }}
                >
                  <SalaryIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.9rem' }} />
                  <Typography variant="body2" noWrap>
                    {formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryType)}
                  </Typography>
                </Box>
                )}
                
                {job.savedAt && (
                <Box 
                    sx={{
                    display: "flex", 
                    alignItems: "center",
                    mb: 1,
                    color: 'text.secondary'
                  }}
                >
                  <InfoIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.9rem' }} />
                  <Typography variant="body2">
                    Saved: {formatDistanceToNow(new Date(job.savedAt), { addSuffix: true })}
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 1.5 }} />
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="medium"
                sx={{
                  mt: 2,
                  borderRadius: '6px',
                  textTransform: 'none',
                }}
                onClick={() => {
                  try {
                    if (!job._id) {
                      console.error("Cannot navigate to apply page: missing job ID");
                      return;
                    }
                    navigate(`/apply-job/${job._id}`);
                  } catch (err) {
                    console.error("Error navigating to apply page:", err);
                    // Fallback to jobs list on error
                    navigate('/jobs');
                  }
                }}
                >
                  Apply Now
                </Button>
              </Box>
        </CardContent>
      </Card>
      </Grid>
    );
  };

  // Main render function
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {renderPageHeader()}
      
      {isRefreshing && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 4 }}>
          <CircularProgress size={40} />
        </Box>
      )}
      
      {error && !isRefreshing && renderError()}
      
      {!error && loading && !isRefreshing && renderSkeletons()}
      
      {!error && !loading && !isRefreshing && savedJobs.length === 0 && renderEmptyState()}
      
      {!error && !loading && savedJobs.length > 0 && (
        <Grid container spacing={3}>
          {savedJobs.map(job => renderJobCard(job))}
        </Grid>
      )}
    </Container>
  );
};

export default SavedJobs; 