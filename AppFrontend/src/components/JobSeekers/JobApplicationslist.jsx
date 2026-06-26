// components/JobSeekers/JobApplications.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Box,
  Chip,
  Avatar,
  Divider,
  Paper,
  useTheme,
  alpha,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useFetchJobApplications from '../../hooks/useFetchJobApplications';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../auth/AuthContext'; // Assuming you have an auth context

const JobApplications = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  // Custom border radius for more curved corners
  const borderRadius = '8px';

  // Use the custom hook to fetch the current user's job applications.
  const { applications, loading, error, refetch } = useFetchJobApplications();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error("Error during manual refresh:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000); // Ensure user sees the refresh animation for at least 1 second
    }
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (newFilter) => {
    setFilterStatus(newFilter);
    handleFilterClose();
  };

  const handleSortChange = (newSort) => {
    setSortOrder(newSort);
    handleFilterClose();
  };

  const filteredAndSortedApplications = useMemo(() => {
    if (!applications || !Array.isArray(applications)) return [];



    // First filter by status
    let result = [...applications];

    if (filterStatus !== 'all') {
      result = result.filter(app => {
        const status = (app.status || "pending").toLowerCase();
        return status === filterStatus.toLowerCase();
      });
    }

    // Then filter by search term (job title or company)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(app => {
        const jobTitle = (app.jobTitle || app.job?.title || "").toLowerCase();
        const companyName = (app.companyName || app.job?.companyName || app.company?.name || "").toLowerCase();
        return jobTitle.includes(term) || companyName.includes(term);
      });
    }

    // Then sort
    result.sort((a, b) => {
      const dateA = new Date(a.appliedDate || a.createdAt || a.created_at || 0);
      const dateB = new Date(b.appliedDate || b.createdAt || b.created_at || 0);

      if (sortOrder === 'newest') {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });

    return result;
  }, [applications, filterStatus, sortOrder, searchTerm]);



  // Helper function to get status chip color
  const getStatusColor = (status) => {
    if (!status) return {
      color: 'text.secondary',
      backgroundColor: alpha(theme.palette.grey[500], 0.08),
      borderColor: 'divider'
    };

    const statusLower = status.toLowerCase();

    switch (statusLower) {
      case 'pending':
        return {
          color: 'warning.main',
          backgroundColor: alpha(theme.palette.warning.main, 0.08),
          borderColor: 'warning.main'
        };
      case 'approved':
      case 'accepted':
        return {
          color: 'success.main',
          backgroundColor: alpha(theme.palette.success.main, 0.08),
          borderColor: 'success.main'
        };
      case 'rejected':
        return {
          color: 'error.main',
          backgroundColor: alpha(theme.palette.error.main, 0.08),
          borderColor: 'error.main'
        };
      case 'in review':
      case 'interviewing':
      case 'on process':
        return {
          color: 'info.main',
          backgroundColor: alpha(theme.palette.info.main, 0.08),
          borderColor: 'info.main'
        };
      default:
        return {
          color: 'text.secondary',
          backgroundColor: alpha(theme.palette.grey[500], 0.08),
          borderColor: 'divider'
        };
    }
  };

  // Format application date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Unknown date";
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      console.error("Error formatting date:", e, "dateString:", dateString);
      return "Unknown date";
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
        My Applications
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Tooltip title="Refresh applications list">
          <IconButton
            color="primary"
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            sx={{
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: '4px',
            }}
          >
            {isRefreshing ?
              <CircularProgress size={24} color="inherit" /> :
              <RefreshIcon />
            }
          </IconButton>
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

  // Render the filter controls
  const renderFilterControls = () => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2
      }}
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        width: { xs: '100%', md: 'auto' }
      }}>
        <TextField
          placeholder="Search by title or company"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            maxWidth: { xs: '100%', md: '300px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px',
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{
        display: 'flex',
        gap: 2,
        width: { xs: '100%', md: 'auto' },
        flexWrap: 'wrap'
      }}>
        <FormControl
          variant="outlined"
          size="small"
          sx={{
            minWidth: 120,
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px',
            }
          }}
        >
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="on process">In Review</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          variant="outlined"
          size="small"
          sx={{
            minWidth: 120,
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px',
            }
          }}
        >
          <InputLabel id="sort-order-label">Sort By</InputLabel>
          <Select
            labelId="sort-order-label"
            id="sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );

  // Render the summary stats
  const renderApplicationStats = () => {
    // Count applications by status
    const counts = applications?.reduce((acc, app) => {
      const status = (app.status || "pending").toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {}) || {};

    const totalCount = applications?.length || 0;
    const pendingCount = counts['pending'] || 0;
    const acceptedCount = counts['accepted'] || 0;
    const rejectedCount = counts['rejected'] || 0;

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" color="text.primary" fontWeight={600}>{totalCount}</Typography>
            <Typography variant="body2" color="text.secondary">Total Applications</Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              textAlign: 'center',
              borderLeft: `4px solid ${theme.palette.warning.main}`
            }}
          >
            <Typography variant="h5" color="warning.main" fontWeight={600}>{pendingCount}</Typography>
            <Typography variant="body2" color="text.secondary">Pending</Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              textAlign: 'center',
              borderLeft: `4px solid ${theme.palette.success.main}`
            }}
          >
            <Typography variant="h5" color="success.main" fontWeight={600}>{acceptedCount}</Typography>
            <Typography variant="body2" color="text.secondary">Accepted</Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              textAlign: 'center',
              borderLeft: `4px solid ${theme.palette.error.main}`
            }}
          >
            <Typography variant="h5" color="error.main" fontWeight={600}>{rejectedCount}</Typography>
            <Typography variant="body2" color="text.secondary">Rejected</Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  // Loading skeleton
  if (loading && !isRefreshing) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {renderPageHeader()}
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 3, borderRadius: borderRadius }} />

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={6} sm={3} key={item}>
              <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: borderRadius }} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: borderRadius,
                  border: `1px solid ${theme.palette.divider}`,
                  height: '100%'
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="70%" height={24} />
                      <Skeleton variant="text" width="40%" height={18} />
                    </Box>
                  </Box>
                  <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" width="100%" height={36} sx={{ mt: 1, borderRadius: '4px' }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  // Error state
  if (error && !isRefreshing) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {renderPageHeader()}

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
                We're having trouble loading your applications
              </Typography>
              <Typography variant="body2">
                {typeof error === 'string' ? error : 'There was an error retrieving your application data. This might be a temporary issue with the server.'}
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

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Note: If this issue persists, please check back later. Our team might be performing server maintenance.
        </Typography>
      </Container>
    );
  }

  // No applications
  if ((!applications || applications.length === 0) && !isRefreshing) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {renderPageHeader()}

        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: borderRadius,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.primary.main, 0.03)
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: 'primary.main',
                margin: '0 auto',
                mb: 2,
                borderRadius: '8px',
              }}
            >
              <WorkIcon fontSize="large" />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              No job applications yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Start your job search journey by exploring available positions and applying
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/jobs')}
            sx={{
              borderRadius: '4px',
              textTransform: 'none',
            }}
          >
            Find Jobs
          </Button>
        </Paper>
      </Container>
    );
  }

  // No filtered results
  if (filteredAndSortedApplications.length === 0 && applications.length > 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {renderPageHeader()}
        {renderFilterControls()}
        {renderApplicationStats()}

        <Paper
          elevation={0}
          sx={{
            p: 3,
            textAlign: 'center',
            borderRadius: borderRadius,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.info.main, 0.03)
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            No applications match your filters
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Try adjusting your search criteria or filter options
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setFilterStatus('all');
              setSortOrder('newest');
              setSearchTerm('');
            }}
            sx={{
              borderRadius: '4px',
              textTransform: 'none',
            }}
          >
            Clear Filters
          </Button>
        </Paper>
      </Container>
    );
  }

  // Applications list
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {renderPageHeader()}
      {renderFilterControls()}
      {renderApplicationStats()}

      {isRefreshing && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 4 }}>
          <CircularProgress size={40} />
        </Box>
      )}

      <Grid container spacing={0}>
        {filteredAndSortedApplications.map((application, index) => {

          // Extract job info from either the application or the job object
          const jobTitle = application.jobTitle || application.job?.title || "Untitled Position";

          // Improved company data extraction
          let companyName = application.companyName;
          if (!companyName) {
            companyName = application.company?.name ||
              application.job?.company?.name ||
              application.job?.companyName ||
              "Unknown Company";
          }

          // Better logo extraction logic
          let companyLogo = null;
          if (application.company && application.company.logo) {
            companyLogo = application.company.logo;
          } else if (application.job?.company?.logo) {
            companyLogo = application.job.company.logo;
          } else if (application.job?.companyLogo) {
            companyLogo = application.job.companyLogo;
          }

          const location = application.location || application.job?.location || "Location N/A";
          const applicationDate = application.appliedDate || application.createdAt || application.created_at || null;
          const status = application.status || "PENDING";
          const jobId = application.jobId || application.job?._id || application.job?.id || "";



          return (
            <Grid item xs={12} sm={6} md={4} key={application._id || application.id || index} sx={{ p: 1 }}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: borderRadius,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[2],
                    borderColor: theme.palette.primary.main
                  },
                  overflow: 'hidden'
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  {/* Status banner */}
                  <Box
                    sx={{
                      width: '100%',
                      p: 0.5,
                      textAlign: 'center',
                      ...getStatusColor(status)
                    }}
                  >
                    <Typography variant="caption" fontWeight={500} sx={{ textTransform: 'uppercase' }}>
                      {status}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Avatar
                        src={companyLogo}
                        alt={companyName}
                        sx={{
                          width: 45,
                          height: 45,
                          mr: 1.5,
                          bgcolor: alpha(theme.palette.primary.main, 0.1)
                        }}
                      >
                        {companyName ? companyName.charAt(0).toUpperCase() : <BusinessIcon />}
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          noWrap
                          sx={{ fontSize: '1rem', lineHeight: 1.3 }}
                        >
                          {jobTitle}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" noWrap>
                          {companyName}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 0.5,
                        color: 'text.secondary'
                      }}
                    >
                      <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.9rem' }} />
                      <Typography variant="body2" noWrap>
                        {location}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        color: 'text.secondary'
                      }}
                    >
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.9rem' }} />
                      <Typography variant="body2">
                        Applied: {formatDate(applicationDate)}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => jobId && navigate(`/jobs/${jobId}`)}
                        startIcon={<VisibilityIcon fontSize="small" />}
                        sx={{
                          color: theme.palette.primary.main,
                          borderColor: alpha(theme.palette.primary.main, 0.5),
                          borderRadius: '6px',
                          textTransform: 'none',
                          opacity: jobId ? 1 : 0.5
                        }}
                        disabled={!jobId}
                      >
                        View Job Details
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default JobApplications;
